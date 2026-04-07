"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  User,
  Clipboard,
  Truck,
  Trash2,
  Users,
  BarChart2,
  BarChart3,
  ArrowRight,
  Gift,
} from "lucide-react";
import {
  getPublishedArticles,
  seedArticlesIfNeeded,
} from "../lib/articleStore";
import AnimatedStatValue from "../components/AnimatedStatValue";

const stats = [
  { label: "Total Warga", value: 12342, icon: Users },
  { label: "Sampah Terolah", value: 24500, suffix: "kg", icon: BarChart2 },
  { label: "Poin Terbagi", value: 48900, icon: Gift },
];

const steps = [
  { title: "Daftar", desc: "Buat akun dan pilih paket langganan.", icon: User },
  {
    title: "Pilah",
    desc: "Pisahkan sampah organik & anorganik sesuai panduan.",
    icon: Clipboard,
  },
  {
    title: "Jemput",
    desc: "Kurir kami menjemput sesuai jadwal Anda.",
    icon: Truck,
  },
];

const featuredServices = [
  {
    title: "Pilah Sampah dari Rumah",
    desc: "Setor sampah terpilah dan dapatkan poin menarik.",
    cta: "Selengkapnya",
    href: "/warga",
    icon: Trash2,
  },
  {
    title: "Ambil Tugas Penjemputan",
    desc: "Lihat tugas hari ini, ikuti rute efisien, dan input berat sampah.",
    cta: "Selengkapnya",
    href: "/driver",
    icon: Truck,
  },
  {
    title: "Pantau Seluruh Operasional",
    desc: "Lihat analytics, kelola user, armada, dan laporan keuangan.",
    cta: "Selengkapnya",
    href: "/admin",
    icon: BarChart3,
  },
];

const pricing = [
  {
    name: "Silver",
    price: "Rp 20.000 / bln",
    features: ["Jemput mingguan", "Akses aplikasi", "Dukungan chat"],
  },
  {
    name: "Gold",
    price: "Rp 45.000 / bln",
    features: ["Jemput 2x/minggu", "Prioritas rute", "Tukar poin"],
  },
  {
    name: "Emerald",
    price: "Rp 80.000 / bln",
    features: ["Jemput harian", "Konsultasi limbah", "Bonus poin"],
  },
];

const areas = [
  "Kecamatan A",
  "Kecamatan B",
  "Kecamatan C",
  "Kecamatan D",
  "Kecamatan E",
];

export default function HomePage() {
  const [featuredArticles, setFeaturedArticles] = useState(() =>
    getPublishedArticles(seedArticlesIfNeeded()).slice(0, 3),
  );

  useEffect(() => {
    const seeded = seedArticlesIfNeeded();
    setFeaturedArticles(getPublishedArticles(seeded).slice(0, 3));
  }, []);

  return (
    <main className="w-full">
      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-forest-emerald" />
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-eco-green/35" />
        <div className="absolute right-20 top-20 h-44 w-44 rounded-3xl bg-white/10" />
        <div className="absolute bottom-0 left-1/3 h-28 w-72 rounded-t-[3rem] bg-eco-green/30" />
        <div className="relative container mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              Kelola Sampah Jadi Berkah
            </h1>
            <p className="mt-4 text-lg text-white/90">
              Gabung dengan komunitas Pilahin: pilah, tukar poin, dan bantu
              lingkungan sambil mendapatkan manfaat.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-block bg-eco-green text-white px-6 py-3 rounded-full font-semibold shadow hover:brightness-95"
              >
                Mulai Sekarang
              </Link>
              <a
                href="#how-it-works"
                className="inline-block px-6 py-3 rounded-full border border-white/70 text-white hover:bg-white/10"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-72 h-72 rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl text-eco-green">♻️</div>
                <div className="mt-2 text-sm text-white/85">
                  Ilustrasi Pilahin
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Unggulan */}
      <section id="how-it-works" className="bg-offwhite py-14">
        <div className="container mx-auto px-6 md:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary">
            Layanan Unggulan Kami
          </h2>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className="rounded-2xl border border-secondary/25 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-[#1B1B1B]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#1B1B1B]/80">
                    {service.desc}
                  </p>

                  <Link
                    href={service.href}
                    className="mt-6 inline-flex items-center rounded-full border border-secondary px-4 py-2 text-sm font-semibold text-secondary transition-colors duration-200 hover:bg-secondary hover:text-offwhite"
                  >
                    {service.cta}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Artikel Pilihan */}
      <section className="bg-offwhite py-16">
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-forest-emerald">
                Artikel Pilihan
              </h2>
              <p className="mt-2 text-slate-600">
                Wawasan seputar pengelolaan sampah dan operasional Pilahin.
              </p>
            </div>
            <Link
              href="/artikel"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-eco-green hover:underline"
            >
              Lihat Semua
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.length === 0 ? (
              <div className="md:col-span-3 rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                Belum ada artikel yang dipublikasikan admin.
              </div>
            ) : (
              featuredArticles.map((article) => (
                <article
                  key={article.title}
                  className="bg-white rounded-none border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-6">
                    <p className="text-xs tracking-wide text-slate-500 font-semibold">
                      {article.category}
                    </p>
                    <h3 className="mt-3 text-2xl leading-tight font-semibold text-[#1B1B1B]">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {article.desc}
                    </p>

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

          <div className="mt-6 md:hidden">
            <Link
              href="/artikel"
              className="inline-flex items-center gap-2 text-sm font-semibold text-eco-green hover:underline"
            >
              Lihat Semua
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Area Jangkauan */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-8">
          <h2 className="text-2xl font-bold text-forest-emerald">
            Area Jangkauan
          </h2>
          <p className="text-slate-600 mt-2">
            Kami telah melayani area berikut:
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {areas.map((a) => (
              <div
                key={a}
                className="bg-slate-100 rounded-lg p-3 text-sm text-slate-700"
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-gray">
        <div className="container mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4"
              >
                <div className="p-3 rounded-lg bg-eco-green/10 text-eco-green">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="text-sm text-slate-500">{s.label}</div>
                  <div className="text-2xl font-semibold text-forest-emerald">
                    <AnimatedStatValue value={s.value} suffix={s.suffix} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
