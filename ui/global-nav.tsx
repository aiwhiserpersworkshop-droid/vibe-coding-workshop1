'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  {
    name: 'EXAMPLES',
    items: [
      { name: 'Explore Examples', href: '/examples' },
      { name: 'Create Example', href: '/examples/new' },
    ],
  },
  {
    name: 'CONVERSATIONS',
    items: [
      { name: 'Explore Conversations', href: '/conversations' },
    ],
  },
];

export function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setIsOpen(false);

  return (
    <>
      <div className="flex h-14 items-center px-4 py-4 lg:h-auto">
        <Link
          href="/"
          className="group flex w-full items-center gap-x-2.5"
          onClick={close}
        >
          <span
            className="flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #e0e0e0 0%, #f8f8f8 60%, #b0b0b0 100%)',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              minWidth: '2.5rem',
              minHeight: '2.5rem',
              display: 'inline-flex',
              boxShadow: '0 2px 8px 0 rgba(180,180,180,0.10)',
              border: '2px solid #27272a',
            }}
          >
            <img
              src="/mercury-logo.png"
              alt="RATIO MACHINA STARTER logo"
              style={{
                width: '1.6rem',
                height: '1.6rem',
                objectFit: 'contain',
                borderRadius: '50%',
                display: 'block',
              }}
              sizes="40px"
            />
          </span>

          <h3 className="text-lg font-bold tracking-wide text-gray-200 group-hover:text-white">
            RATIO MACHINA STARTER
          </h3>
        </Link>
      </div>
      <button
        type="button"
        className="group absolute top-0 right-0 flex h-14 items-center gap-x-2 px-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium text-gray-100 group-hover:text-gray-400">
          Menu
        </div>
        {isOpen ? (
          <XMarkIcon className="block w-6 text-gray-400" />
        ) : (
          <Bars3Icon className="block w-6 text-gray-400" />
        )}
      </button>

      <div
        className={clsx('overflow-y-auto lg:static lg:block', {
          'fixed inset-x-0 top-14 bottom-0 mt-px bg-black': isOpen,
          hidden: !isOpen,
        })}
      >
        <nav className="space-y-6 px-2 pt-5 pb-24">
          {navigation.map((section) => {
            return (
              <div key={section.name}>
                <div className="mb-2 px-3 font-mono text-xs font-semibold tracking-wide text-gray-600 uppercase">
                  <div>{section.name}</div>
                </div>

                <div className="flex flex-col gap-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href === '/examples' && pathname.startsWith('/examples/') && pathname !== '/examples/new') ||
                      (item.href === '/conversations' && pathname.startsWith('/conversations/'));
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={close}
                        className={clsx(
                          'flex rounded-md px-3 py-2 text-sm font-medium hover:text-gray-300',
                          {
                            'text-gray-400 hover:bg-gray-800': !isActive,
                            'text-white': isActive,
                          },
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}