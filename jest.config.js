module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '^#/(.*)$': '<rootDir>/$1',
  },
  testTimeout: 30000, // 30 seconds for API tests
  maxWorkers: 1, // Run tests sequentially to avoid database conflicts
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};