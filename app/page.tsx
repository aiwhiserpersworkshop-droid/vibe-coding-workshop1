import { Boundary } from '#/ui/boundary';
import Link from 'next/link';

const sections = [
  {
    name: 'Examples',
    items: [
      {
        name: 'Explore Examples',
        slug: 'examples',
        description: 'Browse and manage all examples in the system',
      },
      {
        name: 'Create Example',
        slug: 'examples/new',
        description: 'Create a new example with title, description, and content',
      },
    ],
  },
];

export default function Page() {
  return (
    <Boundary
      label="Ratio Machina Starter"
      animateRerendering={false}
      kind="solid"
      className="flex flex-col gap-9"
    >
      <div className="space-y-4 mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome to Ratio Machina Starter
        </h1>
        <p className="text-gray-400">
          A Next.js App Router + AWS Amplify + SQS + Lambda starter template
        </p>
      </div>

      {sections.map((section) => {
        return (
          <div key={section.name} className="flex flex-col gap-3">
            <div className="font-mono text-xs font-semibold tracking-wider text-gray-700 uppercase">
              {section.name}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {section.items.map((item) => {
                return (
                  <Link
                    href={`/${item.slug}`}
                    key={item.name}
                    className="group flex flex-col gap-1 rounded-lg bg-gray-900 px-5 py-3 hover:bg-gray-800"
                  >
                    <div className="flex items-center justify-between font-medium text-gray-200 group-hover:text-gray-50">
                      {item.name}
                    </div>

                    {item.description ? (
                      <div className="line-clamp-3 text-[13px] text-gray-500 group-hover:text-gray-300">
                        {item.description}
                      </div>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-white">Getting Started</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
          <li>Next.js 15 with App Router</li>
          <li>AWS Amplify for deployment</li>
          <li>PostgreSQL database with Prisma ORM</li>
          <li>AWS SQS + Lambda for long-running background tasks</li>
          <li>Dark theme UI with Tailwind CSS</li>
        </ul>
      </div>
    </Boundary>
  );
}