"use client"

import React from "react"
import { CheckCircle, Home, Eye, Gift, Users, Leaf } from "lucide-react"

export default function AboutSection() {
  const galeriFoto = [
    {
      title: "Edukasi Pilah Sampah",
      caption: "Sosialisasi pemilahan sampah ke warga.",
      src: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1200&q=80",
      tilt: "-2deg",
      shape: "md:col-span-2 md:row-span-2",
    },
    {
      title: "Pengumpulan Terjadwal",
      caption: "Pickup sesuai rute operasional harian.",
      src: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1000&q=80",
      tilt: "2deg",
      shape: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Sortir Material",
      caption: "Pemilahan lanjutan di titik pengolahan.",
      src: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80",
      tilt: "-1deg",
      shape: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Kolaborasi Komunitas",
      caption: "Gerakan bersama untuk lingkungan bersih.",
      src: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1000&q=80",
      tilt: "1.5deg",
      shape: "md:col-span-1 md:row-span-2",
    },
    {
      title: "Monitoring Data",
      caption: "Pencatatan hasil layanan secara real-time.",
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
      tilt: "-1.5deg",
      shape: "md:col-span-2 md:row-span-1",
    },
  ]

  const alasanKami = [
    {
      icon: Home,
      title: "Operasional Jelas",
      desc: "Jadwal pickup, status proses, dan riwayat layanan tercatat rapi dalam satu sistem.",
    },
    {
      icon: Eye,
      title: "Data Transparan",
      desc: "Berat sampah, jenis sampah, hingga poin terekam sehingga warga bisa memantau hasilnya.",
    },
    {
      icon: Leaf,
      title: "Dampak Nyata",
      desc: "Setiap proses pemilahan yang benar membantu mengurangi sampah campur ke TPA.",
    },
  ]

  const riwayatPilahin = [
    {
      year: "2023",
      title: "Inisiasi Program",
      desc: "Pilahin dimulai sebagai program edukasi pemilahan sampah rumah tangga di beberapa RT percontohan.",
    },
    {
      year: "2024",
      title: "Digitalisasi Layanan",
      desc: "Penjemputan dan pencatatan data mulai didigitalisasi agar alur kerja warga, driver, dan admin lebih terintegrasi.",
    },
    {
      year: "2025",
      title: "Pengembangan Skala Kota",
      desc: "Cakupan layanan dan armada diperluas, termasuk penguatan program insentif poin untuk warga aktif.",
    },
  ]

  const timPilahin = [
    {
      name: "Rani Pramesti",
      role: "Head of Operations",
      note: "Memastikan layanan pickup berjalan tepat waktu dan berkualitas.",
    },
    {
      name: "Fajar Nugroho",
      role: "Technology Lead",
      note: "Mengembangkan platform Pilahin agar stabil, aman, dan mudah digunakan.",
    },
    {
      name: "Nadia Putri",
      role: "Community & Education",
      note: "Mendorong perubahan perilaku lewat edukasi pemilahan sampah berbasis komunitas.",
    },
  ]

  return (
    <section className="bg-white">
      <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=2000&q=80"
          alt="Aktivitas pengelolaan sampah Pilahin"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-emerald/70" />
        <div className="absolute inset-0 mx-auto flex w-full max-w-7xl items-center px-6 md:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em]">Tentang Kami</p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Pilahin untuk lingkungan yang lebih bersih, terukur, dan berkelanjutan.
            </h1>
            <p className="mt-5 text-base text-white/90 md:text-lg">
              Kami membangun sistem manajemen sampah yang mempertemukan warga, driver, dan admin
              dalam alur layanan yang praktis dan transparan.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-20 px-6 py-16 md:px-8 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex rounded-full bg-forest-emerald/10 p-3 text-forest-emerald">
              <Gift size={22} />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-forest-emerald">Visi</h2>
            <p className="leading-relaxed text-slate-700">
              Menjadi ekosistem pengelolaan sampah terpadu yang mendorong perilaku pilah sampah
              dari rumah, meningkatkan efisiensi operasional, dan menghadirkan dampak lingkungan nyata.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-4 inline-flex rounded-full bg-eco-green/10 p-3 text-eco-green">
              <Users size={22} />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-forest-emerald">Misi</h2>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2"><CheckCircle size={18} className="mt-0.5 text-eco-green" />Mempermudah layanan pickup sampah terpilah dengan sistem digital.</li>
              <li className="flex items-start gap-2"><CheckCircle size={18} className="mt-0.5 text-eco-green" />Mendorong transparansi data untuk warga, driver, dan pengelola.</li>
              <li className="flex items-start gap-2"><CheckCircle size={18} className="mt-0.5 text-eco-green" />Membangun kebiasaan daur ulang melalui edukasi dan insentif yang relevan.</li>
            </ul>
          </article>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-forest-emerald md:text-4xl">Kenapa Kami</h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            Kami fokus pada sistem yang bukan hanya terlihat bagus, tapi benar-benar memudahkan
            operasional harian pengelolaan sampah dari hulu ke hilir.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {alasanKami.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="mb-4 inline-flex rounded-full bg-white p-3 text-eco-green shadow-sm">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-forest-emerald">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </article>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-forest-emerald md:text-4xl">Sejarah Pilahin</h2>
          <div className="mt-8 space-y-5">
            {riwayatPilahin.map((item) => (
              <article key={item.year} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <p className="text-sm font-bold tracking-[0.15em] text-eco-green">{item.year}</p>
                <h3 className="mt-2 text-xl font-bold text-forest-emerald">{item.title}</h3>
                <p className="mt-2 text-slate-600">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-forest-emerald md:text-4xl">Galeri Foto</h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            Potret aktivitas Pilahin dari edukasi warga sampai proses operasional lapangan.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 md:auto-rows-[180px] md:grid-cols-3">
            {galeriFoto.map((foto) => (
              <article
                key={foto.title}
                className={`gallery-tile reveal-item ${foto.shape} relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm`}
                style={{ "--tile-tilt": foto.tilt }}
              >
                <img
                  src={foto.src}
                  alt={foto.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.parentElement?.classList.add("photo-fallback")
                  }}
                />
                <div className="gallery-overlay absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="text-base font-semibold">{foto.title}</h3>
                  <p className="mt-1 text-xs text-white/90">{foto.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-forest-emerald md:text-4xl">Tim Pilahin</h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            Tim lintas fungsi kami bekerja bersama agar layanan Pilahin konsisten, aman, dan berdampak.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {timPilahin.map((person) => (
              <article key={person.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 h-12 w-12 rounded-full bg-mint-soft" />
                <h3 className="text-lg font-bold text-forest-emerald">{person.name}</h3>
                <p className="mt-1 text-sm font-semibold text-eco-green">{person.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{person.note}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
