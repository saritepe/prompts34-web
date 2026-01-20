'use client';

import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Prompts34
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Merhaba, {user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/giris"
                    className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/kayit"
                    className="px-4 py-2 text-sm font-medium rounded-md bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Prompts34'e Hoş Geldiniz
          </h1>
          {user ? (
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Merhaba {user.email}! Sistemde oturum açtınız.
            </p>
          ) : (
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Devam etmek için lütfen giriş yapın veya kayıt olun.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
