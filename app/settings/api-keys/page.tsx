'use client';

import Navigation from '@/components/Navigation';
import { useAuth } from '@/lib/auth';
import { createApiKey, listApiKeys, revokeApiKey } from '@/lib/api/keys';
import {
  ADMIN_ONLY_SCOPES,
  ApiKey,
  ApiKeyCreated,
  USER_SCOPES,
} from '@/types/apiKey';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function ApiKeysSettingsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<Set<string>>(
    new Set(['prompts:read', 'prompts:write']),
  );
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [justCreated, setJustCreated] = useState<ApiKeyCreated | null>(null);
  const [copied, setCopied] = useState(false);

  const availableScopes = useMemo(
    () => (isAdmin ? [...USER_SCOPES, ...ADMIN_ONLY_SCOPES] : [...USER_SCOPES]),
    [isAdmin],
  );

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await listApiKeys(token);
      setKeys(data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!user) {
      router.push('/giris');
      return;
    }
    refresh();
  }, [user, router, refresh]);

  function toggleScope(scope: string) {
    setSelectedScopes((prev) => {
      const next = new Set(prev);
      if (next.has(scope)) next.delete(scope);
      else next.add(scope);
      return next;
    });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!name.trim()) {
      setCreateError('Anahtar için bir isim girin');
      return;
    }
    if (selectedScopes.size === 0) {
      setCreateError('En az bir kapsam seçin');
      return;
    }
    try {
      setCreating(true);
      setCreateError(null);
      const created = await createApiKey(
        { name: name.trim(), scopes: Array.from(selectedScopes) },
        token,
      );
      setJustCreated(created);
      setName('');
      setSelectedScopes(new Set(['prompts:read', 'prompts:write']));
      setShowCreate(false);
      await refresh();
    } catch (e) {
      setCreateError((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(key: ApiKey) {
    if (!token) return;
    if (
      !confirm(
        `"${key.name}" anahtarını iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      )
    )
      return;
    try {
      await revokeApiKey(key.id, token);
      await refresh();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  if (!user) return null;

  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              API Anahtarları
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              CLI, MCP sunucusu veya başka makine-makine entegrasyonları için
              kişisel anahtar oluşturun. Her anahtar tek seferlik gösterilir.
              {isAdmin
                ? ' Yönetici olarak :any kapsamlarına erişebilirsiniz.'
                : ''}
            </p>
          </div>
          {!showCreate && !justCreated && (
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Yeni anahtar oluştur
            </button>
          )}
        </div>

        {justCreated && (
          <div className="mb-6 rounded-md border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-950/40">
            <h2 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
              Anahtar oluşturuldu
            </h2>
            <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-200">
              Bu anahtarı şimdi kopyalayın — bir daha gösterilmeyecek.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 select-all break-all rounded bg-white px-3 py-2 font-mono text-xs text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                {justCreated.key}
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard(justCreated.key)}
                className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
              >
                {copied ? 'Kopyalandı' : 'Kopyala'}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setJustCreated(null)}
              className="mt-3 text-xs font-medium text-emerald-900 underline hover:no-underline dark:text-emerald-100"
            >
              Anladım, kapat
            </button>
          </div>
        )}

        {showCreate && (
          <form
            onSubmit={handleCreate}
            className="mb-6 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Yeni anahtar
            </h2>
            <div className="mt-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                İsim
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="örn. claude-mcp-laptop"
                maxLength={100}
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
              />
            </div>
            <fieldset className="mt-4">
              <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Kapsamlar
              </legend>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {availableScopes.map((scope) => {
                  const adminOnly = scope.endsWith(':any');
                  return (
                    <label
                      key={scope}
                      className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-800 dark:border-zinc-800 dark:text-zinc-200"
                    >
                      <input
                        type="checkbox"
                        checked={selectedScopes.has(scope)}
                        onChange={() => toggleScope(scope)}
                      />
                      <code className="font-mono text-xs">{scope}</code>
                      {adminOnly && (
                        <span className="ml-auto rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-800 dark:bg-orange-900/40 dark:text-orange-200">
                          admin
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            {createError && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                {createError}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2">
              <button
                type="submit"
                disabled={creating}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {creating ? 'Oluşturuluyor…' : 'Oluştur'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  setCreateError(null);
                }}
                className="rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                İptal
              </button>
            </div>
          </form>
        )}

        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {loading ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Yükleniyor…
          </p>
        ) : keys.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Henüz bir API anahtarınız yok.
          </p>
        ) : (
          <ul className="space-y-3">
            {keys.map((key) => {
              const revoked = !!key.revoked_at;
              const expired =
                !!key.expires_at && new Date(key.expires_at) < new Date();
              return (
                <li
                  key={key.id}
                  className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                          {key.name}
                        </h3>
                        {revoked && (
                          <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            iptal edildi
                          </span>
                        )}
                        {!revoked && expired && (
                          <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-800 dark:bg-orange-900/40 dark:text-orange-200">
                            süresi doldu
                          </span>
                        )}
                      </div>
                      <code className="mt-1 inline-block font-mono text-xs text-zinc-500 dark:text-zinc-400">
                        {key.prefix}…
                      </code>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {key.scopes.map((s) => (
                          <code
                            key={s}
                            className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          >
                            {s}
                          </code>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        Oluşturuldu:{' '}
                        {new Date(key.created_at).toLocaleString('tr-TR')}
                        {key.last_used_at && (
                          <>
                            {' · '}Son kullanım:{' '}
                            {new Date(key.last_used_at).toLocaleString('tr-TR')}
                          </>
                        )}
                        {key.expires_at && (
                          <>
                            {' · '}Süre sonu:{' '}
                            {new Date(key.expires_at).toLocaleString('tr-TR')}
                          </>
                        )}
                      </p>
                    </div>
                    {!revoked && (
                      <button
                        type="button"
                        onClick={() => handleRevoke(key)}
                        className="shrink-0 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        İptal et
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
