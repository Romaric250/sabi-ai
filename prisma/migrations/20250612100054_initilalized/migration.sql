/*
  Warnings:

  - You are about to drop the `Roadmap` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "roadmaps" ADD COLUMN     "embedding" vector(1536);

-- DropTable
DROP TABLE "Roadmap";
