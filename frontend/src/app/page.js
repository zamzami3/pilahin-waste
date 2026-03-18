import Link from "next/link"
import {
  User,
  Clipboard,
  Truck,
  Users,
  BarChart2,
  Gift,
  MessageSquare,
} from "lucide-react"

const stats = [
  { label: "Total Warga", value: "12.342", icon: Users },
  { label: "Sampah Terolah", value: "24.500 kg", icon: BarChart2 },
  { label: "Poin Terbagi", value: "48.900", icon: Gift },
]

const steps = [
  { title: "Daftar", desc: "Buat akun dan pilih paket langganan.", icon: User },
  { title: "Pilah", desc: "Pisahkan sampah organik & anorganik sesuai panduan.", icon: Clipboard },
  { title: "Jemput", desc: "Kurir kami menjemput sesuai jadwal Anda.", icon: Truck },
]

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
]

const areas = [
  "Kecamatan A",
  "Kecamatan B",
  "Kecamatan C",
  "Kecamatan D",
  "Kecamatan E",
]

export default function HomePage() {
  return (
    <main className="w-full">
      {/* Hero */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-forest-emerald">Kelola Sampah Jadi Berkah</h1>
            <p className="mt-4 text-lg text-slate-600">Gabung dengan komunitas Pilahin: pilah, tukar poin, dan bantu lingkungan sambil mendapatkan manfaat.</p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-block bg-eco-green text-white px-6 py-3 rounded-full font-semibold shadow hover:brightness-95">Mulai Sekarang</Link>
              <a href="#how-it-works" className="inline-block px-6 py-3 rounded-full border border-slate-200 text-forest-emerald">Pelajari Lebih Lanjut</a>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-72 h-72 rounded-2xl bg-forest-emerald/5 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl text-eco-green">♻️</div>
                <div className="mt-2 text-sm text-slate-500">Ilustrasi Pilahin</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-gray">
        <div className="container mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
                <div className="p-3 rounded-lg bg-eco-green/10 text-eco-green">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="text-sm text-slate-500">{s.label}</div>
                  <div className="text-2xl font-semibold text-forest-emerald">{s.value}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-6 md:px-8">
          <h2 className="text-2xl font-bold text-forest-emerald">Cara Kerjanya</h2>
          <p className="text-slate-600 mt-2">Langkah sederhana untuk mulai mendapatkan manfaat dari sampahmu.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st) => {
              const Icon = st.icon
              return (
                <div key={st.title} className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-forest-emerald/5 text-forest-emerald flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-semibold text-forest-emerald">{st.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{st.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-slate-gray">
        <div className="container mx-auto px-6 md:px-8">
          <h2 className="text-2xl font-bold text-forest-emerald">Paket Langganan</h2>
          <p className="text-slate-600 mt-2">Pilih paket yang sesuai dengan kebutuhan rumah tangga Anda.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-forest-emerald">{p.name}</h3>
                    <div className="text-sm text-slate-500 mt-1">{p.price}</div>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="text-sm text-slate-600">• {f}</li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Link href="/register" className="block text-center bg-eco-green text-white px-4 py-3 rounded-full font-semibold">Pilih {p.name}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Area Jangkauan */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-8">
          <h2 className="text-2xl font-bold text-forest-emerald">Area Jangkauan</h2>
          <p className="text-slate-600 mt-2">Kami telah melayani area berikut:</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {areas.map((a) => (
              <div key={a} className="bg-slate-100 rounded-lg p-3 text-sm text-slate-700">{a}</div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
