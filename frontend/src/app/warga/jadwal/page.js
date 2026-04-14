"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays } from "lucide-react"
import { apiClient, extractApiError } from "../../../lib/apiClient"

const DAYS_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]

function statusBadge(status) {
  if (status === "approved") return "bg-emerald-100 text-emerald-700"
  if (status === "rejected") return "bg-red-100 text-red-700"
  return "bg-amber-100 text-amber-700"
}

function pickupBadge(status) {
  if (status === "done") return "bg-emerald-100 text-emerald-700"
  if (status === "otw") return "bg-sky-100 text-sky-700"
  return "bg-slate-100 text-slate-700"
}

export default function JadwalPage() {
  const [requestedDay, setRequestedDay] = useState("Senin")
  const [requestedTime, setRequestedTime] = useState("08:00")
  const [catatan, setCatatan] = useState("")
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState(null)

  async function loadMySchedules() {
    try {
      const { data } = await apiClient.get("/schedules/me")
      setRows(Array.isArray(data?.data) ? data.data : [])
    } catch (error) {
      setMessage({ type: "error", text: extractApiError(error, "Gagal mengambil data jadwal") })
    }
  }

  useEffect(() => {
    loadMySchedules()
  }, [])

  const approvedThisWeek = useMemo(
    () => rows.filter((row) => row.approval_status === "approved"),
    [rows]
  )

  async function submitSchedule(event) {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await apiClient.post("/schedules", {
        requested_day: requestedDay,
        requested_time: requestedTime,
        catatan: catatan.trim() || null,
      })

      setCatatan("")
      setMessage({ type: "success", text: "Pengajuan jadwal berhasil dikirim ke admin." })
      await loadMySchedules()
    } catch (error) {
      setMessage({ type: "error", text: extractApiError(error, "Pengajuan jadwal gagal dikirim") })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-mint-soft">
      <header className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold text-forest-emerald">Pengajuan Jadwal Penjemputan</h1>
        <p className="text-sm text-slate-700">Ajukan hari dan jam penjemputan. Admin akan menyetujui atau memberi saran jadwal baru bila overload.</p>

        {message && (
          <div className={`mt-3 p-3 rounded-md ${message.type === "success" ? "bg-eco-green/10 text-eco-green" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        <section className="bg-white rounded-xl p-5 shadow-sm border border-eco-green/15">
          <h2 className="text-lg font-semibold text-forest-emerald">Ajukan Jadwal Baru</h2>
          <form onSubmit={submitSchedule} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Hari</label>
              <select
                value={requestedDay}
                onChange={(e) => setRequestedDay(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              >
                {DAYS_ORDER.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Jam</label>
              <input
                type="time"
                value={requestedTime}
                onChange={(e) => setRequestedTime(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                required
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm text-slate-600 mb-1">Catatan (opsional)</label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                placeholder="Contoh: akses masuk lewat gang sebelah kiri"
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-md bg-eco-green text-white font-semibold disabled:opacity-60"
              >
                {loading ? "Menyimpan..." : "Ajukan Jadwal"}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-xl p-5 shadow-sm border border-eco-green/15">
          <h2 className="text-lg font-semibold text-forest-emerald">Jadwal Disetujui</h2>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {approvedThisWeek.length === 0 ? (
              <div className="text-sm text-slate-500">Belum ada jadwal yang disetujui admin.</div>
            ) : (
              approvedThisWeek.map((row) => (
                <div key={row.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-forest-emerald font-semibold">
                    <CalendarDays size={16} />
                    {row.approved_day} - {row.approved_time}
                  </div>
                  <div className="mt-2 text-sm text-slate-600">Status penjemputan: <span className={`px-2 py-0.5 rounded-full text-xs ${pickupBadge(row.pickup_status)}`}>{row.pickup_status}</span></div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl p-5 shadow-sm border border-eco-green/15">
          <h2 className="text-lg font-semibold text-forest-emerald">Riwayat Pengajuan</h2>
          <div className="mt-3 space-y-3">
            {rows.length === 0 ? (
              <div className="text-sm text-slate-500">Belum ada riwayat pengajuan jadwal.</div>
            ) : (
              rows.map((row) => (
                <article key={row.id} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-forest-emerald">{row.requested_day} - {row.requested_time}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge(row.approval_status)}`}>
                      {row.approval_status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${pickupBadge(row.pickup_status)}`}>
                      {row.pickup_status}
                    </span>
                  </div>

                  {row.approval_status === "approved" && (
                    <p className="mt-2 text-sm text-slate-700">
                      Jadwal disetujui admin pada {row.approved_day || row.requested_day} pukul {row.approved_time || row.requested_time}.
                    </p>
                  )}

                  {row.approval_status === "rejected" && (
                    <p className="mt-2 text-sm text-red-700">
                      Admin tidak menyetujui penjemputan pada hari ini karena overload.
                      {row.suggested_day && row.suggested_time
                        ? ` Jadwal Hari dan Waktu yang tersedia ada pada Hari ${row.suggested_day} Pukul ${row.suggested_time}.`
                        : " Silakan ajukan ulang jadwal lain."}
                    </p>
                  )}

                  {row.admin_note && (
                    <p className="mt-1 text-sm text-slate-600">Catatan Admin: {row.admin_note}</p>
                  )}

                  {row.catatan && (
                    <p className="mt-1 text-xs text-slate-500">Catatan Warga: {row.catatan}</p>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
