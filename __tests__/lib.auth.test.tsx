import React, { useState } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '@/lib/auth';
import { jsonResponse } from './test-utils/network';

function AuthHarness() {
  const { user, token, signIn, signOut, signUp, loading } = useAuth();
  const [message, setMessage] = useState('idle');

  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
      <div data-testid="token">{token ?? 'none'}</div>
      <div data-testid="user-email">{user?.email ?? 'none'}</div>
      <div data-testid="username">{user?.username ?? 'none'}</div>
      <div data-testid="message">{message}</div>
      <button
        type="button"
        onClick={async () => {
          try {
            await signUp('test@example.com', 'secret123', 'tester');
            setMessage('signup-ok');
          } catch (error) {
            setMessage(
              error instanceof Error ? error.message : 'signup-failed',
            );
          }
        }}
      >
        Sign Up
      </button>
      <button
        type="button"
        onClick={async () => {
          try {
            await signIn('test@example.com', 'secret123');
            setMessage('signin-ok');
          } catch (error) {
            setMessage(
              error instanceof Error ? error.message : 'signin-failed',
            );
          }
        }}
      >
        Sign In
      </button>
      <button
        type="button"
        onClick={() => {
          signOut();
          setMessage('signed-out');
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

function renderAuthHarness() {
  return render(
    <AuthProvider>
      <AuthHarness />
    </AuthProvider>,
  );
}

describe('lib/auth', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    localStorage.clear();
  });

  it('requires the provider when useAuth is used', () => {
    expect(() => render(<AuthHarness />)).toThrow(
      'useAuth must be used within an AuthProvider',
    );
  });

  it('starts empty when there is no stored session', async () => {
    renderAuthHarness();

    await waitFor(() =>
      expect(screen.getByTestId('loading')).toHaveTextContent('ready'),
    );

    expect(screen.getByTestId('token')).toHaveTextContent('none');
    expect(screen.getByTestId('user-email')).toHaveTextContent('none');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('restores a valid stored session', async () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem(
      'user',
      JSON.stringify({ email: 'stored@example.com', username: 'stored-user' }),
    );
    localStorage.setItem(
      'session_expires_at',
      String(Date.now() + 5 * 60 * 1000),
    );

    renderAuthHarness();

    await waitFor(() =>
      expect(screen.getByTestId('loading')).toHaveTextContent('ready'),
    );

    expect(screen.getByTestId('token')).toHaveTextContent('stored-token');
    expect(screen.getByTestId('user-email')).toHaveTextContent(
      'stored@example.com',
    );
    expect(screen.getByTestId('username')).toHaveTextContent('stored-user');
  });

  it('clears an expired stored session', async () => {
    localStorage.setItem('token', 'expired-token');
    localStorage.setItem(
      'user',
      JSON.stringify({ email: 'old@example.com', username: 'old-user' }),
    );
    localStorage.setItem('session_expires_at', String(Date.now() - 1000));

    renderAuthHarness();

    await waitFor(() =>
      expect(screen.getByTestId('loading')).toHaveTextContent('ready'),
    );

    expect(screen.getByTestId('token')).toHaveTextContent('none');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('session_expires_at')).toBeNull();
  });

  it('clears a malformed stored session payload', async () => {
    localStorage.setItem('token', 'broken-token');
    localStorage.setItem('user', '{not-json');
    localStorage.setItem(
      'session_expires_at',
      String(Date.now() + 5 * 60 * 1000),
    );

    renderAuthHarness();

    await waitFor(() =>
      expect(screen.getByTestId('loading')).toHaveTextContent('ready'),
    );

    expect(screen.getByTestId('token')).toHaveTextContent('none');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('signs users up successfully without creating a local session', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
    renderAuthHarness();

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() =>
      expect(screen.getByTestId('message')).toHaveTextContent('signup-ok'),
    );

    expect(fetchMock).toHaveBeenCalledWith('http://0.0.0.0:8000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'secret123',
        username: 'tester',
      }),
    });
    expect(screen.getByTestId('token')).toHaveTextContent('none');
  });

  it('surfaces API signup failures', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ detail: 'Kullanici zaten var' }, { status: 400 }),
    );
    renderAuthHarness();

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() =>
      expect(screen.getByTestId('message')).toHaveTextContent(
        'Kullanici zaten var',
      ),
    );
  });

  it('falls back to the default signup error when the API omits detail', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}, { status: 400 }));
    renderAuthHarness();

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() =>
      expect(screen.getByTestId('message')).toHaveTextContent(
        'Kayıt başarısız',
      ),
    );
  });

  it('maps signup network failures to a user-friendly message', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network error'));
    renderAuthHarness();

    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() =>
      expect(screen.getByTestId('message')).toHaveTextContent(
        'Sunucuya bağlanılamadı, lütfen daha sonra tekrar deneyin',
      ),
    );
  });

  it('signs users in and stores the session using nested user data', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ access_token: 'api-token' }))
      .mockResolvedValueOnce(
        jsonResponse({
          user: {
            id: 'user-1',
            email: 'test@example.com',
            user_metadata: {
              username: 'nested-user',
            },
          },
        }),
      );
    renderAuthHarness();

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() =>
      expect(screen.getByTestId('message')).toHaveTextContent('signin-ok'),
    );

    expect(screen.getByTestId('token')).toHaveTextContent('api-token');
    expect(screen.getByTestId('username')).toHaveTextContent('nested-user');
    expect(localStorage.getItem('token')).toBe('api-token');
    expect(localStorage.getItem('user')).toContain('nested-user');
    expect(localStorage.getItem('session_expires_at')).not.toBeNull();
  });

  it('falls back to flat user data and email as the username during sign-in', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ token: 'flat-token' }))
      .mockResolvedValueOnce(
        jsonResponse({
          id: 'user-2',
          email: 'flat@example.com',
        }),
      );
    renderAuthHarness();

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() =>
      expect(screen.getByTestId('message')).toHaveTextContent('signin-ok'),
    );

    expect(screen.getByTestId('token')).toHaveTextContent('flat-token');
    expect(screen.getByTestId('username')).toHaveTextContent(
      'flat@example.com',
    );
  });

  it('surfaces profile fetch failures during sign-in', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ access_token: 'bad-token' }))
      .mockResolvedValueOnce(jsonResponse({}, { status: 500 }));
    renderAuthHarness();

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() =>
      expect(screen.getByTestId('message')).toHaveTextContent(
        'Kullanıcı bilgileri alınamadı',
      ),
    );
  });

  it('surfaces API sign-in failures before the profile request', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ detail: 'Giriş reddedildi' }, { status: 401 }),
    );
    renderAuthHarness();

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() =>
      expect(screen.getByTestId('message')).toHaveTextContent(
        'Giriş reddedildi',
      ),
    );
  });

  it('falls back to the default sign-in error when the API omits detail', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}, { status: 401 }));
    renderAuthHarness();

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() =>
      expect(screen.getByTestId('message')).toHaveTextContent(
        'Giriş başarısız',
      ),
    );
  });

  it('maps sign-in network failures to a user-friendly message', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network error'));
    renderAuthHarness();

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() =>
      expect(screen.getByTestId('message')).toHaveTextContent(
        'Sunucuya bağlanılamadı, lütfen daha sonra tekrar deneyin',
      ),
    );
  });

  it('clears the session when sign-out is called', async () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem(
      'user',
      JSON.stringify({ email: 'stored@example.com', username: 'stored-user' }),
    );
    localStorage.setItem(
      'session_expires_at',
      String(Date.now() + 5 * 60 * 1000),
    );
    renderAuthHarness();

    await waitFor(() =>
      expect(screen.getByTestId('token')).toHaveTextContent('stored-token'),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sign Out' }));

    expect(screen.getByTestId('message')).toHaveTextContent('signed-out');
    expect(screen.getByTestId('token')).toHaveTextContent('none');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('expires an active session when the timeout elapses', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-23T10:00:00.000Z'));
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem(
      'user',
      JSON.stringify({ email: 'stored@example.com', username: 'stored-user' }),
    );
    localStorage.setItem('session_expires_at', String(Date.now() + 1000));

    renderAuthHarness();

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByTestId('token')).toHaveTextContent('stored-token');

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId('token')).toHaveTextContent('none');

    vi.useRealTimers();
  });
});
