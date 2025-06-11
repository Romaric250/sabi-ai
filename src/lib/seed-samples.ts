import { PrismaClient } from '@prisma/client';
import { createPromptHash } from './vector-db';

const prisma = new PrismaClient();

const sampleRoadmapsData = [
  {
    prompt: "Algebra Fundamentals",
    content: {
      stages: [
        {
          id: "1",
          title: "Linear Equations",
          description: "Understanding and solving linear equations",
          lessons: ["One-Variable Equations", "Two-Variable Systems", "Word Problems"],
          materials: [
            {
              title: "Introduction to Linear Equations",
              type: "text",
              content: "# Linear Equations\n\nLinear equations are the foundation of algebra. A linear equation is an equation where the highest power of the variable is 1.\n\n## Key Concepts\n- **Standard Form**: ax + b = c\n- **Slope-Intercept Form**: y = mx + b\n- **Point-Slope Form**: y - y₁ = m(x - x₁)\n\n## Solving Steps\n1. Isolate the variable\n2. Use inverse operations\n3. Check your solution\n\n## Real-World Applications\nLinear equations model many real-world situations like calculating costs, determining rates, and predicting trends.",
              readTime: "15 min"
            }
          ],
          quiz: [
            {
              question: "Solve for x: 2x + 5 = 13",
              options: ["x = 4", "x = 6", "x = 8", "x = 9"],
              correct: 0,
              explanation: "Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4"
            }
          ],
          position: { x: 2, y: 0 },
          color: "from-blue-400 to-cyan-500"
        },
        {
          id: "2",
          title: "Quadratic Functions",
          description: "Exploring parabolas and quadratic equations",
          lessons: ["Standard Form", "Vertex Form", "Factoring", "Quadratic Formula"],
          materials: [
            {
              title: "Understanding Quadratic Functions",
              type: "text",
              content: "# Quadratic Functions\n\nQuadratic functions create parabolic graphs and have the form f(x) = ax² + bx + c.\n\n## Key Features\n- **Vertex**: The highest or lowest point\n- **Axis of Symmetry**: Vertical line through vertex\n- **Roots/Zeros**: Where the parabola crosses x-axis\n\n## Solving Methods\n1. Factoring\n2. Completing the square\n3. Quadratic formula: x = (-b ± √(b²-4ac))/2a",
              readTime: "20 min"
            }
          ],
          quiz: [
            {
              question: "What is the vertex of y = x² - 4x + 3?",
              options: ["(2, -1)", "(2, 1)", "(-2, -1)", "(-2, 1)"],
              correct: 0,
              explanation: "Use vertex formula: x = -b/2a = 4/2 = 2, then y = 4 - 8 + 3 = -1"
            }
          ],
          position: { x: 1, y: 1 },
          color: "from-purple-400 to-pink-500"
        }
      ],
      finalQuiz: {
        title: "Algebra Fundamentals Assessment",
        description: "Test your understanding of algebraic concepts",
        questions: [
          {
            question: "Solve: 3x - 7 = 2x + 5",
            options: ["x = 12", "x = 6", "x = -2", "x = 2"],
            correct: 0,
            explanation: "3x - 2x = 5 + 7, so x = 12"
          }
        ],
        passingScore: 70,
        timeLimit: 30
      }
    }
  },
  {
    prompt: "Biology: Cell Structure & Function", 
    content: {
      stages: [
        {
          id: "1",
          title: "Cell Theory",
          description: "Understanding the fundamental principles of cell biology",
          lessons: ["History of Cell Discovery", "Three Principles", "Types of Cells"],
          materials: [
            {
              title: "The Cell Theory",
              type: "text", 
              content: "# Cell Theory\n\nThe cell theory is one of the fundamental principles of biology.\n\n## Three Main Principles\n1. **All living things are made of cells**\n2. **Cells are the basic unit of life**\n3. **All cells come from pre-existing cells**\n\n## Historical Development\n- Robert Hooke (1665): First observed cells\n- Anton van Leeuwenhoek: Observed living cells\n- Matthias Schleiden & Theodor Schwann: Formulated cell theory",
              readTime: "12 min"
            }
          ],
          quiz: [
            {
              question: "Who first observed and named cells?",
              options: ["Robert Hooke", "Anton van Leeuwenhoek", "Matthias Schleiden", "Louis Pasteur"],
              correct: 0,
              explanation: "Robert Hooke first observed cork cells under a microscope in 1665"
            }
          ],
          position: { x: 2, y: 0 },
          color: "from-green-400 to-emerald-500"
        }
      ],
      finalQuiz: {
        title: "Cell Biology Assessment",
        description: "Test your knowledge of cell structure and function",
        questions: [
          {
            question: "Which organelle is known as the powerhouse of the cell?",
            options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
            correct: 1,
            explanation: "Mitochondria produce ATP, the cell's energy currency"
          }
        ],
        passingScore: 75,
        timeLimit: 25
      }
    }
  }
];

export async function seedSampleRoadmaps() {
  try {
    console.log('Seeding sample roadmaps...');
    
    for (const roadmapData of sampleRoadmapsData) {
      const promptHash = createPromptHash(roadmapData.prompt);
      
      // Check if roadmap already exists
      const existing = await prisma.roadmap.findUnique({
        where: { promptHash }
      });
      
      if (!existing) {
        await prisma.roadmap.create({
          data: {
            prompt: roadmapData.prompt,
            promptHash,
            content: roadmapData.content
          }
        });
        console.log(`Created roadmap: ${roadmapData.prompt}`);
      } else {
        console.log(`Roadmap already exists: ${roadmapData.prompt}`);
      }
    }
    
    console.log('Sample roadmaps seeded successfully!');
  } catch (error) {
    console.error('Error seeding sample roadmaps:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
