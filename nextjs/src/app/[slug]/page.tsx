import Image from "next/image";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { notFound } from "next/navigation";
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

// Importujte komponenty pro vykreslení Lexical obsahu

// Definování typů pro stránku
interface PageDetail {
  id: string;
  title: string;
  content: any; // Lexical obsah je uložen jako JSON
  slug: string;
}

// Definování typu pro parametry
interface PageParams {
  slug: string;
}

// Generování statických parametrů pro stránky (volitelné pro SSG)
export async function generateStaticParams() {
  const pages = await api.getPages();

  return pages.docs.map((page) => ({
    slug: page.slug,
  }));
}

// Potřebujeme upravit API pro získávání stránky podle slugu
async function getPageBySlug(slug: string) {
  // V API potřebujeme dotaz, který vrací stránku podle slugu
  const pagesData = await api.getPages({
    where: {
      slug: {
        equals: slug
      }
    },
    depth: 1,
    limit: 1
  });

  if (!pagesData.docs.length) {
    return null;
  }

  return pagesData.docs[0];
}

export default async function PageDetail({ params }: { params: PageParams }) {
  try {
    // Použití nové metody
    const page = await api.getPageBySlug(params.slug, {
      depth: 1,
    });
    const html = convertLexicalToHTML({ data:page.content })
    if (!page) {
      return notFound();
    }

    return (
        <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <div className="max-w-4xl mx-auto">
            <Link
                href="/"
                className="inline-flex items-center gap-2 mb-8 hover:underline hover:underline-offset-4"
            >
              &larr; Zpět na seznam stránek
            </Link>

            <article className="prose prose-lg dark:prose-invert max-w-none">
              <h1 className="text-3xl font-bold mb-6">{page.title}</h1>

              {/* Vykreslení Lexical obsahu pomocí správné komponenty */}
              {page.content ? (
                  <div dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                  <p>Tato stránka nemá žádný obsah.</p>
              )}

            </article>
          </div>
        </div>
    );
  } catch (error) {
    console.error("Chyba při načítání stránky:", error);
    return notFound();
  }
}