import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MyPromptsPage from '@/app/my-prompts/page';
import {
  createPrompt,
  deletePrompt,
  getMyPrompts,
  updatePrompt,
} from '@/lib/api/prompts';
import { buildPrompt } from './test-utils/fixtures';
import { routerMock } from './test-utils/next-navigation';
import { createDeferred } from './test-utils/network';
import { alertMock, confirmMock } from '../vitest.setup';

const authState = vi.hoisted(() => ({
  user: {
    email: 'user@example.com',
    username: 'ali',
  } as { email: string; username: string } | null,
  token: 'token-1' as string | null,
}));

const formPayloads = vi.hoisted(() => ({
  create: {
    title: 'Yeni Oluşturulan Prompt',
    content: 'Yeni içerik',
    tags: ['etiket'],
    explanation: 'Yeni açıklama',
    suggested_model: 'Claude',
    is_public: true,
  },
  update: {
    title: 'Güncellenen Prompt',
    content: 'Güncellenen içerik',
    tags: ['güncel'],
    explanation: 'Güncel açıklama',
    suggested_model: 'Gemini',
    is_public: false,
  },
}));

vi.mock('@/lib/auth', () => ({
  useAuth: () => authState,
}));

vi.mock('@/components/Navigation', () => ({
  default: () => <nav data-testid="navigation">Navigation</nav>,
}));

vi.mock('@/components/PromptForm', () => ({
  default: ({
    initialData,
    onCancel,
    onSubmit,
    submitLabel,
  }: {
    initialData?: { title?: string };
    onCancel?: () => void;
    onSubmit: (
      payload: typeof formPayloads.create | typeof formPayloads.update,
    ) => Promise<void>;
    submitLabel?: string;
  }) => (
    <div data-testid={initialData ? 'edit-form' : 'create-form'}>
      {initialData?.title && <span>{initialData.title}</span>}
      <button
        type="button"
        onClick={() =>
          void onSubmit(initialData ? formPayloads.update : formPayloads.create)
        }
      >
        {submitLabel}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Form İptal
        </button>
      )}
    </div>
  ),
}));

vi.mock('@/lib/api/prompts', () => ({
  getMyPrompts: vi.fn(),
  deletePrompt: vi.fn(),
  createPrompt: vi.fn(),
  updatePrompt: vi.fn(),
}));

describe('my prompts page', () => {
  const getMyPromptsMock = vi.mocked(getMyPrompts);
  const deletePromptMock = vi.mocked(deletePrompt);
  const createPromptMock = vi.mocked(createPrompt);
  const updatePromptMock = vi.mocked(updatePrompt);

  beforeEach(() => {
    authState.user = {
      email: 'user@example.com',
      username: 'ali',
    };
    authState.token = 'token-1';
    getMyPromptsMock.mockReset();
    deletePromptMock.mockReset();
    createPromptMock.mockReset();
    updatePromptMock.mockReset();
  });

  it('redirects logged-out users to sign-in and renders nothing', async () => {
    authState.user = null;
    authState.token = null;

    const { container } = render(<MyPromptsPage />);

    await waitFor(() => expect(routerMock.push).toHaveBeenCalledWith('/giris'));
    expect(container).toBeEmptyDOMElement();
  });

  it('does not stay in loading when a user exists without a token', async () => {
    authState.user = {
      email: 'user@example.com',
      username: 'ali',
    };
    authState.token = null;

    render(<MyPromptsPage />);

    expect(
      screen.getByText(
        'Henüz prompt oluşturmadınız. Yeni bir prompt oluşturmak için yukarıdaki butona tıklayın.',
      ),
    ).toBeInTheDocument();
    expect(getMyPromptsMock).not.toHaveBeenCalled();
  });

  it('shows loading first and then the empty state', async () => {
    authState.token = 'token-1';
    const deferred = createDeferred<ReturnType<typeof buildPrompt>[]>();
    getMyPromptsMock.mockReturnValueOnce(deferred.promise);

    render(<MyPromptsPage />);

    expect(screen.getByText('Yükleniyor...')).toBeInTheDocument();

    deferred.resolve([]);

    await waitFor(() =>
      expect(
        screen.getByText(
          'Henüz prompt oluşturmadınız. Yeni bir prompt oluşturmak için yukarıdaki butona tıklayın.',
        ),
      ).toBeInTheDocument(),
    );
  });

  it('shows an error state when prompts cannot be loaded', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    authState.token = 'token-1';
    getMyPromptsMock.mockRejectedValueOnce(new Error('boom'));

    render(<MyPromptsPage />);

    await waitFor(() =>
      expect(
        screen.getByText('Promptlar yüklenirken bir hata oluştu'),
      ).toBeInTheDocument(),
    );

    consoleError.mockRestore();
  });

  it('creates, edits, and deletes prompts successfully', async () => {
    authState.token = 'token-1';
    getMyPromptsMock.mockResolvedValueOnce([
      buildPrompt({
        id: 'existing',
        title: 'Mevcut Prompt',
        username: undefined,
        is_public: false,
      }),
    ]);
    createPromptMock.mockResolvedValueOnce(
      buildPrompt({
        id: 'created',
        title: 'Yeni Oluşturulan Prompt',
        is_public: true,
      }),
    );
    updatePromptMock.mockResolvedValueOnce(
      buildPrompt({
        id: 'existing',
        title: 'Güncellenen Prompt',
        is_public: false,
      }),
    );
    deletePromptMock.mockResolvedValueOnce(undefined);

    render(<MyPromptsPage />);

    await waitFor(() =>
      expect(screen.getByText('Mevcut Prompt')).toBeInTheDocument(),
    );
    expect(screen.getByText('@ali')).toBeInTheDocument();
    expect(screen.getByText('Özel')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Yeni Prompt' }));
    expect(screen.getByTestId('create-form')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Oluştur' }));

    await waitFor(() =>
      expect(screen.getByText('Yeni Oluşturulan Prompt')).toBeInTheDocument(),
    );
    expect(createPromptMock).toHaveBeenCalledWith(
      formPayloads.create,
      'token-1',
    );
    expect(screen.getByText('Halka Açık')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Düzenle' })[1]!);
    expect(screen.getByTestId('edit-form')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Güncelle' }));

    await waitFor(() =>
      expect(screen.getByText('Güncellenen Prompt')).toBeInTheDocument(),
    );
    expect(updatePromptMock).toHaveBeenCalledWith(
      'existing',
      formPayloads.update,
      'token-1',
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Sil' })[1]!);

    await waitFor(() =>
      expect(screen.queryByText('Güncellenen Prompt')).not.toBeInTheDocument(),
    );
    expect(deletePromptMock).toHaveBeenCalledWith('existing', 'token-1');
  });

  it('respects delete confirmation and alerts when deletion fails', async () => {
    authState.token = 'token-1';
    getMyPromptsMock.mockResolvedValueOnce([
      buildPrompt({
        id: 'delete-target',
        title: 'Silinecek Prompt',
      }),
    ]);
    deletePromptMock.mockRejectedValueOnce(new Error('delete failed'));

    render(<MyPromptsPage />);

    await waitFor(() =>
      expect(screen.getByText('Silinecek Prompt')).toBeInTheDocument(),
    );

    confirmMock.mockReturnValueOnce(false);
    fireEvent.click(screen.getByRole('button', { name: 'Sil' }));
    expect(deletePromptMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Sil' }));

    await waitFor(() =>
      expect(alertMock).toHaveBeenCalledWith(
        'Prompt silinirken bir hata oluştu',
      ),
    );
  });

  it('cancels create and edit forms through PromptForm callbacks', async () => {
    getMyPromptsMock.mockResolvedValueOnce([
      buildPrompt({
        id: 'editable',
        title: 'Düzenlenebilir Prompt',
      }),
    ]);

    render(<MyPromptsPage />);

    await waitFor(() =>
      expect(screen.getByText('Düzenlenebilir Prompt')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Yeni Prompt' }));
    expect(screen.getByText('İptal')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Form İptal' }));
    expect(screen.queryByTestId('create-form')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Düzenle' }));
    expect(screen.getByTestId('edit-form')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Form İptal' }));
    expect(screen.queryByTestId('edit-form')).not.toBeInTheDocument();
  });

  it('no-ops create, edit, and delete handlers when the token disappears', async () => {
    const existingPrompt = buildPrompt({
      id: 'guarded',
      title: 'Korunan Prompt',
    });
    getMyPromptsMock.mockResolvedValue([existingPrompt]);

    const { rerender } = render(<MyPromptsPage />);

    await waitFor(() =>
      expect(screen.getByText('Korunan Prompt')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Yeni Prompt' }));
    authState.token = null;
    rerender(<MyPromptsPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Oluştur' }));
    expect(createPromptMock).not.toHaveBeenCalled();

    authState.token = 'token-1';
    rerender(<MyPromptsPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Form İptal' }));
    await waitFor(() =>
      expect(screen.getByText('Korunan Prompt')).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Düzenle' }));

    authState.token = null;
    rerender(<MyPromptsPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Güncelle' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sil' }));

    expect(updatePromptMock).not.toHaveBeenCalled();
    expect(deletePromptMock).not.toHaveBeenCalled();
  });
});
