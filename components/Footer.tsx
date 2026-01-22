import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
              Prompts34
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Yapay zeka promptlarını keşfedin ve paylaşın.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
              Popüler Kategoriler
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/cv-hazirlama"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  CV Hazırlama
                </Link>
              </li>
              <li>
                <Link
                  href="/motivasyon-mektubu"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  Motivasyon Mektubu
                </Link>
              </li>
              <li>
                <Link
                  href="/mulakat-hazirligi"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  Mülakat Hazırlığı
                </Link>
              </li>
              <li>
                <Link
                  href="/gorsel-olusturma"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  Görsel Oluşturma
                </Link>
              </li>
              <li>
                <Link
                  href="/logo-olusturma"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  Logo Oluşturma
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
              Hızlı Linkler
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  href="/giris"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  Giriş Yap
                </Link>
              </li>
              <li>
                <Link
                  href="/kayit"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                >
                  Kayıt Ol
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-8 pt-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-500 text-center">
            © {new Date().getFullYear()} Prompts34. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
