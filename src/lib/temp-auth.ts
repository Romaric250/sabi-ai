// Hybrid authentication system - tries database first, falls back to memory
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

interface User {
  id: string;
  email: string;
  name?: string;
  password: string;
  createdAt: Date;
}

interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

// In-memory storage (will be lost on server restart)
const users: User[] = [];
const sessions: Session[] = [];

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'temp-secret-key';

export class TempAuth {
  static async signUp(email: string, password: string, name?: string) {
    try {
      // Try database first
      try {
        // Check if user already exists in database
        const existingDbUser = await prisma.user.findUnique({
          where: { email }
        });

        if (existingDbUser) {
          throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user in database
        const dbUser = await prisma.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
          }
        });

        // Create session
        const session = await this.createSession(dbUser.id);

        return {
          user: {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
          },
          session,
        };
      } catch (dbError) {
        console.log('Database unavailable, using memory storage:', dbError);

        // Fallback to memory storage
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user in memory
        const user: User = {
          id: Math.random().toString(36).substring(2, 15),
          email,
          name,
          password: hashedPassword,
          createdAt: new Date(),
        };

        users.push(user);

        // Create session
        const session = await this.createSession(user.id);

        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          session,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  static async signIn(email: string, password: string) {
    try {
      // Try database first
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email }
        });

        if (!dbUser) {
          throw new Error('Invalid credentials');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, dbUser.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        // Create session
        const session = await this.createSession(dbUser.id);

        return {
          user: {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
          },
          session,
        };
      } catch (dbError) {
        console.log('Database unavailable, checking memory storage:', dbError);

        // Fallback to memory storage
        const user = users.find(u => u.email === email);
        if (!user) {
          throw new Error('Invalid credentials');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        // Create session
        const session = await this.createSession(user.id);

        return {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          session,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  static async createSession(userId: string) {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    const session: Session = {
      id: Math.random().toString(36).substring(2, 15),
      userId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    sessions.push(session);
    return session;
  }

  static async getSession(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const session = sessions.find(s => s.token === token && s.expiresAt > new Date());
      
      if (!session) {
        return null;
      }

      const user = users.find(u => u.id === decoded.userId);
      if (!user) {
        return null;
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        session,
      };
    } catch (error) {
      return null;
    }
  }

  static async signOut(token: string) {
    const sessionIndex = sessions.findIndex(s => s.token === token);
    if (sessionIndex > -1) {
      sessions.splice(sessionIndex, 1);
    }
  }
}
