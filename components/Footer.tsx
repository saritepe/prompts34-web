import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Prompts34
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Türkçe yapay zeka prompt kütüphanesi. Keşfet, kopyala, düzenle ve
              paylaş.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <Link
              href="/kayit"
              className="inline-flex w-full justify-center rounded-md bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 md:w-auto dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Topluluğa Katıl
            </Link>
          </div>
        </div>

        <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-500">
            © {new Date().getFullYear()} Prompts34. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
