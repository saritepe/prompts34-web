'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Email doğrulanıyor...');

  useEffect(() => {
    const handleCallback = async () => {
      // Get the access token from URL hash (Supabase redirects with #access_token=...)
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');

      // Or get from search params if using query string
      const tokenFromQuery = searchParams.get('token');

      const token = accessToken || tokenFromQuery;

      if (!token) {
        setStatus('error');
        setMessage('Token bulunamadı');
        return;
      }

      try {
        // Verify token by calling /auth/me with the token
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:8000';
        const response = await fetch(`${apiUrl}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Kullanıcı bilgileri alınamadı');
        }

        const userData = await response.json();

        // Save token and user data to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setStatus('success');
        setMessage('Email doğrulandı! Giriş yapılıyor...');

        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Bir hata oluştu');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-50 rounded-full animate-spin"></div>
            <p className="text-lg text-zinc-700 dark:text-zinc-300">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg text-green-700 dark:text-green-300">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg text-red-700 dark:text-red-300">{message}</p>
            <button
              onClick={() => router.push('/giris')}
              className="mt-4 px-6 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              Giriş Sayfasına Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
