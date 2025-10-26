import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '#/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { externalId: string } }
) {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey || apiKey !== process.env.API_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { externalId } = params;

    const conversation = await prisma.conversation.findUnique({
      where: { externalId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationExternalId: externalId },
      orderBy: { createdAt: 'asc' },
    });

    const uniqueContactExternalIds = Array.from(
      new Set(messages.map((msg) => msg.contactExternalId))
    );

    const contacts = await prisma.contact.findMany({
      where: {
        externalId: {
          in: uniqueContactExternalIds,
        },
      },
    });

    return NextResponse.json({
      conversation,
      contacts,
      messages,
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}
