"use client"

import React, { useState } from "react"
import { MapPin, Truck, Clock3, Shield, HelpCircle } from "lucide-react"

const LOCATIONS = [
  { name: "Kecamatan A", postal: "10110" },
  { name: "Kecamatan B", postal: "10220" },
  { name: "Kecamatan C", postal: "10330" },
  { name: "Desa Menteng", postal: "10440" },
  { name: "Kecamatan Sukamaju", postal: "10550" },
  { name: "Desa Harapan", postal: "10660" },
  { name: "Kecamatan Baru", postal: "10770" },
  { name: "Desa Maju", postal: "10880" },
]

const SERVICE_HIGHLIGHTS = [
  {
    title: "Pickup Terjadwal",
    desc: "Rute pickup disesuaikan dengan slot area agar lebih efisien.",
    icon: Truck,
  },
  {
    title: "Estimasi Respons",
    desc: "Verifikasi area biasanya diproses cepat pada jam operasional.",
    icon: Clock3,
  },
  {
    title: "Cakupan Berkembang",
    desc: "Penambahan area baru dilakukan bertahap sesuai kesiapan armada.",
    icon: Shield,
  },
]

const FAQ_ITEMS = [
  {
    q: "Jika kode pos belum tercover, apakah bisa daftar dulu?",
    a: "Bisa. Anda tetap dapat daftar dan masuk daftar prioritas saat area diperluas.",
  },
  {
    q: "Apakah jadwal pickup sama untuk semua area?",
    a: "Tidak selalu. Jadwal menyesuaikan kepadatan area dan rute armada di wilayah tersebut.",
  },
  {
    q: "Bagaimana jika lokasi saya di batas dua kecamatan?",
    a: "Tim kami akan memvalidasi berdasarkan kode pos dan titik koordinat alamat Anda.",
  },
]

export default function CoverageSection() {
  const [zip, setZip] = useState("")
  const [result, setResult] = useState(null)

  function handleCheck(e) {
    e?.preventDefault()
    const code = zip.trim()
    if (!code) {
      setResult({ status: "error", text: "Masukkan kode pos Anda." })
      return
    }

    const found = LOCATIONS.find((l) => l.postal === code || l.postal.startsWith(code))
    if (found) setResult({ status: "ok", text: `Area tercover: ${found.name} (Kode pos ${found.postal})` })
    else setResult({ status: "no", text: "Maaf, area Anda belum tercover. Coba masukkan kode pos lain." })
  }

  return (
    <section className="py-12 bg-slate-gray">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B1B1B]">Area Penjemputan Kami</h2>
            <p className="text-sm text-slate-600 mt-1">Kami melayani beberapa kecamatan dan desa di area terjangkau.</p>
          </div>

          <form onSubmit={handleCheck} className="flex items-center gap-2">
            <input
              aria-label="Cek Kode Pos"
              placeholder="Cek Kode Pos Kamu"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="px-4 py-2 border rounded-md w-48"
            />
            <button onClick={handleCheck} className="px-4 py-2 rounded-md bg-eco-green text-white">Periksa</button>
          </form>
        </div>

        {result && (
          <div className={`mb-6 p-3 rounded-md ${result.status === 'ok' ? 'bg-eco-green/10 text-forest-emerald' : result.status === 'error' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-700'}`}>
            {result.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {LOCATIONS.map((loc) => (
            <div key={loc.postal} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="p-2 rounded-md bg-forest-emerald/10 text-forest-emerald">
                <MapPin size={18} />
              </div>
              <div>
                <div className="font-medium text-[#1B1B1B]">{loc.name}</div>
                <div className="text-sm text-slate-500">Kode Pos: {loc.postal}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {SERVICE_HIGHLIGHTS.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="inline-flex rounded-lg bg-eco-green/10 p-2.5 text-eco-green">
                  <Icon size={18} />
                </div>
                <h3 className="mt-3 font-semibold text-forest-emerald">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </article>
            )
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-bold text-forest-emerald">Cara Cek Cakupan Layanan</h3>
            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              <li><span className="font-semibold text-forest-emerald">1.</span> Masukkan kode pos rumah Anda pada kolom pengecekan.</li>
              <li><span className="font-semibold text-forest-emerald">2.</span> Klik tombol Periksa untuk melihat status area.</li>
              <li><span className="font-semibold text-forest-emerald">3.</span> Jika belum tercover, Anda bisa tetap daftar untuk prioritas ekspansi.</li>
            </ol>
          </article>

          <article className="rounded-xl border border-slate-200 bg-mint-soft p-6">
            <h3 className="text-xl font-bold text-forest-emerald">Komitmen Layanan Area</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>Informasi area diperbarui berkala sesuai pengembangan operasional.</li>
              <li>Penjadwalan pickup disesuaikan dengan kepadatan rute wilayah.</li>
              <li>Wilayah prioritas ditentukan dari minat pendaftaran dan kapasitas armada.</li>
            </ul>
          </article>
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 md:p-8">
          <h3 className="text-xl font-bold text-forest-emerald">Pertanyaan Umum Seputar Cakupan</h3>
          <div className="mt-4 space-y-3">
            {FAQ_ITEMS.map((item) => (
              <article key={item.q} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start gap-2 text-forest-emerald">
                  <HelpCircle size={17} className="mt-0.5" />
                  <h4 className="font-semibold">{item.q}</h4>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-forest-emerald p-6 text-center text-white md:p-8">
          <h3 className="text-2xl font-bold">Area Kamu Belum Masuk?</h3>
          <p className="mt-2 text-white/85">Daftar sekarang agar wilayahmu masuk prioritas perluasan layanan Pilahin.</p>
          <a href="/register" className="mt-5 inline-block rounded-full bg-white px-6 py-2.5 font-semibold text-forest-emerald">
            Daftar Sekarang
          </a>
        </div>
      </div>
    </section>
  )
}
