"use client"

import React from "react"
import { Check, CalendarDays, Truck, Gift, HelpCircle, Shield } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    id: "silver",
    name: "Silver",
    price: "Rp 25.000 / bln",
    pickups: "1x/minggu",
    weight: "hingga 10 kg/bulan",
    points: "Akses katalog poin",
    popular: false,
  },
  {
    id: "gold",
    name: "Gold",
    price: "Rp 50.000 / bln",
    pickups: "2x/minggu",
    weight: "hingga 25 kg/bulan",
    points: "Akses katalog poin + prioritas rute",
    popular: true,
  },
  {
    id: "emerald",
    name: "Emerald",
    price: "Rp 100.000 / bln",
    pickups: "Harian",
    weight: "hingga 100 kg/bulan",
    points: "Akses penuh + bonus poin",
    popular: false,
  },
]

const highlights = [
  {
    title: "Jadwal Fleksibel",
    desc: "Atur penjemputan sesuai paket dan kebutuhan rumah tangga.",
    icon: CalendarDays,
  },
  {
    title: "Pickup Terpantau",
    desc: "Status pickup dapat dipantau dari aplikasi secara berkala.",
    icon: Truck,
  },
  {
    title: "Insentif Poin",
    desc: "Sampah terpilah memberikan poin yang bisa ditukar hadiah.",
    icon: Gift,
  },
]

const includedServices = [
  "Edukasi pemilahan sampah rumah tangga",
  "Penjemputan terjadwal sesuai paket",
  "Pencatatan berat sampah per pickup",
  "Riwayat transaksi dan poin",
  "Dukungan bantuan melalui aplikasi",
]

const faqItems = [
  {
    q: "Apakah bisa upgrade paket di tengah bulan?",
    a: "Bisa. Upgrade paket dapat dilakukan kapan saja dan berlaku di periode aktif berikutnya.",
  },
  {
    q: "Kalau jadwal pickup terlewat bagaimana?",
    a: "Anda dapat mengajukan penjadwalan ulang melalui akun warga sesuai slot yang tersedia.",
  },
  {
    q: "Apakah semua jenis sampah diterima?",
    a: "Kami menerima jenis sampah sesuai panduan Pilahin. Detail kategori tersedia pada menu informasi warga.",
  },
]

export default function PricingSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto space-y-16 px-6 md:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B1B1B]">Paket Layanan</h2>
          <p className="mt-2 text-slate-600">Pilih paket yang sesuai dengan kebutuhan rumah tangga Anda.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="inline-flex rounded-lg bg-eco-green/10 p-3 text-eco-green">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-forest-emerald">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </article>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative bg-white rounded-2xl p-6 shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-lg border ${p.popular ? 'ring-2 ring-eco-green/10' : ''}`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="px-3 py-1 rounded-full text-sm font-semibold bg-mint-soft text-forest-emerald">Paling Populer</div>
                </div>
              )}

              <div className="flex flex-col items-start gap-4 h-full">
                <div>
                  <h3 className="text-xl font-semibold text-[#1B1B1B]">{p.name}</h3>
                  <div className="text-2xl font-bold text-forest-emerald mt-2">{p.price}</div>
                </div>

                <ul className="mt-4 space-y-3 flex-1">
                  <li className="flex items-start gap-3">
                    <span className="p-2 rounded-md bg-eco-green/10 text-eco-green">
                      <Check size={16} />
                    </span>
                    <div>
                      <div className="font-medium text-[#1B1B1B]">Jadwal Penjemputan</div>
                      <div className="text-sm text-slate-500">{p.pickups}</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="p-2 rounded-md bg-eco-green/10 text-eco-green">
                      <Check size={16} />
                    </span>
                    <div>
                      <div className="font-medium text-[#1B1B1B]">Batas Berat</div>
                      <div className="text-sm text-slate-500">{p.weight}</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="p-2 rounded-md bg-eco-green/10 text-eco-green">
                      <Check size={16} />
                    </span>
                    <div>
                      <div className="font-medium text-[#1B1B1B]">Poin & Hadiah</div>
                      <div className="text-sm text-slate-500">{p.points}</div>
                    </div>
                  </li>
                </ul>

                <div className="w-full mt-4">
                  {p.popular ? (
                    <Link href="/register" className="block text-center w-full px-4 py-3 rounded-md bg-eco-green text-white font-semibold">Pilih Paket</Link>
                  ) : (
                    <Link href="/register" className="block text-center w-full px-4 py-3 rounded-md border border-eco-green text-eco-green font-semibold hover:bg-eco-green hover:text-white transition">Pilih Paket</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-bold text-forest-emerald">Apa Saja yang Termasuk?</h3>
            <ul className="mt-5 space-y-3">
              {includedServices.map((service) => (
                <li key={service} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-0.5 text-eco-green">
                    <Shield size={18} />
                  </span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-2xl font-bold text-forest-emerald">Cara Kerja Langganan</h3>
            <ol className="mt-5 space-y-4 text-slate-700">
              <li>
                <span className="font-semibold text-forest-emerald">1. Pilih paket.</span> Tentukan Silver, Gold, atau Emerald sesuai kebutuhan.
              </li>
              <li>
                <span className="font-semibold text-forest-emerald">2. Daftar akun warga.</span> Lengkapi data untuk aktivasi layanan.
              </li>
              <li>
                <span className="font-semibold text-forest-emerald">3. Mulai penjemputan.</span> Tim Pilahin menjalankan pickup berdasarkan jadwal paket.
              </li>
            </ol>
          </article>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h3 className="text-2xl font-bold text-forest-emerald">Pertanyaan Umum</h3>
          <div className="mt-6 space-y-4">
            {faqItems.map((item) => (
              <article key={item.q} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start gap-2 text-forest-emerald">
                  <HelpCircle size={18} className="mt-0.5" />
                  <h4 className="font-semibold">{item.q}</h4>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-mint-soft p-8 text-center">
          <h3 className="text-2xl font-bold text-forest-emerald">Butuh Rekomendasi Paket?</h3>
          <p className="mt-2 text-slate-700">
            Mulai dari paket Silver terlebih dahulu, lalu upgrade kapan saja ketika kebutuhan meningkat.
          </p>
          <div className="mt-5 flex justify-center">
            <Link href="/register" className="rounded-full bg-eco-green px-6 py-3 font-semibold text-white hover:brightness-95">
              Mulai Berlangganan
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
