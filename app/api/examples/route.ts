import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '#/lib/prisma';

// GET /api/examples - Fetch list of all examples
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [examples, totalCount] = await Promise.all([
      prisma.example.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.example.count(),
    ]);

    return NextResponse.json({
      examples,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching examples:', error);
    return NextResponse.json(
      { error: 'Failed to fetch examples' },
      { status: 500 }
    );
  }
}

// POST /api/examples - Create a new example
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content, metadata } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const example = await prisma.example.create({
      data: {
        title,
        description,
        content,
        metadata: metadata || {},
      },
    });

    return NextResponse.json(example, { status: 201 });
  } catch (error) {
    console.error('Error creating example:', error);
    return NextResponse.json(
      { error: 'Failed to create example' },
      { status: 500 }
    );
  }
}