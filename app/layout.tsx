import '#/styles/globals.css';

import Byline from '#/ui/byline';
import { GlobalNav } from '#/ui/global-nav';
import { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: { default: 'Ratio Machina Starter', template: '%s | Ratio Machina Starter' },
  metadataBase: new URL('https://example.com'),
  description:
    'A Next.js App Router + AWS Amplify + SQS + Lambda starter template for building scalable applications.',
  openGraph: {
    title: 'Ratio Machina Starter',
    description:
      'A Next.js App Router + AWS Amplify + SQS + Lambda starter template for building scalable applications.',
    images: [`/mercury-logo.png`],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: '/mercury-logo.png',
    shortcut: '/mercury-logo.png',
    apple: '/mercury-logo.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="[color-scheme:dark]">
      <body
        className={`overflow-y-scroll bg-gray-950 font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="fixed top-0 z-10 flex w-full flex-col border-b border-gray-800 bg-black lg:bottom-0 lg:z-auto lg:w-72 lg:border-r lg:border-b-0 lg:border-gray-800">
          <GlobalNav />
        </div>

        <div className="lg:pl-72">
          <div className="mx-auto mt-12 mb-24 max-w-4xl -space-y-[1px] lg:px-8 lg:py-8">
            {children}

            <Byline />
          </div>
        </div>
      </body>
    </html>
  );
}
