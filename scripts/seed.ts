import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seeding...');

    // Simple test - create a basic roadmap
    const testRoadmap = await prisma.roadmap.create({
      data: {
        prompt: "Test Algebra",
        promptHash: "test-hash-123",
        content: {
          stages: [
            {
              id: "1",
              title: "Basic Equations",
              description: "Learn to solve basic equations"
            }
          ]
        }
      }
    });

    console.log('Created test roadmap:', testRoadmap.id);
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
