import { prisma } from "./prisma";
import crypto from "crypto";
import { Prisma } from "@prisma/client";

interface VectorSimilarityResult {
  id: string;
  prompt: string;
  content: any;
  similarity: number;
}

// Generate embedding using OpenAI (you can replace with your preferred embedding model)
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        model: "text-embedding-ada-002",
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

// Create a hash for the prompt to enable quick lookups
export function createPromptHash(prompt: string): string {
  return crypto
    .createHash("sha256")
    .update(prompt.toLowerCase().trim())
    .digest("hex");
}

export async function findSimilarRoadmap(
  prompt: string,
  threshold: number = 0.8
): Promise<any | null> {
  try {
    const promptHash = createPromptHash(prompt);

    // First, try exact hash match
    const exactMatch = await prisma.roadmap.findUnique({
      where: { promptHash },
    });

    if (exactMatch) {
      console.log("Found exact match for prompt hash:", promptHash);
      return exactMatch;
    }

    // If no exact match, generate embedding for the prompt
    const promptEmbedding = await generateEmbedding(prompt);

    // Use raw SQL to perform vector similarity search
    const similarRoadmaps = await prisma.$queryRaw<VectorSimilarityResult[]>`
      SELECT id, prompt, content, 1 - (embedding <=> ${promptEmbedding}::vector) as similarity
      FROM "roadmaps"
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${promptEmbedding}::vector
      LIMIT 1
    `;

    if (
      similarRoadmaps.length > 0 &&
      similarRoadmaps[0].similarity >= threshold
    ) {
      console.log(
        "Found similar roadmap with similarity:",
        similarRoadmaps[0].similarity
      );
      return similarRoadmaps[0];
    }

    console.log("No similar roadmap found above threshold");
    return null;
  } catch (error) {
    console.error("Error finding similar roadmap:", error);
    return null;
  }
}

// Store a new roadmap with embedding
export async function storeRoadmap(prompt: string, content: any): Promise<any> {
  try {
    const promptHash = createPromptHash(prompt);
    const embedding = await generateEmbedding(prompt);

    const roadmap = await prisma.$executeRaw`
      INSERT INTO "roadmaps" (id, prompt, "promptHash", content, embedding, "createdAt", "updatedAt")
      VALUES (
        ${crypto.randomUUID()},
        ${prompt},
        ${promptHash},
        ${content}::jsonb,
        ${embedding}::vector,
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    console.log("Successfully stored roadmap with hash:", promptHash);
    return roadmap;
  } catch (error) {
    console.error("Error storing roadmap:", error);
    throw error;
  }
}
