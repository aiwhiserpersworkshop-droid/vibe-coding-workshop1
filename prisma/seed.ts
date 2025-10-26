import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const internalContacts = [
  {
    email: 'sarah.johnson@company.com',
    name: 'Sarah Johnson',
  },
  {
    email: 'mike.chen@company.com',
    name: 'Mike Chen',
  },
];

const externalContacts = [
  {
    email: 'emma.williams@example.com',
    name: 'Emma Williams',
  },
  {
    email: 'david.garcia@example.com',
    name: 'David Garcia',
  },
  {
    email: 'olivia.martinez@example.com',
    name: 'Olivia Martinez',
  },
];

const conversationTemplates = [
  {
    topic: 'product_inquiry',
    messages: [
      { role: 'customer', text: 'Hi, I\'m interested in learning more about your premium plan. What features does it include?' },
      { role: 'agent', text: 'Hello! Thanks for your interest. Our premium plan includes unlimited storage, priority support, advanced analytics, and API access. Would you like me to go into detail on any specific feature?' },
      { role: 'customer', text: 'Yes, I\'d love to know more about the analytics capabilities.' },
      { role: 'agent', text: 'Great question! The analytics dashboard gives you real-time insights into user engagement, conversion metrics, and custom reporting. You can also export data in multiple formats.' },
      { role: 'customer', text: 'That sounds perfect. What about the API access? Are there rate limits?' },
      { role: 'agent', text: 'Premium plans have a rate limit of 10,000 requests per hour. For higher volumes, we offer enterprise plans with custom limits.' },
      { role: 'customer', text: 'I see. And what\'s the pricing for the premium plan?' },
      { role: 'agent', text: 'The premium plan is $99/month, billed annually, or $119/month if billed monthly. We also offer a 14-day free trial if you\'d like to test it out first.' },
      { role: 'customer', text: 'Perfect! I\'ll start with the trial. How do I sign up?' },
      { role: 'agent', text: 'Excellent! I can send you a signup link right now. You won\'t need a credit card for the trial period. I\'ll email it to you in just a moment.' },
      { role: 'customer', text: 'Thank you so much for your help!' },
      { role: 'agent', text: 'You\'re very welcome! Feel free to reach out if you have any questions during your trial. Have a great day!' },
    ],
  },
  {
    topic: 'technical_support',
    messages: [
      { role: 'customer', text: 'I\'m having trouble connecting my account to the mobile app. It keeps saying "authentication failed".' },
      { role: 'agent', text: 'I\'m sorry to hear that! Let\'s get this sorted out. First, can you confirm you\'re using the latest version of the app?' },
      { role: 'customer', text: 'Yes, I just updated it yesterday to version 2.4.1' },
      { role: 'agent', text: 'Perfect, that\'s the latest version. Have you tried logging out and back in on the mobile app?' },
      { role: 'customer', text: 'I tried that twice already, same error both times.' },
      { role: 'agent', text: 'Got it. Let me check your account settings. Can you tell me which email address you\'re using to log in?' },
      { role: 'customer', text: 'I\'m using emma.williams@example.com' },
      { role: 'agent', text: 'Thanks! I see your account. It looks like two-factor authentication might be enabled. Are you receiving a code via SMS or email?' },
      { role: 'customer', text: 'Oh! I didn\'t realize I had that enabled. Let me check my messages.' },
      { role: 'customer', text: 'Found it! I see the code now. Let me try entering it.' },
      { role: 'customer', text: 'It worked! I\'m in now. Thank you!' },
      { role: 'agent', text: 'Wonderful! Glad we could resolve that quickly. If you have any other issues, don\'t hesitate to reach out.' },
    ],
  },
  {
    topic: 'billing_issue',
    messages: [
      { role: 'customer', text: 'Hi, I was charged twice this month and I need help getting a refund.' },
      { role: 'agent', text: 'I apologize for the inconvenience! I\'ll look into this right away. Can you provide the transaction dates or amounts?' },
      { role: 'customer', text: 'Sure, I was charged $99 on March 1st and again on March 15th.' },
      { role: 'agent', text: 'Thank you. Let me pull up your billing history.' },
      { role: 'agent', text: 'I can see both charges here. It looks like the March 1st charge was your regular subscription, but the March 15th charge appears to be a duplicate error on our end.' },
      { role: 'customer', text: 'Yes, exactly. Can you refund the duplicate?' },
      { role: 'agent', text: 'Absolutely. I\'m processing a full refund of $99 right now. You should see it back in your account within 3-5 business days.' },
      { role: 'customer', text: 'Great, thank you. Will this affect my subscription?' },
      { role: 'agent', text: 'Not at all. Your subscription remains active and your next billing date will be April 1st as scheduled.' },
      { role: 'customer', text: 'Perfect, I appreciate your quick help!' },
      { role: 'agent', text: 'Happy to help! I\'ve also added a note to your account to prevent this from happening again. Is there anything else I can assist you with today?' },
      { role: 'customer', text: 'No, that\'s everything. Thanks again!' },
    ],
  },
  {
    topic: 'feature_request',
    messages: [
      { role: 'customer', text: 'Hi there! I love your product but I was wondering if you have plans to add dark mode?' },
      { role: 'agent', text: 'Hi! Thanks for the feedback, we really appreciate it! Dark mode is actually on our roadmap for Q2 this year.' },
      { role: 'customer', text: 'That\'s great to hear! Will it be available on both web and mobile?' },
      { role: 'agent', text: 'Yes, we\'re planning to roll it out across all platforms simultaneously. We want to ensure a consistent experience everywhere.' },
      { role: 'customer', text: 'Awesome! Are there any other features coming soon that you can share?' },
      { role: 'agent', text: 'We\'re also working on collaborative workspaces and enhanced integration with third-party tools. Both are scheduled for later this year.' },
      { role: 'customer', text: 'The collaborative workspaces sound really interesting. Will that be included in the current premium plan?' },
      { role: 'agent', text: 'Great question! Yes, it will be included in premium at no additional cost. We believe in adding value to existing plans whenever possible.' },
      { role: 'customer', text: 'That\'s really customer-friendly, I appreciate that approach!' },
      { role: 'agent', text: 'We appreciate your support! Is there anything else you\'d like to know about upcoming features?' },
      { role: 'customer', text: 'No, that covers it. Thanks for the info!' },
      { role: 'agent', text: 'Anytime! Feel free to reach out if you have more questions in the future.' },
    ],
  },
  {
    topic: 'account_setup',
    messages: [
      { role: 'customer', text: 'I just signed up and I\'m not sure how to get started. Can you help?' },
      { role: 'agent', text: 'Of course! Welcome aboard! I\'d be happy to help you get set up. What would you like to accomplish first?' },
      { role: 'customer', text: 'I need to import my existing data from our old system. Is that possible?' },
      { role: 'agent', text: 'Yes, we support data imports! What format is your current data in? We accept CSV, JSON, and Excel files.' },
      { role: 'customer', text: 'It\'s all in CSV format, probably around 5000 records.' },
      { role: 'agent', text: 'Perfect! You can use our bulk import tool. Go to Settings > Data Import, and you\'ll see the upload interface. The system will validate your data before importing.' },
      { role: 'customer', text: 'Is there a template I should follow for the CSV columns?' },
      { role: 'agent', text: 'Yes! On the import page, there\'s a "Download Template" button. That will give you the exact column headers we expect. You can map your existing columns to ours during the import process.' },
      { role: 'customer', text: 'Got it. What happens if there are errors in my data?' },
      { role: 'agent', text: 'The system will show you a preview with any errors highlighted. You can fix them directly in the interface or download an error report to fix in your source file.' },
      { role: 'customer', text: 'That sounds easy enough. I\'ll give it a try now.' },
      { role: 'agent', text: 'Excellent! I\'ll stay online for a few minutes in case you run into any issues. Just let me know!' },
      { role: 'customer', text: 'Thank you! I\'ll reach out if I need help.' },
      { role: 'agent', text: 'Sounds good. Good luck with the import!' },
    ],
  },
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMessagesForConversation(
  template: typeof conversationTemplates[0],
  conversationExternalId: string,
  participant1Email: string,
  participant2Email: string,
  messageCount: number
) {
  const messages = [];
  const templateMessages = template.messages;
  
  for (let i = 0; i < messageCount; i++) {
    const templateMsg = templateMessages[i % templateMessages.length];
    const isCustomer = templateMsg.role === 'customer';
    
    const shouldAlternate = Math.random() > 0.15;
    
    let senderEmail: string;
    if (i === 0) {
      senderEmail = isCustomer ? participant2Email : participant1Email;
    } else {
      const previousSender = messages[i - 1].contactExternalId;
      if (shouldAlternate) {
        senderEmail = previousSender === participant1Email ? participant2Email : participant1Email;
      } else {
        senderEmail = previousSender;
      }
    }
    
    messages.push({
      id: randomUUID(),
      conversationExternalId,
      contactExternalId: senderEmail,
      text: templateMsg.text,
      data: {
        messageType: templateMsg.role,
        topic: template.topic,
      },
      createdAt: new Date(Date.now() - (messageCount - i) * 3600000),
      updatedAt: new Date(Date.now() - (messageCount - i) * 3600000),
    });
  }
  
  return messages;
}

async function main() {
  console.log('🌱 Starting database seed...');

  console.log('🧹 Cleaning existing data...');
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.contact.deleteMany();

  console.log('👥 Creating contacts...');
  const createdInternalContacts = await Promise.all(
    internalContacts.map((contact) =>
      prisma.contact.create({
        data: {
          id: randomUUID(),
          externalId: contact.email,
          data: {
            name: contact.name,
            internalContact: true,
            role: 'support_agent',
          },
        },
      })
    )
  );

  const createdExternalContacts = await Promise.all(
    externalContacts.map((contact) =>
      prisma.contact.create({
        data: {
          id: randomUUID(),
          externalId: contact.email,
          data: {
            name: contact.name,
            customerSince: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      })
    )
  );

  console.log(`✅ Created ${createdInternalContacts.length} internal contacts`);
  console.log(`✅ Created ${createdExternalContacts.length} external contacts`);

  console.log('💬 Creating conversations and messages...');
  
  const conversationPairs = [
    [createdInternalContacts[0].externalId, createdExternalContacts[0].externalId],
    [createdInternalContacts[1].externalId, createdExternalContacts[1].externalId],
    [createdInternalContacts[0].externalId, createdExternalContacts[2].externalId],
    [createdInternalContacts[1].externalId, createdInternalContacts[0].externalId],
    [createdInternalContacts[0].externalId, createdExternalContacts[1].externalId],
  ];

  for (let i = 0; i < 5; i++) {
    const conversationId = randomUUID();
    const conversationExternalId = `conv-${randomUUID()}`;
    const template = conversationTemplates[i];
    const [participant1, participant2] = conversationPairs[i];
    const messageCount = getRandomInt(8, 15);

    const conversation = await prisma.conversation.create({
      data: {
        id: conversationId,
        externalId: conversationExternalId,
        data: {
          topic: template.topic,
          participants: [participant1, participant2],
          status: 'active',
        },
      },
    });

    const messages = generateMessagesForConversation(
      template,
      conversationExternalId,
      participant1,
      participant2,
      messageCount
    );

    await prisma.message.createMany({
      data: messages,
    });

    console.log(`✅ Created conversation ${i + 1} with ${messageCount} messages`);
  }

  console.log('✨ Seed completed successfully!');
  
  const stats = {
    contacts: await prisma.contact.count(),
    conversations: await prisma.conversation.count(),
    messages: await prisma.message.count(),
  };
  
  console.log('\n📊 Database stats:');
  console.log(`   Contacts: ${stats.contacts}`);
  console.log(`   Conversations: ${stats.conversations}`);
  console.log(`   Messages: ${stats.messages}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
