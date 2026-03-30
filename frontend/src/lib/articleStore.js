import { mockArticles } from "./mockArticles"

export const ARTICLE_STORAGE_KEY = "pilahin_articles_v1"
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1200&q=80"

function ensureParagraphs(paragraphs, desc) {
  const fallback = desc || "Artikel ini masih dalam tahap pengembangan konten."
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
    return [fallback, fallback, fallback, fallback]
  }

  const normalized = paragraphs.filter(Boolean).map((p) => String(p).trim()).filter(Boolean)
  while (normalized.length < 4) {
    normalized.push(fallback)
  }
  return normalized.slice(0, 8)
}

export function slugifyTitle(title) {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function buildUniqueSlug(title, existingSlugs = [], currentSlug = "") {
  const base = slugifyTitle(title) || "artikel-baru"
  const reserved = new Set(existingSlugs.filter((slug) => slug && slug !== currentSlug))
  let candidate = base
  let index = 2

  while (reserved.has(candidate)) {
    candidate = `${base}-${index}`
    index += 1
  }
  return candidate
}

function normalizeArticle(article, index = 0) {
  const title = article?.title || `Artikel ${index + 1}`
  const desc = article?.desc || "Ringkasan artikel belum tersedia."

  return {
    id: article?.id || `seed-${index + 1}`,
    slug: article?.slug || slugifyTitle(title) || `artikel-${index + 1}`,
    category: article?.category || "UMUM",
    title,
    desc,
    paragraphs: ensureParagraphs(article?.paragraphs, desc),
    middleImage: article?.middleImage || article?.image,
    middleAlt: article?.middleAlt || article?.alt || title,
    middleNote: article?.middleNote || "Catatan gambar pendukung artikel.",
    image: article?.image || FALLBACK_IMAGE,
    alt: article?.alt || title,
    date: article?.date || "-",
    status: article?.status || "published",
    updatedAt: article?.updatedAt || article?.date || "-",
  }
}

export function getDefaultArticles() {
  return mockArticles.map((item, index) => normalizeArticle(item, index))
}

export function getStoredArticles() {
  if (typeof window === "undefined") return getDefaultArticles()

  try {
    const raw = window.localStorage.getItem(ARTICLE_STORAGE_KEY)
    if (!raw) return getDefaultArticles()

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return getDefaultArticles()

    return parsed.map((item, index) => normalizeArticle(item, index))
  } catch (error) {
    return getDefaultArticles()
  }
}

export function saveArticles(articles) {
  if (typeof window === "undefined") return
  const normalized = Array.isArray(articles) ? articles.map((item, index) => normalizeArticle(item, index)) : []
  window.localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(normalized))
}

export function seedArticlesIfNeeded() {
  if (typeof window === "undefined") return getDefaultArticles()

  const existing = getStoredArticles()
  if (!window.localStorage.getItem(ARTICLE_STORAGE_KEY)) {
    saveArticles(existing)
  }
  return existing
}

export function getPublishedArticles(articles) {
  return (articles || []).filter((item) => item.status === "published")
}

export function buildArticleFromDraft(draft, options = {}) {
  const nowLabel = options.nowLabel || "Baru saja"
  const title = String(draft?.title || "").trim()
  const category = String(draft?.category || "").trim().toUpperCase()
  const summary = String(draft?.summary || "").trim()
  const mainImage = String(draft?.image || "").trim() || FALLBACK_IMAGE
  const middleImage = String(draft?.middleImage || "").trim() || mainImage
  const caption = String(draft?.caption || "").trim()
  const paragraphLines = String(draft?.paragraphs || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  return {
    id: `adm-${Date.now()}`,
    slug: options.slug,
    category,
    title,
    desc: summary,
    paragraphs: ensureParagraphs(paragraphLines, summary),
    image: mainImage,
    alt: title,
    middleImage,
    middleAlt: title,
    middleNote: caption || "Catatan visual pendukung artikel.",
    date: nowLabel,
    updatedAt: nowLabel,
    status: options.status || "draft",
  }
}
