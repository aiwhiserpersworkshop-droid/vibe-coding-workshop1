import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '#/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey || apiKey !== process.env.API_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'lastMessageAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100' },
        { status: 400 }
      );
    }

    const validSortFields = ['externalId', 'createdAt', 'lastMessageAt', 'messageCount'];
    if (!validSortFields.includes(sortBy)) {
      return NextResponse.json(
        { error: 'Invalid sortBy parameter' },
        { status: 400 }
      );
    }

    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      return NextResponse.json(
        { error: 'Invalid sortOrder parameter' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const whereClause = search
      ? {
          externalId: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const [conversations, totalCount] = await Promise.all([
      prisma.conversation.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            select: {
              createdAt: true,
            },
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
      }),
      prisma.conversation.count({
        where: whereClause,
      }),
    ]);

    const conversationsWithMetadata = conversations.map((conv) => ({
      id: conv.id,
      externalId: conv.externalId,
      data: conv.data,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      messageCount: conv._count.messages,
      lastMessageAt: conv.messages[0]?.createdAt || null,
    }));

    conversationsWithMetadata.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (sortBy === 'lastMessageAt') {
        aVal = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        bVal = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      } else if (sortBy === 'createdAt') {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      } else if (sortBy === 'messageCount') {
        aVal = a.messageCount;
        bVal = b.messageCount;
      } else if (sortBy === 'externalId') {
        aVal = a.externalId.toLowerCase();
        bVal = b.externalId.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    return NextResponse.json({
      conversations: conversationsWithMetadata,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
