import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '#/lib/prisma';

// GET /api/examples/:id - Get a specific example
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const example = await prisma.example.findUnique({
      where: { id },
    });

    if (!example) {
      return NextResponse.json(
        { error: 'Example not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(example);
  } catch (error) {
    console.error('Error fetching example:', error);
    return NextResponse.json(
      { error: 'Failed to fetch example' },
      { status: 500 }
    );
  }
}

// PUT /api/examples/:id - Update an existing example
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, content, metadata } = body;

    const example = await prisma.example.update({
      where: { id },
      data: {
        title,
        description,
        content,
        metadata,
      },
    });

    return NextResponse.json(example);
  } catch (error) {
    console.error('Error updating example:', error);
    if (error instanceof Error && error.message.includes('P2025')) {
      return NextResponse.json(
        { error: 'Example not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update example' },
      { status: 500 }
    );
  }
}

// PATCH /api/examples/:id - Partially update an existing example
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.metadata !== undefined) updateData.metadata = body.metadata;

    const example = await prisma.example.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(example);
  } catch (error) {
    console.error('Error updating example:', error);
    if (error instanceof Error && error.message.includes('P2025')) {
      return NextResponse.json(
        { error: 'Example not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update example' },
      { status: 500 }
    );
  }
}

// DELETE /api/examples/:id - Delete an example
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.example.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Example deleted successfully' });
  } catch (error) {
    console.error('Error deleting example:', error);
    if (error instanceof Error && error.message.includes('P2025')) {
      return NextResponse.json(
        { error: 'Example not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete example' },
      { status: 500 }
    );
  }
}