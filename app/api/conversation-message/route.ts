import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '#/lib/prisma';

function deepMerge(target: any, source: any): any {
  if (!source) return target;
  if (!target) return source;

  const output = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    } else {
      output[key] = source[key];
    }
  }
  
  return output;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey || apiKey !== process.env.API_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      contactExternalId,
      contactData,
      conversationExternalId,
      conversationData,
      messageText,
      messageData,
    } = body;

    if (!contactExternalId || !conversationExternalId || !messageText) {
      return NextResponse.json(
        { error: 'contactExternalId, conversationExternalId, and messageText are required' },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const existingContact = await tx.contact.findUnique({
        where: { externalId: contactExternalId },
      });

      if (existingContact) {
        const mergedData = deepMerge(existingContact.data, contactData);
        await tx.contact.update({
          where: { externalId: contactExternalId },
          data: { data: mergedData },
        });
      } else {
        await tx.contact.create({
          data: {
            externalId: contactExternalId,
            data: contactData || {},
          },
        });
      }

      const existingConversation = await tx.conversation.findUnique({
        where: { externalId: conversationExternalId },
      });

      if (existingConversation) {
        const mergedData = deepMerge(existingConversation.data, conversationData);
        await tx.conversation.update({
          where: { externalId: conversationExternalId },
          data: { data: mergedData },
        });
      } else {
        await tx.conversation.create({
          data: {
            externalId: conversationExternalId,
            data: conversationData || {},
          },
        });
      }

      await tx.message.create({
        data: {
          conversationExternalId,
          contactExternalId,
          text: messageText,
          data: messageData || {},
        },
      });
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation message:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation message' },
      { status: 500 }
    );
  }
}
