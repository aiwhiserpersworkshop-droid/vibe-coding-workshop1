import { prisma } from '../lib/prisma';

// Test setup and cleanup utilities
export class TestResourceTracker {
  private static exampleIds: string[] = [];

  static trackExample(id: string) {
    this.exampleIds.push(id);
  }

  static async cleanup() {
    console.log('🧹 Cleaning up test resources...');
    
    // Clean up examples
    if (this.exampleIds.length > 0) {
      await prisma.example.deleteMany({
        where: {
          id: {
            in: this.exampleIds,
          },
        },
      });
      console.log(`Deleted ${this.exampleIds.length} test examples`);
      this.exampleIds = [];
    }
  }
}

// Global test setup
beforeAll(async () => {
  console.log('🚀 Setting up integration tests...');
  
  // Verify database connection
  try {
    await prisma.$connect();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
});

// Clean up after each test
afterEach(async () => {
  await TestResourceTracker.cleanup();
});

// Global test cleanup
afterAll(async () => {
  console.log('🏁 Tearing down integration tests...');
  await TestResourceTracker.cleanup();
  await prisma.$disconnect();
});

// Test data factory
export const TestDataFactory = {
  createExampleData: (overrides: Partial<{
    title: string;
    description: string;
    content: string;
    metadata: any;
  }> = {}) => ({
    title: 'Test Example',
    description: 'A test example for integration testing',
    content: 'This is the content of the test example',
    metadata: { testFlag: true, createdByTest: true },
    ...overrides,
  }),
};

// Helper function to create example via API
export const createExampleViaAPI = async (data?: any) => {
  const exampleData = TestDataFactory.createExampleData(data);
  
  const response = await fetch('http://localhost:3000/api/examples', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exampleData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create example: ${response.statusText}`);
  }

  const example = await response.json();
  TestResourceTracker.trackExample(example.id);
  return example;
};