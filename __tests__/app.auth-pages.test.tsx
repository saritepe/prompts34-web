import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SignInPage from '@/app/giris/page';
import SignUpPage from '@/app/kayit/page';
import { routerMock } from './test-utils/next-navigation';
import { createDeferred } from './test-utils/network';

const authState = vi.hoisted(() => ({
  signIn: vi.fn<(email: string, password: string) => Promise<void>>(),
  signUp:
    vi.fn<
      (email: string, password: string, username: string) => Promise<void>
    >(),
}));

vi.mock('@/lib/auth', () => ({
  useAuth: () => authState,
}));

describe('authentication pages', () => {
  it('signs users in and redirects to the homepage', async () => {
    const deferred = createDeferred<void>();
    authState.signIn.mockReturnValueOnce(deferred.promise);

    render(<SignInPage />);

    fireEvent.change(screen.getByLabelText('E-posta'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Şifre'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Giriş Yap' }));

    expect(authState.signIn).toHaveBeenCalledWith(
      'user@example.com',
      'secret123',
    );
    expect(screen.getByRole('button')).toHaveTextContent('Giriş yapılıyor...');

    deferred.resolve();

    await waitFor(() => expect(routerMock.push).toHaveBeenCalledWith('/'));
  });

  it('shows sign-in errors from Error instances', async () => {
    authState.signIn.mockRejectedValueOnce(new Error('Geçersiz giriş'));

    render(<SignInPage />);

    fireEvent.change(screen.getByLabelText('E-posta'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Şifre'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Giriş Yap' }));

    await waitFor(() =>
      expect(screen.getByText('Geçersiz giriş')).toBeInTheDocument(),
    );
  });

  it('shows the fallback sign-in error for unknown failures', async () => {
    authState.signIn.mockRejectedValueOnce('boom');

    render(<SignInPage />);

    fireEvent.change(screen.getByLabelText('E-posta'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Şifre'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Giriş Yap' }));

    await waitFor(() =>
      expect(screen.getByText('Giriş yapılamadı')).toBeInTheDocument(),
    );
  });

  it('signs users up and switches to the email confirmation state', async () => {
    const deferred = createDeferred<void>();
    authState.signUp.mockReturnValueOnce(deferred.promise);

    render(<SignUpPage />);

    fireEvent.change(screen.getByLabelText('Kullanıcı Adı'), {
      target: { value: 'tester' },
    });
    fireEvent.change(screen.getByLabelText('E-posta'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Şifre'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Kayıt Ol' }));

    expect(screen.getByRole('button')).toHaveTextContent('Kayıt olunuyor...');

    deferred.resolve();

    await waitFor(() =>
      expect(screen.getByText('E-postanızı Kontrol Edin')).toBeInTheDocument(),
    );

    expect(authState.signUp).toHaveBeenCalledWith(
      'user@example.com',
      'secret123',
      'tester',
    );
    expect(
      screen.getByRole('link', { name: 'Giriş sayfasına dön' }),
    ).toHaveAttribute('href', '/giris');
  });

  it('shows sign-up errors from Error instances', async () => {
    authState.signUp.mockRejectedValueOnce(new Error('Kayıt hatası'));

    render(<SignUpPage />);

    fireEvent.change(screen.getByLabelText('Kullanıcı Adı'), {
      target: { value: 'tester' },
    });
    fireEvent.change(screen.getByLabelText('E-posta'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Şifre'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Kayıt Ol' }));

    await waitFor(() =>
      expect(screen.getByText('Kayıt hatası')).toBeInTheDocument(),
    );
  });

  it('shows sign-up errors from unknown failures', async () => {
    authState.signUp.mockRejectedValueOnce('boom');

    render(<SignUpPage />);

    fireEvent.change(screen.getByLabelText('Kullanıcı Adı'), {
      target: { value: 'tester' },
    });
    fireEvent.change(screen.getByLabelText('E-posta'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Şifre'), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Kayıt Ol' }));

    await waitFor(() =>
      expect(screen.getByText('Kayıt olunamadı')).toBeInTheDocument(),
    );
    expect(screen.getByRole('button')).toHaveTextContent('Kayıt Ol');
  });
});
