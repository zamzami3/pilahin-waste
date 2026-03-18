"use client"

import React, { useEffect, useState } from "react"
import { getCurrentUser, saveCurrentUser } from "../lib/mockAuth"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Lock,
  ShieldCheck,
  BadgeCheck,
  Activity,
} from "lucide-react"

export default function ProfileView({ routeRole }) {
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    setPhone(u?.phone || u?.whatsapp || "")
    setAddress(u?.address || u?.alamat || "")
  }, [])

  function saveProfile() {
    if (!user) return
    const updated = { ...user, phone, whatsapp: phone, address }
    try {
      saveCurrentUser(updated)
    } catch (e) {
      localStorage.setItem('pilahin_user', JSON.stringify(updated))
    }
    setUser(updated)
    setEditing(false)
    setMsg({ type: 'success', text: 'Profil berhasil disimpan.' })
    setTimeout(() => setMsg(null), 3000)
  }

  function getCoords(u) {
    if (!u) return { lat: -6.200392, lng: 106.816048 }
    if (u.lat && u.lng) return { lat: u.lat, lng: u.lng }
    if (u.lat_long) {
      if (Array.isArray(u.lat_long)) return { lat: u.lat_long[0], lng: u.lat_long[1] }
      if (typeof u.lat_long === 'object' && u.lat_long.lat) return { lat: u.lat_long.lat, lng: u.lat_long.lng }
    }
    return { lat: -6.200392, lng: 106.816048 }
  }

  function tasksDoneCount(u) {
    if (!u) return 0
    const raw = localStorage.getItem(`pilahin_driver_tasks_${u.id}`) || localStorage.getItem(`pilahin_tasks_${u.id}`) || localStorage.getItem(`pilahin_tasks`)
    if (!raw) return 0
    try {
      const arr = JSON.parse(raw)
      return Array.isArray(arr) ? arr.filter((t) => t.status === 'done' || t.status === 'selesai').length : 0
    } catch (e) {
      return 0
    }
  }

  function joinedDate(u) {
    if (!u?.joinedAt) return "Tidak tersedia"
    return new Date(u.joinedAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const coords = getCoords(user)
  const role = (user?.role || routeRole || "warga").toLowerCase()

  const roleMetric =
    role === "warga"
      ? `${Number(user?.points ?? 0)} poin`
      : role === "driver"
        ? `${tasksDoneCount(user)} tugas selesai`
        : "Seluruh panel aktif"

  const accountStatus = user ? "Akun Aktif" : "Belum Tersinkron"
  const rawAddress = (user?.address || user?.alamat || address || "").trim()
  const profileAddress = user?.address || user?.alamat || address || "Alamat belum diset"
  const mapQuery = rawAddress ? encodeURIComponent(rawAddress) : `${coords.lat},${coords.lng}`

  return (
    <div className="w-full space-y-6 md:space-y-7">
      <header className="relative overflow-hidden rounded-3xl text-white shadow-[0_28px_70px_-35px_rgba(20,56,42,0.85)]">
        <div className="relative bg-forest-emerald p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4 md:gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner">
                <User size={34} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold leading-tight md:text-3xl">{user?.name || "Nama Tidak Tersedia"}</h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-white/90">
                  <Mail size={14} />
                  {user?.email || "-"}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-white/90">
                  <Phone size={14} />
                  {user?.whatsapp || user?.phone || "-"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/15 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/25"
              >
                <Edit3 size={15} />
                Edit Profil
              </button>
              <button
                onClick={() => alert("Ubah password - demo UI")}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-forest-emerald transition hover:bg-mint-soft"
              >
                <Lock size={15} />
                Keamanan Akun
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs md:text-sm">
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5">{accountStatus}</span>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5">Bergabung: {joinedDate(user)}</span>
          </div>
        </div>
      </header>

      {msg && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            msg.type === "success"
              ? "border-eco-green/30 bg-eco-green/10 text-eco-green"
              : "border-red-200 bg-red-100 text-red-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-forest-emerald/10 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Status</p>
              <p className="mt-2 text-lg font-bold text-forest-emerald">{accountStatus}</p>
            </div>
            <ShieldCheck className="text-eco-green" size={20} />
          </div>
        </div>

        <div className="rounded-2xl border border-forest-emerald/10 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Bergabung</p>
              <p className="mt-2 text-lg font-bold text-forest-emerald">{joinedDate(user)}</p>
            </div>
            <Calendar className="text-eco-green" size={20} />
          </div>
        </div>

        <div className="rounded-2xl border border-forest-emerald/10 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Kinerja</p>
              <p className="mt-2 text-lg font-bold text-forest-emerald">{roleMetric}</p>
            </div>
            <Activity className="text-eco-green" size={20} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-forest-emerald/10 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-forest-emerald">Informasi Personal</h2>
                <p className="mt-1 text-sm text-slate-600">Data identitas yang digunakan untuk komunikasi dan operasional.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-3 py-1 text-xs font-semibold text-forest-emerald">
                <BadgeCheck size={14} />
                Data Terverifikasi
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Nama Lengkap</p>
                <p className="mt-2 font-semibold text-forest-emerald">{user?.name || "-"}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Email</p>
                <p className="mt-2 font-semibold text-forest-emerald">{user?.email || "-"}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Nomor WhatsApp</p>
                <p className="mt-2 font-semibold text-forest-emerald">{user?.whatsapp || user?.phone || "-"}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <MapPin size={14} />
                  Alamat
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{profileAddress}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-forest-emerald/10 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-bold text-forest-emerald">Ringkasan Aktivitas</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Tanggal Bergabung</p>
                <p className="mt-2 font-semibold text-forest-emerald">{joinedDate(user)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Status</p>
                <p className="mt-2 font-semibold text-forest-emerald">{accountStatus}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Pencapaian</p>
                <p className="mt-2 font-semibold text-forest-emerald">{roleMetric}</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-forest-emerald/10 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="font-bold text-forest-emerald">Peta Lokasi</h3>
              <p className="mt-1 text-sm text-slate-600">Referensi lokasi akun pada area layanan.</p>
            </div>
            <div className="p-4">
              <div className="h-64 w-full overflow-hidden rounded-xl">
                <iframe
                  title="map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-forest-emerald/10 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-forest-emerald">Kepatuhan Akun</h3>
            <p className="mt-2 text-sm text-slate-600">Pastikan data kontak dan alamat selalu terbaru untuk menjaga kualitas layanan.</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <BadgeCheck size={14} className="text-eco-green" />
                Email terdaftar untuk notifikasi resmi
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck size={14} className="text-eco-green" />
                Kontak WhatsApp siap dihubungi
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck size={14} className="text-eco-green" />
                Alamat sinkron dengan area operasional
              </li>
            </ul>
          </section>
        </aside>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-forest-emerald/35 backdrop-blur-[2px]" onClick={() => setEditing(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/50 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-forest-emerald">Edit Profil</h3>
            <p className="mt-1 text-sm text-slate-600">Perbarui data agar tim operasional dapat menghubungi Anda dengan cepat.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Nomor WhatsApp</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-eco-green focus:ring-2 focus:ring-eco-green/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Alamat Lengkap</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-eco-green focus:ring-2 focus:ring-eco-green/20"
                  rows={4}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Batal
              </button>
              <button
                onClick={saveProfile}
                className="rounded-lg bg-eco-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-emerald"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
