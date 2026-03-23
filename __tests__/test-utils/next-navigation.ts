import { vi } from 'vitest';

export const routerMock = {
  push: vi.fn<(href: string) => void>(),
  replace: vi.fn<(href: string) => void>(),
  refresh: vi.fn<() => void>(),
  prefetch: vi.fn<(href: string) => Promise<void>>(),
};

let searchParams = new URLSearchParams();

export const notFoundMock = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});

export const nextNavigationMock = {
  useRouter: () => routerMock,
  useSearchParams: () => searchParams,
  notFound: notFoundMock,
};

export function setSearchParams(
  params: URLSearchParams | Record<string, string>,
) {
  searchParams =
    params instanceof URLSearchParams ? params : new URLSearchParams(params);
}

export function resetNextNavigationMock() {
  searchParams = new URLSearchParams();
  routerMock.push.mockReset();
  routerMock.replace.mockReset();
  routerMock.refresh.mockReset();
  routerMock.prefetch.mockReset();
  routerMock.prefetch.mockResolvedValue(undefined);
  notFoundMock.mockClear();
}
