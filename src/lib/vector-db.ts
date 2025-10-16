import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import { prisma } from "./prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface VectorSimilarityResult {
  id: string;
  prompt: string;
  content: any;
  similarity: number;
}

// Request queue for managing API calls
class RequestQueue {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
        // Add delay between requests to prevent rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    this.processing = false;
  }
}

const requestQueue = new RequestQueue();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({
  model: "gemini-embedding-exp-03-07",
});

// Retry mechanism with exponential backoff
async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// Generate embeddings using Gemini
async function generateEmbeddings(text: string): Promise<number[]> {
  return await retryWithExponentialBackoff(async () => {
    const result = await requestQueue.add(async () => {
      const embedding = await embeddingModel.embedContent(text);
      // Convert the embedding values to a number array and take first 1536 dimensions
      const values = Array.from(embedding.embedding.values);
      return values.slice(0, 1536);
    });
    return result;
  });
}

// Create a hash for the prompt
function createPromptHash(prompt: string): string {
  return crypto
    .createHash("sha256")
    .update(prompt.toLowerCase().trim())
    .digest("hex");
}

// Store roadmap with vector embedding
export async function storeRoadmap(
  prompt: string,
  content: any
): Promise<string> {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user) {
    throw new Error("Unauthorized");
  }

  const hash = crypto.createHash("sha256").update(prompt).digest("hex");
  const promptHash = createPromptHash(prompt);

  try {
    const embedding = await generateEmbeddings(prompt);

    await prisma.roadmap.upsert({
      where: { id: hash },
      create: {
        id: hash,
        prompt,
        promptHash,
        content,
        userId: user.user.id,
      },
      update: {
        prompt,
        promptHash,
        content,
      },
    });

    // Then update with vector using raw SQL
    await prisma.$executeRaw`
      UPDATE "roadmaps"
      SET embedding = ${embedding}::vector
      WHERE id = ${hash}
    `;

    return hash;
  } catch (error) {
    console.error("Error storing roadmap:", error);
    throw error;
  }
}

// Find similar roadmaps
export async function findSimilarRoadmaps(
  prompt: string,
  limit: number = 5
): Promise<VectorSimilarityResult[]> {
  try {
    // Skip exact hash match to allow for more diverse content generation
    // Only use vector similarity search for better content variety
    
    const embedding = await generateEmbeddings(prompt);

    const similarRoadmaps = await prisma.$queryRaw<VectorSimilarityResult[]>`
      SELECT
        id,
        prompt,
        content,
        1 - (embedding <=> ${embedding}::vector) as similarity
      FROM "roadmaps"
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${embedding}::vector
      LIMIT ${limit}
    `;

    return similarRoadmaps;
  } catch (error) {
    console.error("Error finding similar roadmaps:", error);
    throw error;
  }
}
