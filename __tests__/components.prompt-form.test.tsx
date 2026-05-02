import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  useAuth: () => ({ token: 'test-token', user: { id: 'user-1' } }),
}));

import PromptForm from '@/components/PromptForm';
import {
  buildPrompt,
  buildPromptCreate,
  buildPromptUpdate,
} from './test-utils/fixtures';
import { createDeferred } from './test-utils/network';

describe('PromptForm', () => {
  it('submits create payloads, shows loading, and resets the form', async () => {
    const onSubmit =
      vi.fn<(payload: ReturnType<typeof buildPromptCreate>) => Promise<void>>();
    const deferred = createDeferred<void>();
    onSubmit.mockReturnValueOnce(deferred.promise);

    render(
      <PromptForm
        onSubmit={onSubmit}
        onCancel={vi.fn()}
        submitLabel="Oluştur"
      />,
    );

    fireEvent.change(screen.getByLabelText('Başlık *'), {
      target: { value: 'Yeni Prompt' },
    });
    fireEvent.change(screen.getByLabelText('Prompt İçeriği *'), {
      target: { value: 'Detaylı içerik' },
    });
    fireEvent.change(screen.getByLabelText('Açıklama'), {
      target: { value: 'Açıklama metni' },
    });
    fireEvent.change(screen.getByLabelText('Etiketler'), {
      target: { value: 'cv, mülakat ,  yapay zeka ' },
    });
    fireEvent.change(screen.getByLabelText('Önerilen Model'), {
      target: { value: 'Claude' },
    });
    fireEvent.click(
      screen.getByLabelText(
        'Bu promptu halka açık yap (Diğer kullanıcılar görebilir)',
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Oluştur' }));

    expect(onSubmit).toHaveBeenCalledWith(
      buildPromptCreate({
        content: 'Detaylı içerik',
        explanation: 'Açıklama metni',
        suggested_model: 'Claude',
        tags: ['cv', 'mülakat', 'yapay zeka'],
      }),
    );
    expect(
      screen.getByRole('button', { name: 'Kaydediliyor...' }),
    ).toBeDisabled();

    deferred.resolve();

    await waitFor(() =>
      expect(screen.getByLabelText('Başlık *')).toHaveValue(''),
    );
    expect(screen.getByLabelText('Prompt İçeriği *')).toHaveValue('');
    expect(screen.getByLabelText('Etiketler')).toHaveValue('');
  });

  it('submits update payloads with nulls for cleared values', async () => {
    const onSubmit =
      vi.fn<(payload: ReturnType<typeof buildPromptUpdate>) => Promise<void>>();
    onSubmit.mockResolvedValue(undefined);
    const initialPrompt = buildPrompt({
      title: 'Eski Başlık',
      content: 'Eski İçerik',
      tags: ['eski', 'etiket'],
      explanation: 'Eski açıklama',
      suggested_model: 'GPT-4',
      is_public: true,
    });

    render(
      <PromptForm
        initialData={initialPrompt}
        onSubmit={onSubmit}
        submitLabel="Güncelle"
      />,
    );

    fireEvent.change(screen.getByLabelText('Başlık *'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText('Prompt İçeriği *'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText('Açıklama'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText('Etiketler'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText('Önerilen Model'), {
      target: { value: '' },
    });
    fireEvent.click(
      screen.getByLabelText(
        'Bu promptu halka açık yap (Diğer kullanıcılar görebilir)',
      ),
    );
    fireEvent.submit(
      screen.getByRole('button', { name: 'Güncelle' }).closest('form')!,
    );

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        buildPromptUpdate({
          title: null,
          content: null,
          tags: null,
          explanation: null,
          suggested_model: null,
          is_public: false,
        }),
      ),
    );
  });

  it('shows submit errors and allows cancelling', async () => {
    const onCancel = vi.fn();
    const onSubmit = vi.fn<
      (payload: ReturnType<typeof buildPromptUpdate>) => Promise<void>
    >(async () => {
      throw new Error('Kaydetme hatası');
    });

    render(
      <PromptForm
        initialData={buildPrompt()}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }));

    await waitFor(() =>
      expect(screen.getByText('Kaydetme hatası')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole('button', { name: 'İptal' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('submits create payloads with null optional fields when they are left blank', async () => {
    const onSubmit =
      vi.fn<(payload: ReturnType<typeof buildPromptCreate>) => Promise<void>>();
    onSubmit.mockResolvedValue(undefined);

    render(<PromptForm onSubmit={onSubmit} submitLabel="Oluştur" />);

    fireEvent.change(screen.getByLabelText('Başlık *'), {
      target: { value: 'Sade Prompt' },
    });
    fireEvent.change(screen.getByLabelText('Prompt İçeriği *'), {
      target: { value: 'Sade içerik' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Oluştur' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        buildPromptCreate({
          title: 'Sade Prompt',
          content: 'Sade içerik',
          tags: [],
          explanation: null,
          suggested_model: null,
          is_public: false,
        }),
      ),
    );
  });

  it('shows the fallback submit error for non-Error failures', async () => {
    const onSubmit = vi.fn<
      (payload: ReturnType<typeof buildPromptCreate>) => Promise<void>
    >(async () => {
      throw 'boom';
    });

    render(<PromptForm onSubmit={onSubmit} submitLabel="Oluştur" />);

    fireEvent.change(screen.getByLabelText('Başlık *'), {
      target: { value: 'Hatalı Prompt' },
    });
    fireEvent.change(screen.getByLabelText('Prompt İçeriği *'), {
      target: { value: 'Hatalı içerik' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Oluştur' }));

    await waitFor(() =>
      expect(screen.getByText('Bir hata oluştu')).toBeInTheDocument(),
    );
  });
});
