"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Gift, Truck, CreditCard, Calendar, Clock, Zap } from "lucide-react"
import { getCurrentUser, saveCurrentUser } from "../../lib/mockAuth"

const NAME_TO_INDEX = { Minggu: 0, Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, Sabtu: 6 }

function computeNextPickupDate(pickupDays = []) {
  if (!Array.isArray(pickupDays) || pickupDays.length === 0) return null
  const now = new Date()
  const todayIndex = now.getDay()
  const indices = pickupDays.map((d) => NAME_TO_INDEX[d]).filter((v) => Number.isInteger(v))
  if (indices.length === 0) return null
  let best = null
  for (const idx of indices) {
    const candidate = new Date(now)
    let daysUntil = (idx - todayIndex + 7) % 7
    candidate.setDate(now.getDate() + daysUntil)
    candidate.setHours(8, 0, 0, 0)
    if (candidate <= now) {
      candidate.setDate(candidate.getDate() + 7)
    }
    if (!best || candidate < best) best = candidate
  }
  return best
}

export default function WargaHome() {
  const [user, setUser] = useState(null)
  const [points, setPoints] = useState(0)
  const [savedKg, setSavedKg] = useState(0)
  const [subscriptionStatus, setSubscriptionStatus] = useState("Belum Berlangganan")
  const [subscriptionPackage, setSubscriptionPackage] = useState("-")

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    const userPoints = Number(u?.points ?? u?.saldo_poin ?? 0)
    setPoints(Number.isFinite(userPoints) ? userPoints : 0)

    if (u?.paket) {
      setSubscriptionPackage(u.paket)
      setSubscriptionStatus("Aktif")
    } else {
      setSubscriptionPackage("-")
      setSubscriptionStatus("Belum Berlangganan")
    }

    if (u?.id) {
      const rawReports = localStorage.getItem(`pilahin_reports_${u.id}`)
      if (rawReports) {
        try {
          const reports = JSON.parse(rawReports)
          const donePickup = Array.isArray(reports)
            ? reports.filter((r) => (r.type || "").toLowerCase().includes("penjemputan") && (r.status || "").toLowerCase() === "selesai")
            : []
          const totalKg = donePickup.reduce((acc, item) => acc + Number(item.kg || 0), 0)
          setSavedKg(Number.isFinite(totalKg) ? totalKg : 0)
        } catch (e) {
          setSavedKg(0)
        }
      }
    }
  }, [])

  const nextPickup = computeNextPickupDate(user?.pickupDays || [])
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (!nextPickup) {
      setTimeLeft(0)
      return
    }
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

  const [activities, setActivities] = useState([])

  useEffect(() => {
    if (!user?.id) {
      setActivities([])
      return
    }
    const rawReports = localStorage.getItem(`pilahin_reports_${user.id}`)
    if (!rawReports) {
      setActivities([])
      return
    }
    try {
      const reports = JSON.parse(rawReports)
      const mapped = Array.isArray(reports)
        ? reports.slice(0, 5).map((item) => ({
          id: item.id || Date.now(),
          date: new Date(item.date),
          kg: item.kg ?? null,
          type: item.type || item.jenis || "Laporan",
          status: item.status || "Diproses",
        }))
        : []
      setActivities(mapped)
    } catch (e) {
      setActivities([])
    }
  }, [user])

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
      const nextPoints = points - 100
      setPoints(nextPoints)
      if (user) {
        const updated = { ...user, points: nextPoints, saldo_poin: nextPoints }
        setUser(updated)
        saveCurrentUser(updated)
      }
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
              <p className="text-sm text-slate-500 mt-1">Jadwal penjemputan berikutnya berdasarkan pengajuan Anda.</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Tanggal</div>
              <div className="font-semibold text-forest-emerald">{nextPickup ? formatDate(nextPickup) : 'Belum ada jadwal'}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-forest-emerald/5 text-forest-emerald px-4 py-2 rounded-lg font-mono text-lg">
                {nextPickup
                  ? `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}j ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
                  : 'Belum terjadwal'}
              </div>
              <div className="text-sm text-slate-500">{nextPickup ? 'Estimasi waktu sampai penjemputan' : 'Ajukan jadwal jemput terlebih dahulu'}</div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={openReportModal} className="bg-eco-green text-white px-6 py-3 rounded-full text-base font-semibold shadow-md hover:brightness-95">Lapor Sampah Penuh</button>
              <Link href="/warga/jadwal" className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm text-forest-emerald hover:bg-slate-50"><Calendar size={16} className="inline mr-2" /> Ajukan Jadwal</Link>
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
              {activities.length === 0 ? (
                <tr className="border-t">
                  <td colSpan={4} className="py-4 text-sm text-slate-500">Belum ada aktivitas.</td>
                </tr>
              ) : (
                activities.map((a) => (
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
                ))
              )}
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
