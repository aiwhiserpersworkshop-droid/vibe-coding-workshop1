'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditExamplePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
  });

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
      const data: Example = await response.json();
      setFormData({
        title: data.title,
        description: data.description || '',
        content: data.content,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/examples/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          content: formData.content,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update example');
      }

      router.push(`/examples/${params.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <Boundary label="Edit Example" animateRerendering={false}>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-800 rounded"></div>
          <div className="h-10 bg-gray-800 rounded"></div>
          <div className="h-32 bg-gray-800 rounded"></div>
        </div>
      </Boundary>
    );
  }

  if (error) {
    return (
      <Boundary label="Edit Example" animateRerendering={false}>
        <div className="space-y-4">
          <div className="text-red-500">Error: {error}</div>
          <button
            onClick={() => router.push('/examples')}
            className="text-white hover:text-gray-300 underline"
          >
            Back to Examples
          </button>
        </div>
      </Boundary>
    );
  }

  return (
    <Boundary label="Edit Example" animateRerendering={false}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Enter example title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Brief description (optional)"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            required
            value={formData.content}
            onChange={handleChange}
            rows={10}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-mono text-sm"
            placeholder="Enter example content"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/examples/${params.id}`)}
            className="px-6 py-3 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Boundary>
  );
}