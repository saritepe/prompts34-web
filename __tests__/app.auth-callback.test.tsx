import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthCallbackPage from '@/app/auth/callback/page';
import { routerMock, setSearchParams } from './test-utils/next-navigation';
import { jsonResponse } from './test-utils/network';

describe('auth callback page', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    setSearchParams({});
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        hash: '',
        href: 'http://localhost/auth/callback',
      },
    });
  });

  it('shows an error when there is no token and sends users back to sign-in', async () => {
    render(<AuthCallbackPage />);

    await waitFor(() =>
      expect(screen.getByText('Token bulunamadı')).toBeInTheDocument(),
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Giriş Sayfasına Dön' }),
    );
    expect(routerMock.push).toHaveBeenCalledWith('/giris');
  });

  it('uses the query-string token, stores the session, and redirects home after success', async () => {
    setSearchParams({ token: 'query-token' });
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ email: 'user@example.com', username: 'ali' }),
    );

    render(<AuthCallbackPage />);

    await waitFor(() =>
      expect(
        screen.getByText('Email doğrulandı! Giriş yapılıyor...'),
      ).toBeInTheDocument(),
    );

    expect(fetchMock).toHaveBeenCalledWith('http://0.0.0.0:8000/auth/me', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer query-token',
        'Content-Type': 'application/json',
      },
    });
    expect(localStorage.getItem('token')).toBe('query-token');
    expect(localStorage.getItem('user')).toBe(
      JSON.stringify({ email: 'user@example.com', username: 'ali' }),
    );

    await waitFor(() => expect(window.location.href).toBe('/'), {
      timeout: 2500,
    });
  });

  it('uses the hash token and shows fetch failures as errors', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        hash: '#access_token=hash-token',
        href: 'http://localhost/auth/callback',
      },
    });
    fetchMock.mockResolvedValueOnce(jsonResponse({}, { status: 500 }));

    render(<AuthCallbackPage />);

    await waitFor(() =>
      expect(
        screen.getByText('Kullanıcı bilgileri alınamadı'),
      ).toBeInTheDocument(),
    );
  });

  it('shows the fallback callback error for non-Error failures', async () => {
    setSearchParams({ token: 'query-token' });
    fetchMock.mockRejectedValueOnce('boom');

    render(<AuthCallbackPage />);

    await waitFor(() =>
      expect(screen.getByText('Bir hata oluştu')).toBeInTheDocument(),
    );
  });
});
