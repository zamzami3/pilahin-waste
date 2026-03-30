"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getPublishedArticles, seedArticlesIfNeeded } from "../../../lib/articleStore"

export default function ArtikelDetailPage() {
  const params = useParams()
  const [articles, setArticles] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const seeded = seedArticlesIfNeeded()
    setArticles(getPublishedArticles(seeded))
    setReady(true)
  }, [])

  const article = useMemo(
    () => articles.find((item) => item.slug === params?.slug),
    [articles, params?.slug]
  )

  const firstParagraphs = useMemo(() => article?.paragraphs?.slice(0, 2) || [], [article])
  const lastParagraphs = useMemo(() => article?.paragraphs?.slice(2) || [], [article])
  const otherArticles = useMemo(
    () => articles.filter((item) => item.slug !== article?.slug).slice(0, 4),
    [articles, article?.slug]
  )

  if (!ready) {
    return (
      <main className="w-full py-14">
        <section className="container mx-auto px-6 md:px-8 max-w-3xl">
          <p className="text-slate-500">Memuat artikel...</p>
        </section>
      </main>
    )
  }

  if (!article) {
    return (
      <main className="w-full py-14">
        <section className="container mx-auto px-6 md:px-8 max-w-3xl">
          <h1 className="text-3xl font-extrabold text-forest-emerald">Artikel tidak ditemukan</h1>
          <p className="mt-2 text-slate-600">Artikel mungkin belum dipublikasikan atau sudah dihapus admin.</p>
          <Link href="/artikel" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-eco-green hover:underline">
            <ArrowLeft size={16} />
            Kembali ke daftar artikel
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="w-full py-14">
      <article className="container mx-auto px-6 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <Link href="/artikel" className="inline-flex items-center gap-2 text-sm font-semibold text-eco-green hover:underline">
              <ArrowLeft size={16} />
              Kembali ke Artikel
            </Link>

            <p className="mt-6 text-xs tracking-wide text-slate-500 font-semibold">{article.category}</p>
            <h1 className="mt-3 text-3xl md:text-4xl leading-tight font-extrabold text-[#1B1B1B]">{article.title}</h1>
            <p className="mt-3 text-sm text-slate-500">{article.date}</p>

            <div className="mt-6 w-full h-64 md:h-80 bg-slate-100 overflow-hidden rounded-lg">
              <img src={article.image} alt={article.alt} className="h-full w-full object-cover" />
            </div>

            <div className="mt-8 space-y-6">
              {firstParagraphs.map((paragraph, index) => (
                <p key={`top-${index}`} className="text-base leading-8 text-slate-700">{paragraph}</p>
              ))}
            </div>

            <div className="mt-10">
              <div className="w-full h-52 md:h-64 bg-slate-100 overflow-hidden rounded-lg">
                <img
                  src={article.middleImage}
                  alt={article.middleAlt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <p className="mt-3 text-sm md:text-base text-slate-500 italic">{article.middleNote}</p>
            </div>

            <div className="mt-8 space-y-6">
              {lastParagraphs.map((paragraph, index) => (
                <p key={`bottom-${index}`} className="text-base leading-8 text-slate-700">{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-lg font-bold text-forest-emerald">Artikel Lainnya</h2>
              <p className="mt-1 text-sm text-slate-500">Baru ditambahkan admin</p>

              <div className="mt-5 space-y-4">
                {otherArticles.length === 0 ? (
                  <p className="text-sm text-slate-500">Belum ada artikel lain yang dipublikasikan.</p>
                ) : (
                  otherArticles.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/artikel/${item.slug}`}
                      className="block rounded-lg border border-slate-200 p-4 transition-colors hover:border-eco-green hover:bg-[#D8F3DC]/20"
                    >
                      <p className="text-[11px] tracking-wide font-semibold text-slate-500">{item.category}</p>
                      <h3 className="mt-2 text-base leading-snug font-semibold text-[#1B1B1B]">{item.title}</h3>
                      <p className="mt-2 text-xs text-slate-500">{item.date}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
  )
}
