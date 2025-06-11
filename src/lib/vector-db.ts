import { prisma } from './prisma';
import crypto from 'crypto';

// Generate embedding using OpenAI (you can replace with your preferred embedding model)
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002',
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Create a hash for the prompt to enable quick lookups
export function createPromptHash(prompt: string): string {
  return crypto.createHash('sha256').update(prompt.toLowerCase().trim()).digest('hex');
}

// Search for similar roadmaps using hash-based matching (simplified for now)
export async function findSimilarRoadmap(prompt: string, threshold: number = 0.8): Promise<any | null> {
  try {
    const promptHash = createPromptHash(prompt);

    // Check for exact hash match
    const exactMatch = await prisma.roadmap.findUnique({
      where: { promptHash },
    });

    if (exactMatch) {
      console.log('Found exact match for prompt hash:', promptHash);
      return exactMatch;
    }

    // For now, we'll just do exact matching
    // TODO: Implement vector similarity search when pgvector is available
    console.log('No exact match found for prompt hash:', promptHash);
    return null;
  } catch (error) {
    console.error('Error finding similar roadmap:', error);
    return null;
  }
}

// Store a new roadmap (simplified without embeddings for now)
export async function storeRoadmap(prompt: string, content: any): Promise<any> {
  try {
    const promptHash = createPromptHash(prompt);

    const roadmap = await prisma.roadmap.create({
      data: {
        prompt,
        promptHash,
        content,
      },
    });

    console.log('Successfully stored roadmap with hash:', promptHash);
    return roadmap;
  } catch (error) {
    console.error('Error storing roadmap:', error);
    throw error;
  }
}
