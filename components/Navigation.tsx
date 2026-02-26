'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useState, useRef, useEffect } from 'react';

const mainLinks = [
  { href: '/#one-cikanlar', label: 'Promptlar' },
  { href: '/#beceriler', label: 'Beceriler' },
  { href: '/#is-akislari', label: 'İş Akışları' },
];

export default function Navigation() {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-zinc-200/90 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4 py-2">
          <div className="flex min-w-0 items-center gap-5">
            <Link href="/" className="shrink-0 text-xl font-black text-zinc-900 dark:text-zinc-50">
              Prompts34
            </Link>
            <div className="hidden items-center gap-3 text-sm font-semibold text-zinc-600 dark:text-zinc-300 md:flex">
              {mainLinks.map((link) => (
                <Link key={link.label} href={link.href} className="rounded-md px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-50">
                    <span className="text-sm font-medium text-white dark:text-zinc-900">
                      {(user.username?.[0] || user.email?.[0] || 'U').toUpperCase()}
                    </span>
                  </div>
                  <svg
                    className={`h-4 w-4 text-zinc-600 transition-transform dark:text-zinc-400 ${
                      showDropdown ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                      {user.username && (
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {user.username}
                        </p>
                      )}
                      {user.email && (
                        <p
                          className={`${user.username ? 'text-xs' : 'text-sm'} ${
                            user.username ? '' : 'font-medium'
                          } truncate text-zinc-500 dark:text-zinc-500`}
                        >
                          {user.email}
                        </p>
                      )}
                    </div>

                    <Link
                      href="/my-prompts"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Promptlarım
                    </Link>

                    <div className="mt-1 border-t border-zinc-200 pt-1 dark:border-zinc-800">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          signOut();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-zinc-100 dark:text-red-400 dark:hover:bg-zinc-800"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
