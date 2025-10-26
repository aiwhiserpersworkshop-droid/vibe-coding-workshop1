'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Contact = {
  id: string;
  externalId: string;
  data: any;
  createdAt: string;
  updatedAt: string;
};

type Conversation = {
  id: string;
  externalId: string;
  data: any;
  createdAt: string;
  updatedAt: string;
};

type Message = {
  id: string;
  conversationExternalId: string;
  contactExternalId: string;
  text: string;
  data: any;
  createdAt: string;
  updatedAt: string;
};

type ConversationData = {
  conversation: Conversation;
  contacts: Contact[];
  messages: Message[];
};

export default function ConversationPage() {
  const params = useParams();
  const externalId = params.externalId as string;
  const [data, setData] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConversation() {
      try {
        const response = await fetch(`/api/conversations/${externalId}`, {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_API_SECRET || 'myapisecret',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Conversation not found');
          } else {
            setError('Failed to load conversation');
          }
          return;
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    }

    fetchConversation();
  }, [externalId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-white"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400">{error || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  const { conversation, contacts, messages } = data;
  const internalContactIds = new Set(
    contacts.filter((c) => c.data?.internalContact).map((c) => c.externalId)
  );

  const lastMessage = messages[messages.length - 1];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900 p-6">
          <h1 className="mb-4 text-2xl font-bold">Conversation Details</h1>
          
          <div className="space-y-4 text-sm">
            <div>
              <span className="font-semibold text-gray-400">Created:</span>{' '}
              <span className="text-gray-200">{formatDate(conversation.createdAt)}</span>
            </div>
            
            <div>
              <span className="font-semibold text-gray-400">Last Message:</span>{' '}
              <span className="text-gray-200">
                {lastMessage ? formatDate(lastMessage.createdAt) : 'No messages'}
              </span>
            </div>

            <div>
              <div className="mb-2 font-semibold text-gray-400">Participants:</div>
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="rounded border border-gray-700 bg-gray-800 p-3">
                    <div className="mb-1 font-mono text-sm text-blue-400">
                      {contact.externalId}
                      {contact.data?.internalContact && (
                        <span className="ml-2 rounded bg-blue-600 px-2 py-0.5 text-xs text-white">
                          Internal
                        </span>
                      )}
                    </div>
                    <pre className="overflow-x-auto text-xs text-gray-400">
                      {JSON.stringify(contact.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 font-semibold text-gray-400">Conversation Data:</div>
              <div className="rounded border border-gray-700 bg-gray-800 p-3">
                <pre className="overflow-x-auto text-xs text-gray-400">
                  {JSON.stringify(conversation.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {messages.map((message) => {
            const isInternal = internalContactIds.has(message.contactExternalId);
            
            return (
              <div
                key={message.id}
                className={`flex ${isInternal ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-3 ${
                    isInternal
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  <div className="mb-1 text-xs font-mono opacity-75">
                    {message.contactExternalId}
                  </div>
                  <div className="mb-2 whitespace-pre-wrap break-words">
                    {message.text}
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs opacity-75">
                    <span>{formatTime(message.createdAt)}</span>
                    {message.data && Object.keys(message.data).length > 0 && (
                      <details className="cursor-pointer">
                        <summary className="text-xs">data</summary>
                        <pre className="mt-1 text-xs">
                          {JSON.stringify(message.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
