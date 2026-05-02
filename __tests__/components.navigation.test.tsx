import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Navigation from '@/components/Navigation';

const authState = vi.hoisted(() => ({
  user: null as {
    email: string;
    username: string;
  } | null,
  signOut: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  useAuth: () => authState,
}));

describe('Navigation', () => {
  it('renders public navigation when the user is logged out', () => {
    authState.user = null;

    render(<Navigation />);

    expect(screen.getByRole('link', { name: 'Prompts34' })).toHaveAttribute(
      'href',
      '/',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Keşfet' }));
    expect(screen.getByRole('link', { name: 'Kategoriler' })).toHaveAttribute(
      'href',
      '/kategori',
    );
    expect(screen.getByRole('link', { name: 'Meslekler' })).toHaveAttribute(
      'href',
      '/meslek',
    );
    expect(
      screen.getByRole('link', { name: 'Kullanım Alanları' }),
    ).toHaveAttribute('href', '/kullanim');

    fireEvent.click(screen.getByRole('button', { name: 'Öğren' }));
    expect(screen.getByRole('link', { name: 'Sözlük' })).toHaveAttribute(
      'href',
      '/sozluk',
    );
    expect(screen.getByRole('link', { name: 'Rehber' })).toHaveAttribute(
      'href',
      '/rehber',
    );

    expect(screen.getByRole('link', { name: 'Giriş Yap' })).toHaveAttribute(
      'href',
      '/giris',
    );
    expect(screen.getByRole('link', { name: 'Kayıt Ol' })).toHaveAttribute(
      'href',
      '/kayit',
    );
  });

  it('renders the username initial when available', () => {
    authState.user = {
      email: 'user@example.com',
      username: 'alpha',
    };

    render(<Navigation />);

    expect(
      screen.getByRole('button', { name: 'Kullanıcı menüsü' }),
    ).toHaveTextContent('A');
  });

  it('falls back to the email initial and then U when user details are empty', () => {
    authState.user = {
      email: 'mail@example.com',
      username: '',
    };

    const { rerender } = render(<Navigation />);
    expect(
      screen.getByRole('button', { name: 'Kullanıcı menüsü' }),
    ).toHaveTextContent('M');

    authState.user = {
      email: '',
      username: '',
    };

    rerender(<Navigation />);
    expect(
      screen.getByRole('button', { name: 'Kullanıcı menüsü' }),
    ).toHaveTextContent('U');
  });

  it('opens and closes the user dropdown, supports outside clicks, and signs out', () => {
    authState.user = {
      email: 'user@example.com',
      username: 'alpha',
    };

    render(<Navigation />);

    const userButton = () =>
      screen.getByRole('button', { name: 'Kullanıcı menüsü' });

    fireEvent.click(userButton());
    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Promptlarım')).not.toBeInTheDocument();

    fireEvent.click(userButton());
    fireEvent.click(screen.getByRole('link', { name: 'Promptlarım' }));
    expect(screen.queryByText('Promptlarım')).not.toBeInTheDocument();

    fireEvent.click(userButton());
    fireEvent.click(screen.getByRole('button', { name: 'Çıkış Yap' }));
    expect(authState.signOut).toHaveBeenCalledTimes(1);
  });

  it('keeps the dropdown open for inside clicks and styles email-only users correctly', () => {
    authState.user = {
      email: 'mail@example.com',
      username: '',
    };

    render(<Navigation />);

    fireEvent.click(screen.getByRole('button', { name: 'Kullanıcı menüsü' }));
    const email = screen.getByText('mail@example.com');
    fireEvent.mouseDown(email);

    expect(screen.getByText('Promptlarım')).toBeInTheDocument();
    expect(email).toHaveClass('text-sm');
    expect(email).toHaveClass('font-medium');
  });
});
