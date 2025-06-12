-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the Roadmap table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Roadmap" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "prompt" TEXT NOT NULL,
  "promptHash" TEXT NOT NULL,
  "content" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "isPublic" BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Roadmap_prompt_key" UNIQUE ("prompt"),
  CONSTRAINT "Roadmap_promptHash_key" UNIQUE ("promptHash")
);

-- Add embedding column to roadmap table
ALTER TABLE "Roadmap" ADD COLUMN IF NOT EXISTS "embedding" vector(1536);

-- Create HNSW index for fast similarity search
CREATE INDEX ON "Roadmap" USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
