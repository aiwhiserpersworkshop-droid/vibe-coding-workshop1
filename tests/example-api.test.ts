import './setup';
import { TestResourceTracker, TestDataFactory, createExampleViaAPI } from './setup';

const API_BASE_URL = 'http://localhost:3000';

describe('Example API Integration Tests', () => {
  
  describe('POST /api/examples', () => {
    it('should create a new example with all fields', async () => {
      const exampleData = TestDataFactory.createExampleData({
        title: 'Integration Test Example',
        description: 'Created during integration testing',
        content: 'console.log("Hello, World!");',
        metadata: { language: 'javascript', tags: ['test', 'example'] },
      });

      const response = await fetch(`${API_BASE_URL}/api/examples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exampleData),
      });

      expect(response.status).toBe(201);
      const example = await response.json();
      TestResourceTracker.trackExample(example.id);

      expect(example).toMatchObject({
        id: expect.any(String),
        title: exampleData.title,
        description: exampleData.description,
        content: exampleData.content,
        metadata: exampleData.metadata,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should create example with only required fields', async () => {
      const exampleData = {
        title: 'Minimal Example',
        content: 'Just the basics',
      };

      const response = await fetch(`${API_BASE_URL}/api/examples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exampleData),
      });

      expect(response.status).toBe(201);
      const example = await response.json();
      TestResourceTracker.trackExample(example.id);

      expect(example.title).toBe(exampleData.title);
      expect(example.content).toBe(exampleData.content);
      expect(example.description).toBeNull();
      expect(example.metadata).toEqual({});
    });

    it('should return 400 when title is missing', async () => {
      const response = await fetch(`${API_BASE_URL}/api/examples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'No title provided' }),
      });

      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.error).toContain('Title and content are required');
    });

    it('should return 400 when content is missing', async () => {
      const response = await fetch(`${API_BASE_URL}/api/examples`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'No content provided' }),
      });

      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.error).toContain('Title and content are required');
    });
  });

  describe('GET /api/examples', () => {
    it('should return paginated list of examples', async () => {
      // Create test examples
      const example1 = await createExampleViaAPI({ title: 'Example 1' });
      const example2 = await createExampleViaAPI({ title: 'Example 2' });

      const response = await fetch(`${API_BASE_URL}/api/examples`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('examples');
      expect(data).toHaveProperty('pagination');
      expect(Array.isArray(data.examples)).toBe(true);
      expect(data.examples.length).toBeGreaterThanOrEqual(2);

      // Should include our test examples
      const exampleIds = data.examples.map((ex: any) => ex.id);
      expect(exampleIds).toContain(example1.id);
      expect(exampleIds).toContain(example2.id);
    });

    it('should support pagination parameters', async () => {
      // Create test examples
      await createExampleViaAPI({ title: 'Pagination Test 1' });
      await createExampleViaAPI({ title: 'Pagination Test 2' });

      const response = await fetch(`${API_BASE_URL}/api/examples?page=1&limit=1`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.examples.length).toBe(1);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(1);
      expect(data.pagination.totalCount).toBeGreaterThanOrEqual(2);
    });

    it('should return examples ordered by creation date (newest first)', async () => {
      const older = await createExampleViaAPI({ title: 'Older Example' });
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      const newer = await createExampleViaAPI({ title: 'Newer Example' });

      const response = await fetch(`${API_BASE_URL}/api/examples`);
      const data = await response.json();

      const newerIndex = data.examples.findIndex((ex: any) => ex.id === newer.id);
      const olderIndex = data.examples.findIndex((ex: any) => ex.id === older.id);

      expect(newerIndex).toBeLessThan(olderIndex);
    });
  });

  describe('GET /api/examples/:id', () => {
    it('should return specific example by ID', async () => {
      const example = await createExampleViaAPI({
        title: 'Specific Example',
        description: 'Testing specific retrieval',
        content: 'example content',
        metadata: { test: true },
      });

      const response = await fetch(`${API_BASE_URL}/api/examples/${example.id}`);
      expect(response.status).toBe(200);

      const retrievedExample = await response.json();
      expect(retrievedExample).toMatchObject({
        id: example.id,
        title: 'Specific Example',
        description: 'Testing specific retrieval',
        content: 'example content',
        metadata: { test: true },
      });
    });

    it('should return 404 for non-existent example', async () => {
      const response = await fetch(`${API_BASE_URL}/api/examples/non-existent-id`);
      expect(response.status).toBe(404);

      const error = await response.json();
      expect(error.error).toBe('Example not found');
    });
  });

  describe('PUT /api/examples/:id', () => {
    it('should update all fields of an example', async () => {
      const example = await createExampleViaAPI();

      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
        content: 'Updated Content',
        metadata: { updated: true, version: 2 },
      };

      const response = await fetch(`${API_BASE_URL}/api/examples/${example.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);
      const updatedExample = await response.json();

      expect(updatedExample).toMatchObject(updateData);
      expect(new Date(updatedExample.updatedAt).getTime()).toBeGreaterThan(
        new Date(example.updatedAt).getTime()
      );
    });

    it('should return 404 for non-existent example', async () => {
      const response = await fetch(`${API_BASE_URL}/api/examples/non-existent-id`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test', content: 'Test' }),
      });

      expect(response.status).toBe(404);
      const error = await response.json();
      expect(error.error).toBe('Example not found');
    });
  });

  describe('PATCH /api/examples/:id', () => {
    it('should partially update an example', async () => {
      const example = await createExampleViaAPI({
        title: 'Original Title',
        description: 'Original Description',
        content: 'Original Content',
      });

      const patchData = { title: 'Patched Title' };

      const response = await fetch(`${API_BASE_URL}/api/examples/${example.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchData),
      });

      expect(response.status).toBe(200);
      const patchedExample = await response.json();

      expect(patchedExample.title).toBe('Patched Title');
      expect(patchedExample.description).toBe('Original Description');
      expect(patchedExample.content).toBe('Original Content');
    });

    it('should update metadata field only', async () => {
      const example = await createExampleViaAPI({ metadata: { version: 1 } });

      const response = await fetch(`${API_BASE_URL}/api/examples/${example.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata: { version: 2, patched: true } }),
      });

      expect(response.status).toBe(200);
      const patchedExample = await response.json();
      expect(patchedExample.metadata).toEqual({ version: 2, patched: true });
    });

    it('should return 404 for non-existent example', async () => {
      const response = await fetch(`${API_BASE_URL}/api/examples/non-existent-id`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Patch Test' }),
      });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/examples/:id', () => {
    it('should delete an example successfully', async () => {
      const example = await createExampleViaAPI();

      const response = await fetch(`${API_BASE_URL}/api/examples/${example.id}`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.message).toBe('Example deleted successfully');

      // Verify example is actually deleted
      const getResponse = await fetch(`${API_BASE_URL}/api/examples/${example.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when deleting non-existent example', async () => {
      const response = await fetch(`${API_BASE_URL}/api/examples/non-existent-id`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(404);
      const error = await response.json();
      expect(error.error).toBe('Example not found');
    });
  });

  describe('POST /api/example-job', () => {
    it('should queue an example for processing', async () => {
      const example = await createExampleViaAPI({
        title: 'Job Processing Test',
        content: 'This example will be processed by SQS/Lambda',
      });

      // Mock or skip actual SQS call for testing
      const response = await fetch(`${API_BASE_URL}/api/example-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exampleId: example.id }),
      });

      // This might fail if EXAMPLE_QUEUE_URL is not set, which is expected in test environment
      if (response.status === 500) {
        const error = await response.json();
        expect(error.error).toContain('Queue not configured');
      } else {
        expect(response.status).toBe(200);
        const result = await response.json();
        expect(result.success).toBe(true);
        expect(result.data.exampleId).toBe(example.id);
      }
    });

    it('should return 400 when exampleId is missing', async () => {
      const response = await fetch(`${API_BASE_URL}/api/example-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.error).toBe('Example ID is required');
    });

    it('should return 404 for non-existent example', async () => {
      const response = await fetch(`${API_BASE_URL}/api/example-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exampleId: 'non-existent-id' }),
      });

      expect(response.status).toBe(404);
      const error = await response.json();
      expect(error.error).toBe('Example not found');
    });
  });
});