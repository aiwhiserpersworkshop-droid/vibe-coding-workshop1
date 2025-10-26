'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type Conversation = {
  id: string;
  externalId: string;
  data: any;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessageAt: string | null;
};

type ConversationsResponse = {
  conversations: Conversation[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

export default function ConversationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [data, setData] = useState<ConversationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'lastMessageAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    async function fetchConversations() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });

        if (search) {
          params.append('search', search);
        }

        const response = await fetch(`/api/conversations?${params.toString()}`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_SECRET || 'myapisecret',
          },
        });

        if (!response.ok) {
          setError('Failed to load conversations');
          return;
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    }

    fetchConversations();
  }, [page, limit, search, sortBy, sortOrder]);

  const updateQuery = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    router.push(`/conversations?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    updateQuery({ search: value, page: 1 });
  };

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    updateQuery({ sortBy: field, sortOrder: newOrder, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateQuery({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    updateQuery({ limit: newLimit, page: 1 });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const renderPageNumbers = () => {
    if (!data) return null;
    
    const { totalPages } = data.pagination;
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      }
    }

    return pages.map((p, idx) => {
      if (p === -1) {
        return (
          <span key={`ellipsis-${idx}`} className="px-3 py-1 text-gray-500">
            ...
          </span>
        );
      }

      return (
        <button
          key={p}
          onClick={() => handlePageChange(p)}
          className={`px-3 py-1 rounded ${
            p === page
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {p}
        </button>
      );
    });
  };

  if (loading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-white"></div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const { conversations, pagination } = data || { conversations: [], pagination: { page: 1, limit: 20, totalCount: 0, totalPages: 0 } };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Explore Conversations</h1>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search by external ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchInput);
              }
            }}
            className="rounded border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Show:</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(parseInt(e.target.value))}
              className="rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {conversations.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-12 text-center">
            <p className="text-xl text-gray-400">No conversations found</p>
            {search && (
              <button
                onClick={() => handleSearch('')}
                className="mt-4 text-blue-400 hover:text-blue-300"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-800">
              <table className="w-full bg-gray-900">
                <thead className="border-b border-gray-800 bg-gray-800">
                  <tr>
                    <th
                      onClick={() => handleSort('externalId')}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-300 hover:bg-gray-700"
                    >
                      External ID {getSortIcon('externalId')}
                    </th>
                    <th
                      onClick={() => handleSort('createdAt')}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-300 hover:bg-gray-700"
                    >
                      Created {getSortIcon('createdAt')}
                    </th>
                    <th
                      onClick={() => handleSort('lastMessageAt')}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-300 hover:bg-gray-700"
                    >
                      Last Message {getSortIcon('lastMessageAt')}
                    </th>
                    <th
                      onClick={() => handleSort('messageCount')}
                      className="cursor-pointer px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-gray-300 hover:bg-gray-700"
                    >
                      Messages {getSortIcon('messageCount')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {conversations.map((conversation) => (
                    <tr
                      key={conversation.id}
                      className="hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/conversations/${conversation.externalId}`}
                          className="font-mono text-sm text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          {conversation.externalId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatDate(conversation.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatDate(conversation.lastMessageAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {conversation.messageCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-400">
                Showing {(page - 1) * limit + 1}-
                {Math.min(page * limit, pagination.totalCount)} of{' '}
                {pagination.totalCount} results
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="rounded bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex gap-1">{renderPageNumbers()}</div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="rounded bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
