// Temporary in-memory authentication for testing without database
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
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
    } catch (error) {
      throw error;
    }
  }

  static async signIn(email: string, password: string) {
    try {
      // Find user
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
