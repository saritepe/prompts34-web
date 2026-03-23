import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import {
  nextNavigationMock,
  resetNextNavigationMock,
} from './__tests__/test-utils/next-navigation';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => nextNavigationMock);

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'font-geist-sans' }),
  Geist_Mono: () => ({ variable: 'font-geist-mono' }),
}));

vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid="analytics" />,
}));

const writeText = vi.fn<(value: string) => Promise<void>>();
const alertMock = vi.fn<(message?: string) => void>();
const confirmMock = vi.fn<(message?: string) => boolean>();

Object.defineProperty(window.navigator, 'clipboard', {
  configurable: true,
  value: {
    writeText,
  },
});

window.alert = alertMock;
window.confirm = confirmMock;

beforeEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
  resetNextNavigationMock();
  localStorage.clear();
  window.history.pushState({}, '', '/');
  writeText.mockReset();
  alertMock.mockReset();
  confirmMock.mockReset();
  confirmMock.mockReturnValue(true);
  vi.unstubAllGlobals();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

export { alertMock, confirmMock, writeText };
