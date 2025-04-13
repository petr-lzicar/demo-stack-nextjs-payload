import Image from "next/image";
import Link from "next/link";
import { api } from "@/app/lib/api";

// Definování typů dat z Payload CMS
interface Page {
  id: string;
  title: string;
  slug: string;
}

interface PagesResponse {
  docs: Page[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export default async function Home() {
  // Načtení dat ze všech stránek z API
  const pagesData: PagesResponse = await api.getPages({
    limit: 100, // Nastavte vhodný limit
    depth: 0 // Nemusíme načítat vztahy
  });

  return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
          />

          {/* Seznam stránek */}
          <div className="w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Seznam stránek</h2>

            {pagesData.docs.length === 0 ? (
                <p>Žádné stránky nebyly nalezeny.</p>
            ) : (
                <ul className="space-y-4">
                  {pagesData.docs.map((page) => (
                      <li key={page.id} className="border border-black/[.08] dark:border-white/[.145] rounded-lg p-4 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors">
                        {/* Změna odkazu z ID na slug */}
                        <Link href={`/${page.slug}`} className="flex justify-between items-center">
                          <span className="font-medium">{page.title}</span>
                          <span className="text-sm text-gray-500">{page.slug}</span>
                        </Link>
                      </li>
                  ))}
                </ul>
            )}

            {/* Zobrazení paginace, pokud je více stránek */}
            {pagesData.totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  {Array.from({ length: pagesData.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Link
                          key={pageNum}
                          href={`/?page=${pageNum}`}
                          className={`w-8 h-8 flex items-center justify-center rounded-full ${
                              pageNum === pagesData.page
                                  ? 'bg-foreground text-background'
                                  : 'border border-black/[.08] dark:border-white/[.145]'
                          }`}
                      >
                        {pageNum}
                      </Link>
                  ))}
                </div>
            )}
          </div>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
              <Image
                  className="dark:invert"
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={20}
                  height={20}
              />
              Deploy now
            </a>
            <a
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
            >
              Read our docs
            </a>
          </div>
        </main>
        {/* Zbytek komponenty... */}
      </div>
  );
}