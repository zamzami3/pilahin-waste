"use client"

import { useEffect, useState } from "react"
import { Gift, Truck, CreditCard, Calendar, Clock, Zap } from "lucide-react"
import { getCurrentUser } from "../../lib/mockAuth"

export default function WargaHome() {
  const [user, setUser] = useState(null)
  const [points, setPoints] = useState(120)
  const [savedKg, setSavedKg] = useState(75)
  const [subscriptionStatus] = useState("Aktif")
  const [subscriptionPackage] = useState("Paket Gold")

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
  }, [])

  // Next pickup: 3 days from now at 07:00
  const [timeLeft, setTimeLeft] = useState(0)
  const nextPickup = new Date()
  nextPickup.setDate(nextPickup.getDate() + 3)
  nextPickup.setHours(7, 0, 0, 0)

  useEffect(() => {
    function update() {
      const now = Date.now()
      const distance = nextPickup.getTime() - now
      setTimeLeft(distance > 0 ? distance : 0)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [nextPickup])

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60)
  const seconds = Math.floor((timeLeft / 1000) % 60)

  function formatDate(date) {
    return date.toLocaleString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Recent activity sample
  const [activities, setActivities] = useState([
    { id: 1, date: new Date('2026-03-10T07:00:00'), kg: 5.2, type: 'Penjemputan', status: 'Selesai' },
    { id: 2, date: new Date('2026-03-03T07:00:00'), kg: 4.1, type: 'Penjemputan', status: 'Selesai' },
    { id: 3, date: new Date('2026-02-24T07:00:00'), kg: 6.0, type: 'Penjemputan', status: 'Selesai' },
    { id: 4, date: new Date('2026-02-17T07:00:00'), kg: 3.5, type: 'Penjemputan', status: 'Selesai' },
    { id: 5, date: new Date('2026-02-10T07:00:00'), kg: 2.8, type: 'Penjemputan', status: 'Selesai' },
  ])

  const [showReportModal, setShowReportModal] = useState(false)
  const [reporting, setReporting] = useState(false)

  function openReportModal() {
    setShowReportModal(true)
  }

  function cancelReport() {
    setShowReportModal(false)
  }

  function confirmReport() {
    setReporting(true)
    // simulate creating a report entry
    const newActivity = {
      id: Date.now(),
      date: new Date(),
      kg: null,
      type: 'Laporan Penuh',
      status: 'Pending',
    }
    setActivities((prev) => [newActivity, ...prev].slice(0, 5))
    setReporting(false)
    setShowReportModal(false)
    alert('Laporan terkirim. Petugas akan diberitahu.')
  }

  // Simulated CO2 saving (example factor: 0.21 kgCO2 per kg)
  const co2Saved = (savedKg * 0.21).toFixed(1)

  function handleRedeem() {
    if (points >= 100) {
      setPoints((p) => p - 100)
      alert('Berhasil menukar hadiah! Poin -100')
    } else {
      alert('Poin tidak cukup untuk menukar hadiah (butuh 100).')
    }
  }

  return (
    <section className="p-6 container mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">Selamat Pagi, {user?.name || 'Budi'}</h1>
          <p className="text-sm text-slate-600 mt-1">Ringkasan akun dan kontribusi Anda.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-eco-green/10 text-eco-green font-medium">{subscriptionPackage} - {subscriptionStatus}</div>
        </div>
      </div>

      {/* Point & Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-eco-green/10 text-eco-green">
              <Gift size={20} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Saldo Poin</div>
              <div className="text-2xl font-semibold text-forest-emerald">{points}</div>
            </div>
          </div>

          <div className="mt-4">
            <button onClick={handleRedeem} className="w-full bg-eco-green text-white px-4 py-3 rounded-full font-semibold">Tukar Hadiah</button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-forest-emerald/10 text-forest-emerald">
              <Truck size={20} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Total Sampah Terpilah</div>
              <div className="text-2xl font-semibold text-forest-emerald">{savedKg} kg</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-eco-green/10 text-eco-green">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Kontribusi CO2 (estimasi)</div>
              <div className="text-2xl font-semibold text-forest-emerald">{co2Saved} kg CO₂</div>
            </div>
          </div>
        </div>
      </div>

      {/* Next pickup & Quick Action */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="col-span-1 md:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Penjemputan Berikutnya</h3>
              <p className="text-sm text-slate-500 mt-1">Jadwal penjemputan sampah Anda berikutnya.</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Tanggal</div>
              <div className="font-semibold text-forest-emerald">{formatDate(nextPickup)}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-forest-emerald/5 text-forest-emerald px-4 py-2 rounded-lg font-mono text-lg">
                {String(days).padStart(2, '0')}d {String(hours).padStart(2, '0')}j {String(minutes).padStart(2, '0')}m {String(seconds).padStart(2, '0')}s
              </div>
              <div className="text-sm text-slate-500">Estimasi waktu sampai penjemputan</div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={openReportModal} className="bg-eco-green text-white px-6 py-3 rounded-full text-base font-semibold shadow-md hover:brightness-95">Lapor Sampah Penuh</button>
              <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm text-forest-emerald hover:bg-slate-50"><Calendar size={16} className="inline mr-2" /> Lihat Kalender</button>
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Notifikasi</div>
                <div className="text-sm text-forest-emerald mt-1">Tidak ada notifikasi baru</div>
              </div>
              <Clock size={20} className="text-slate-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm text-sm text-slate-600">Tips: Pisahkan organik & anorganik untuk poin lebih tinggi.</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Aktivitas Terakhir</h3>
        <p className="text-sm text-slate-500 mt-1">5 transaksi/penjemputan terakhir Anda.</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-slate-500">
                <th className="py-2">Tanggal</th>
                <th className="py-2">Jenis</th>
                <th className="py-2">Berat (kg)</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="py-3 text-sm text-slate-600">{a.date.toLocaleDateString('id-ID')} {a.date.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</td>
                  <td className="py-3 text-sm text-slate-600">{a.type}</td>
                  <td className="py-3 text-sm text-slate-600">{a.kg ? `${a.kg} kg` : '-'}</td>
                  <td className="py-3 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs ${a.status === 'Selesai' ? 'bg-forest-emerald/80 text-white' : a.status === 'Pending' ? 'bg-yellow-400 text-black' : 'bg-slate-300 text-black'}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={cancelReport} />

          <div className="relative w-full max-w-md bg-white rounded-t-xl md:rounded-xl p-6 m-4 shadow-lg z-60">
            <h4 className="text-lg font-semibold">Konfirmasi Laporan</h4>
            <p className="text-sm text-slate-600 mt-2">Anda akan melaporkan tempat sampah penuh. Petugas akan diberitahu untuk penjemputan tambahan.</p>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={cancelReport} className="px-4 py-2 rounded-md border">Batal</button>
              <button onClick={confirmReport} className="px-4 py-2 rounded-md bg-eco-green text-white font-semibold">Kirim Laporan</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
