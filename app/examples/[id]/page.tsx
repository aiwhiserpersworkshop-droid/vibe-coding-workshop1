'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Boundary } from '#/ui/boundary';

interface Example {
  id: string;
  title: string;
  description: string | null;
  content: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export default function ViewExamplePage() {
  const params = useParams();
  const router = useRouter();
  const [example, setExample] = useState<Example | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchExample(params.id as string);
    }
  }, [params.id]);

  const fetchExample = async (id: string) => {
    try {
      const response = await fetch(`/api/examples/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Example not found');
        }
        throw new Error('Failed to fetch example');
      }
      const data = await response.json();
      setExample(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this example?')) {
      return;
    }

    try {
      const response = await fetch(`/api/examples/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete example');
      }

      router.push('/examples');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete example');
    }
  };

  const handleProcessExample = async () => {
    if (!example) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/example-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exampleId: example.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process example');
      }

      const result = await response.json();
      alert(`Example processing started successfully!\nMessage ID: ${result.data.messageId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to process example');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Boundary label="Example" animateRerendering={false}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-1/3"></div>
          <div className="h-4 bg-gray-800 rounded w-2/3"></div>
          <div className="h-32 bg-gray-800 rounded"></div>
        </div>
      </Boundary>
    );
  }

  if (error || !example) {
    return (
      <Boundary label="Example" animateRerendering={false}>
        <div className="space-y-4">
          <div className="text-red-500">Error: {error || 'Example not found'}</div>
          <Link
            href="/examples"
            className="text-white hover:text-gray-300 underline"
          >
            Back to Examples
          </Link>
        </div>
      </Boundary>
    );
  }

  return (
    <Boundary label="Example" animateRerendering={false}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{example.title}</h1>
            {example.description && (
              <p className="text-gray-400">{example.description}</p>
            )}
            <div className="flex gap-4 text-sm text-gray-500 mt-2">
              <span>Created: {new Date(example.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(example.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleProcessExample}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Process Example'}
            </button>
            <Link
              href={`/examples/${example.id}/edit`}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-300 mb-2">Content</h2>
          <pre className="bg-gray-900 p-6 rounded-lg overflow-x-auto">
            <code className="text-gray-300 font-mono text-sm">{example.content}</code>
          </pre>
        </div>

        {example.metadata && Object.keys(example.metadata).length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Metadata</h2>
            <pre className="bg-gray-900 p-6 rounded-lg overflow-x-auto">
              <code className="text-gray-300 font-mono text-sm">
                {JSON.stringify(example.metadata, null, 2)}
              </code>
            </pre>
          </div>
        )}

        <div className="flex gap-4 pt-4 border-t border-gray-800">
          <Link
            href="/examples"
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Back to Examples
          </Link>
        </div>
      </div>
    </Boundary>
  );
}