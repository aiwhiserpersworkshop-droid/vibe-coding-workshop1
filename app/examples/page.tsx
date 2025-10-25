'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Boundary } from '#/ui/boundary';

interface Example {
  id: string;
  title: string;
  description: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function ExamplesPage() {
  const [examples, setExamples] = useState<Example[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExamples();
  }, []);

  const fetchExamples = async () => {
    try {
      const response = await fetch('/api/examples');
      if (!response.ok) {
        throw new Error('Failed to fetch examples');
      }
      const data = await response.json();
      setExamples(data.examples);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this example?')) {
      return;
    }

    try {
      const response = await fetch(`/api/examples/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete example');
      }

      setExamples(examples.filter(ex => ex.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete example');
    }
  };

  if (loading) {
    return (
      <Boundary label="Examples" animateRerendering={false}>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </Boundary>
    );
  }

  if (error) {
    return (
      <Boundary label="Examples" animateRerendering={false}>
        <div className="text-red-500">Error: {error}</div>
      </Boundary>
    );
  }

  return (
    <Boundary label="Examples" animateRerendering={false}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Examples</h1>
          <Link
            href="/examples/new"
            className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Create New
          </Link>
        </div>

        {examples.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No examples yet.</p>
            <Link
              href="/examples/new"
              className="text-white hover:text-gray-300 underline"
            >
              Create your first example
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {examples.map((example) => (
              <div
                key={example.id}
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link
                      href={`/examples/${example.id}`}
                      className="text-xl font-semibold text-white hover:text-gray-300"
                    >
                      {example.title}
                    </Link>
                    {example.description && (
                      <p className="text-gray-400 mt-2">{example.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Created: {new Date(example.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/examples/${example.id}/edit`}
                      className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(example.id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Boundary>
  );
}