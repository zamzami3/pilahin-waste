"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getUsers } from "../../lib/mockAuth"
import { FileText, RefreshCw, UploadCloud, Pencil, Trash2 } from "lucide-react"
import {
  buildArticleFromDraft,
  buildUniqueSlug,
  saveArticles,
  seedArticlesIfNeeded,
} from "../../lib/articleStore"

const emptyDraft = {
  id: null,
  slug: "",
  title: "",
  category: "",
  summary: "",
  paragraphs: "",
  image: "",
  middleImage: "",
  caption: "",
}

function toRelativeTime(dateValue) {
  if (!dateValue) return "Baru saja"
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return "Baru saja"
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000))
  if (diffMinutes < 1) return "Baru saja"
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} jam lalu`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} hari lalu`
}

function extractRequestRows(users) {
  if (!Array.isArray(users) || users.length === 0 || typeof window === "undefined") return []

  const wargaUsers = users.filter((user) => String(user.role || "").toLowerCase() === "warga")
  const rows = []

  wargaUsers.forEach((warga) => {
    const raw = localStorage.getItem(`pilahin_reports_${warga.id}`)
    if (!raw) return

    try {
      const reports = JSON.parse(raw)
      if (!Array.isArray(reports)) return

      reports.forEach((report) => {
        const status = String(report.status || "").toLowerCase()
        if (status && status !== "diproses" && status !== "pending" && status !== "new") return

        rows.push({
          id: report.id || `${warga.id}-${Date.now()}`,
          address: report.location || warga.address || warga.alamat || "Alamat tidak tersedia",
          type: report.jenis || report.type || "Laporan Sampah",
          reportedAt: toRelativeTime(report.date),
          status: "new",
          createdAt: report.date ? new Date(report.date).getTime() : 0,
        })
      })
    } catch (error) {
      // Skip malformed local report payload.
    }
  })

  return rows.sort((a, b) => b.createdAt - a.createdAt).map(({ createdAt, ...rest }) => rest)
}

export default function AdminHome() {
  const [users, setUsers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [requests, setRequests] = useState([])
  const [activeTab, setActiveTab] = useState("overview")

  const [articleDraft, setArticleDraft] = useState(emptyDraft)
  const [articleItems, setArticleItems] = useState([])
  const [articleError, setArticleError] = useState("")
  const [articleNotice, setArticleNotice] = useState("")

  useEffect(() => {
    const u = getUsers()
    setUsers(u)

    const d = u.filter((x) => x.role === "driver")
    const dWithStatus = d.map((drv) => ({
      ...drv,
      status: String(drv.status || "idle").toLowerCase() === "on-route" ? "on-route" : "idle",
      area: drv.address || drv.alamat || "Belum ada area",
      lastSeen: "-",
    }))
    setDrivers(dWithStatus)

    setRequests(extractRequestRows(u))

    setArticleItems(seedArticlesIfNeeded())
  }, [])

  const totalIncome = 0
  const totalResidents = users.filter((u) => u.role === "warga").length
  const driversOnDuty = drivers.filter((d) => d.status === "on-route").length
  const totalTrash = 0

  const articleCount = articleItems.length
  const publishedCount = articleItems.filter((item) => item.status === "published").length
  const draftCount = articleCount - publishedCount

  function assignRequest(id) {
    const driver = drivers[0]
    if (!driver) return
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "assigned", assignedTo: driver?.name || null } : r))
    )
  }

  function refreshFleet() {
    setDrivers((prev) =>
      prev.map((d) => ({
        ...d,
        status: Math.random() > 0.4 ? "on-route" : "idle",
        lastSeen: `${Math.floor(Math.random() * 30)}m`,
      }))
    )
  }

  function updateDraft(field, value) {
    setArticleDraft((prev) => ({ ...prev, [field]: value }))
  }

  function resetDraft() {
    setArticleDraft(emptyDraft)
  }

  function syncArticles(nextArticles) {
    setArticleItems(nextArticles)
    saveArticles(nextArticles)
  }

  function validateDraft() {
    if (!articleDraft.title.trim()) return "Judul artikel wajib diisi."
    if (!articleDraft.category.trim()) return "Kategori artikel wajib diisi."
    if (!articleDraft.summary.trim()) return "Ringkasan artikel wajib diisi."
    return ""
  }

  function upsertArticle(targetStatus = "draft") {
    setArticleError("")
    setArticleNotice("")

    const validation = validateDraft()
    if (validation) {
      setArticleError(validation)
      return
    }

    const existingSlugs = articleItems.map((item) => item.slug)
    const nextSlug = buildUniqueSlug(articleDraft.title, existingSlugs, articleDraft.slug)
    if (!nextSlug) {
      setArticleError("Slug artikel tidak valid. Ubah judul artikel.")
      return
    }

    const built = buildArticleFromDraft(articleDraft, {
      slug: nextSlug,
      status: targetStatus,
      nowLabel: "Baru saja",
    })

    if (articleDraft.id) {
      const next = articleItems.map((item) =>
        item.id === articleDraft.id
          ? {
              ...item,
              ...built,
              id: articleDraft.id,
              status: targetStatus,
            }
          : item
      )
      syncArticles(next)
      setArticleNotice("Artikel berhasil diperbarui.")
    } else {
      syncArticles([{ ...built, status: targetStatus }, ...articleItems])
      setArticleNotice("Artikel baru berhasil ditambahkan.")
    }

    resetDraft()
  }

  function togglePublish(id) {
    const next = articleItems.map((item) =>
      item.id === id
        ? {
            ...item,
            status: item.status === "published" ? "draft" : "published",
            updatedAt: "Baru saja",
            date: "Baru saja",
          }
        : item
    )
    syncArticles(next)
  }

  function editArticle(item) {
    setArticleError("")
    setArticleNotice("")
    setArticleDraft({
      id: item.id,
      slug: item.slug,
      title: item.title,
      category: item.category,
      summary: item.desc,
      paragraphs: (item.paragraphs || []).join("\n\n"),
      image: item.image || "",
      middleImage: item.middleImage || "",
      caption: item.middleNote || "",
    })
    setActiveTab("articles")
  }

  function deleteArticle(id) {
    const next = articleItems.filter((item) => item.id !== id)
    syncArticles(next)
    if (articleDraft.id === id) {
      resetDraft()
    }
    setArticleError("")
    setArticleNotice("Artikel berhasil dihapus.")
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">Command Center</h1>
        <p className="text-sm text-mint-soft mt-1">Ringkasan operasional, armada, dan permintaan terbaru.</p>

        <div className="mt-4 inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${activeTab === "overview" ? "bg-eco-green text-white" : "text-slate-700 hover:bg-slate-100"}`}
          >
            Ringkasan Admin
          </button>
          <button
            onClick={() => setActiveTab("articles")}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${activeTab === "articles" ? "bg-eco-green text-white" : "text-slate-700 hover:bg-slate-100"}`}
          >
            Kelola Artikel
          </button>
        </div>
      </header>

      {activeTab === "overview" ? (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow text-slate-800">
              <div className="text-sm text-slate-500">Total Pemasukan</div>
              <div className="text-2xl font-semibold text-forest-emerald">Rp {totalIncome.toLocaleString("id-ID")}</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow text-slate-800">
              <div className="text-sm text-slate-500">Total Warga Aktif</div>
              <div className="text-2xl font-semibold text-forest-emerald">{totalResidents}</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow text-slate-800">
              <div className="text-sm text-slate-500">Driver Bertugas</div>
              <div className="text-2xl font-semibold text-forest-emerald">{driversOnDuty}</div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow text-slate-800">
              <div className="text-sm text-slate-500">Total Sampah Seluruhnya (kg)</div>
              <div className="text-2xl font-semibold text-forest-emerald">{totalTrash} kg</div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow text-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-forest-emerald">Tren Volume Mingguan</h3>
                <div className="text-sm text-slate-500">(placeholder grafik)</div>
              </div>
              <div className="h-64 rounded-md bg-slate-100 flex items-center justify-center text-slate-400">
                Grafik volume mingguan (placeholder)
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow text-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-forest-emerald">Map / Fleet Monitor</h3>
                <button onClick={refreshFleet} className="text-sm px-3 py-1 rounded-md bg-eco-green text-white flex items-center gap-2">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              <div className="space-y-3">
                {drivers.length === 0 && <div className="text-sm text-slate-500">Tidak ada driver terdaftar.</div>}
                {drivers.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-md border">
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-sm text-slate-500">{d.area} • terakhir {d.lastSeen}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${d.status === "on-route" ? "bg-eco-green text-white" : "bg-slate-100 text-slate-700"}`}>
                        {d.status === "on-route" ? "On-Route" : "Idle"}
                      </div>
                      <Link href="/admin/armada" className="text-sm text-forest-emerald">Lihat</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg p-4 shadow mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-forest-emerald">New Requests</h3>
              <div className="text-sm text-slate-500">Permintaan baru dari warga</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-slate-500">
                    <th className="py-2">#</th>
                    <th className="text-slate-600">Alamat</th>
                    <th className="text-slate-600">Jenis</th>
                    <th className="text-slate-600">Dilaporkan</th>
                    <th className="text-slate-600">Status</th>
                    <th className="text-slate-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr className="border-t">
                      <td colSpan={6} className="py-4 text-sm text-slate-500">Belum ada request baru dari warga.</td>
                    </tr>
                  ) : (
                    requests.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="py-3 text-sm text-slate-700">{r.id}</td>
                        <td className="py-3 text-slate-700">{r.address}</td>
                        <td className="py-3 text-sm text-slate-600">{r.type}</td>
                        <td className="py-3 text-sm text-slate-500">{r.reportedAt}</td>
                        <td className="py-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${r.status === "new" ? "bg-yellow-100 text-yellow-800" : r.status === "assigned" ? "bg-eco-green text-white" : "bg-slate-100 text-slate-700"}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3">
                          {r.status === "new" ? (
                            <button onClick={() => assignRequest(r.id)} className="px-3 py-1 rounded-md bg-forest-emerald text-white text-sm">Assign</button>
                          ) : (
                            <div className="text-sm text-slate-500">{r.assignedTo ? `Assigned to ${r.assignedTo}` : r.status}</div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex flex-wrap gap-3">
            <Link href="/admin/users" className="px-4 py-2 rounded-md bg-white shadow text-forest-emerald">Manajemen User</Link>
            <Link href="/admin/finance" className="px-4 py-2 rounded-md bg-white shadow text-forest-emerald">Laporan Keuangan</Link>
            <Link href="/admin/armada" className="px-4 py-2 rounded-md bg-white shadow text-forest-emerald">Manajemen Armada</Link>
            <Link href="/admin/settings" className="px-4 py-2 rounded-md bg-white shadow text-forest-emerald">Pengaturan API Token</Link>
          </section>
        </>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow text-slate-800">
            <div className="flex items-center gap-2 text-forest-emerald">
              <UploadCloud size={18} />
              <h2 className="text-lg font-semibold">Upload Artikel Baru</h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">Isi form, lalu simpan sebagai draft atau langsung publish.</p>

            {articleError && <div className="mt-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{articleError}</div>}
            {articleNotice && <div className="mt-3 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">{articleNotice}</div>}

            <form className="mt-4 space-y-4">
              <div>
                <label className="text-sm text-slate-600">Judul Artikel</label>
                <input
                  value={articleDraft.title}
                  onChange={(e) => updateDraft("title", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Masukkan judul artikel"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Kategori</label>
                <input
                  value={articleDraft.category}
                  onChange={(e) => updateDraft("category", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Contoh: Edukasi Warga"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Ringkasan</label>
                <textarea
                  value={articleDraft.summary}
                  onChange={(e) => updateDraft("summary", e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Tulis ringkasan artikel"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Isi Artikel (pisahkan paragraf dengan baris kosong)</label>
                <textarea
                  value={articleDraft.paragraphs}
                  onChange={(e) => updateDraft("paragraphs", e.target.value)}
                  rows={6}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Paragraf 1..."
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">URL Gambar Utama</label>
                <input
                  value={articleDraft.image}
                  onChange={(e) => updateDraft("image", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">URL Gambar Tengah</label>
                <input
                  value={articleDraft.middleImage}
                  onChange={(e) => updateDraft("middleImage", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Opsional, default mengikuti gambar utama"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Caption Gambar Tengah</label>
                <input
                  value={articleDraft.caption}
                  onChange={(e) => updateDraft("caption", e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Caption berbeda dari isi artikel"
                />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => upsertArticle("draft")} className="flex-1 rounded-md bg-slate-200 text-slate-800 py-2 font-semibold text-sm">Simpan Draft</button>
                <button type="button" onClick={() => upsertArticle("published")} className="flex-1 rounded-md bg-eco-green text-white py-2 font-semibold text-sm">Simpan & Publish</button>
              </div>

              {articleDraft.id && (
                <button type="button" onClick={resetDraft} className="w-full rounded-md border border-slate-300 text-slate-700 py-2 font-semibold text-sm">Batal Edit</button>
              )}
            </form>
          </div>

          <div className="lg:col-span-3 bg-white rounded-xl p-5 shadow text-slate-800">
            <div className="flex items-center justify-between gap-3 text-forest-emerald">
              <div className="flex items-center gap-2">
                <FileText size={18} />
                <h2 className="text-lg font-semibold">Daftar Artikel Admin</h2>
              </div>
              <div className="text-xs text-slate-600">Total: {articleCount} | Publish: {publishedCount} | Draft: {draftCount}</div>
            </div>

            <div className="mt-4 space-y-3">
              {articleItems.length === 0 ? (
                <div className="text-sm text-slate-500">Belum ada artikel. Tambahkan artikel pertama Anda.</div>
              ) : (
                articleItems.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] tracking-wide font-semibold text-slate-500">{item.category}</p>
                        <h3 className="mt-1 text-base font-semibold text-[#1B1B1B]">{item.title}</h3>
                        <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                        <p className="mt-2 text-xs text-slate-500">Slug: {item.slug}</p>
                        <p className="mt-1 text-xs text-slate-500">Update terakhir: {item.updatedAt}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => togglePublish(item.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold ${item.status === "published" ? "bg-eco-green text-white" : "bg-slate-100 text-slate-700"}`}
                        >
                          {item.status === "published" ? "Published" : "Draft"}
                        </button>

                        <div className="flex gap-2">
                          <button onClick={() => editArticle(item)} className="px-2 py-1 rounded-md border border-slate-300 text-slate-700"><Pencil size={14} /></button>
                          <button onClick={() => deleteArticle(item.id)} className="px-2 py-1 rounded-md border border-red-200 text-red-600"><Trash2 size={14} /></button>
                        </div>

                        {item.status === "published" && (
                          <Link href={`/artikel/${item.slug}`} className="text-xs font-semibold text-eco-green hover:underline">Lihat Publik</Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
