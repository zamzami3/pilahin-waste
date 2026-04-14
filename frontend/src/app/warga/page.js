"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Calendar, Gift, Truck } from "lucide-react"
import { fetchMe } from "../../lib/authApi"
import { apiClient, extractApiError } from "../../lib/apiClient"

export default function WargaHome() {
  const [user, setUser] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [pointHistory, setPointHistory] = useState([])
  const [error, setError] = useState("")

  async function loadData() {
    try {
      const me = await fetchMe()
      setUser(me)

      const [scheduleRes, pointRes] = await Promise.all([
        apiClient.get("/schedules/me"),
        apiClient.get("/auth/me/points"),
      ])

      setSchedules(Array.isArray(scheduleRes?.data?.data) ? scheduleRes.data.data : [])
      setPointHistory(Array.isArray(pointRes?.data?.data) ? pointRes.data.data : [])
    } catch (err) {
      setError(extractApiError(err, "Gagal memuat dashboard warga"))
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const nextApprovedSchedule = useMemo(() => {
    const approved = schedules.filter((item) => item.approval_status === "approved")
    if (approved.length === 0) return null
    return approved[0]
  }, [schedules])

  const pendingCount = useMemo(
    () => schedules.filter((item) => item.approval_status === "pending").length,
    [schedules]
  )

  return (
    <section className="p-6 container mx-auto space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-semibold">Selamat Datang, {user?.nama || "Warga Pilahin"}</h1>
        <p className="text-sm text-slate-600 mt-1">Pantau poin, jadwal disetujui admin, dan status penjemputan rumah Anda.</p>
        {error && <div className="mt-3 rounded-md bg-red-100 text-red-700 px-3 py-2 text-sm">{error}</div>}
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-eco-green/10 text-eco-green"><Gift size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Saldo Poin</p>
              <p className="text-2xl font-semibold text-forest-emerald">{Number(user?.saldo_poin || 0)}</p>
            </div>
          </div>
          <Link href="/warga/tukar-poin" className="mt-4 inline-flex text-sm text-eco-green font-semibold">Lihat riwayat poin</Link>
        </article>

        <article className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-forest-emerald/10 text-forest-emerald"><Calendar size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Pengajuan Pending</p>
              <p className="text-2xl font-semibold text-forest-emerald">{pendingCount}</p>
            </div>
          </div>
          <Link href="/warga/jadwal" className="mt-4 inline-flex text-sm text-eco-green font-semibold">Ajukan jadwal baru</Link>
        </article>

        <article className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-eco-green/10 text-eco-green"><Truck size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Jadwal Disetujui</p>
              <p className="text-base font-semibold text-forest-emerald">
                {nextApprovedSchedule
                  ? `${nextApprovedSchedule.approved_day || nextApprovedSchedule.requested_day} - ${nextApprovedSchedule.approved_time || nextApprovedSchedule.requested_time}`
                  : "Belum ada"}
              </p>
            </div>
          </div>
          {nextApprovedSchedule && (
            <p className="mt-3 text-sm text-slate-600">
              Status saat ini: <span className="font-semibold">{nextApprovedSchedule.pickup_status}</span>
            </p>
          )}
        </article>
      </section>

      <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold">Riwayat Poin Terakhir</h2>
        <p className="text-sm text-slate-500 mt-1">Poin bertambah otomatis setelah penjemputan driver selesai.</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500 border-b">
                <th className="py-2">Tanggal</th>
                <th className="py-2">Tipe</th>
                <th className="py-2">Poin</th>
                <th className="py-2">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {pointHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-slate-500">Belum ada riwayat poin.</td>
                </tr>
              ) : (
                pointHistory.slice(0, 8).map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">{new Date(item.created_at).toLocaleString("id-ID")}</td>
                    <td className="py-2">{item.tipe}</td>
                    <td className="py-2">{item.jumlah_poin}</td>
                    <td className="py-2">{item.keterangan || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
