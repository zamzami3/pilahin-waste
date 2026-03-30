"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { getPublishedArticles, seedArticlesIfNeeded } from "../../lib/articleStore"

export default function ArtikelPage() {
  const [articles, setArticles] = useState(() => getPublishedArticles(seedArticlesIfNeeded()))

  useEffect(() => {
    const seeded = seedArticlesIfNeeded()
    setArticles(getPublishedArticles(seeded))
  }, [])

  return (
    <main className="w-full py-14">
      <section className="container mx-auto px-6 md:px-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-forest-emerald">Artikel Pilahin</h1>
        <p className="mt-2 text-slate-600">Kumpulan artikel edukasi, operasional, dan insight keberlanjutan.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.length === 0 ? (
            <div className="md:col-span-3 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
              Belum ada artikel yang dipublikasikan admin.
            </div>
          ) : (
            articles.map((article) => (
              <article key={article.slug} className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-44 w-full bg-slate-100 overflow-hidden">
                  <img src={article.image} alt={article.alt} className="h-full w-full object-cover" loading="lazy" />
                </div>

                <div className="p-6">
                  <p className="text-xs tracking-wide text-slate-500 font-semibold">{article.category}</p>
                  <h2 className="mt-3 text-2xl leading-tight font-semibold text-[#1B1B1B]">{article.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{article.desc}</p>

                  <Link
                    href={`/artikel/${article.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-base font-semibold uppercase tracking-wide text-eco-green"
                  >
                    Pelajari Lebih Lanjut
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
