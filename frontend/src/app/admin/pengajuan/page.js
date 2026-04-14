"use client"

import { useEffect, useMemo, useState } from "react"
import { apiClient, extractApiError } from "../../../lib/apiClient"

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]

function statusBadge(status) {
  if (status === "approved") return "bg-emerald-100 text-emerald-700"
  if (status === "rejected") return "bg-red-100 text-red-700"
  return "bg-amber-100 text-amber-700"
}

export default function AdminPengajuanPage() {
  const [rows, setRows] = useState([])
  const [drivers, setDrivers] = useState([])
  const [message, setMessage] = useState("")
  const [savingId, setSavingId] = useState(null)
  const [formState, setFormState] = useState({})

  async function loadRequests() {
    try {
      const { data } = await apiClient.get("/schedules/admin")
      setRows(Array.isArray(data?.data) ? data.data : [])
      setDrivers(Array.isArray(data?.drivers) ? data.drivers : [])
    } catch (error) {
      setMessage(extractApiError(error, "Gagal mengambil data pengajuan"))
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const dayLoad = useMemo(() => {
    const result = Object.fromEntries(DAYS.map((day) => [day, 0]))
    rows
      .filter((row) => row.approval_status === "approved")
      .forEach((row) => {
        const day = row.approved_day || row.requested_day
        result[day] = (result[day] || 0) + 1
      })
    return result
  }, [rows])

  function updateForm(id, patch) {
    setFormState((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        ...patch,
      },
    }))
  }

  async function submitDecision(row, approvalStatus) {
    const state = formState[row.id] || {}
    setSavingId(row.id)
    setMessage("")

    try {
      await apiClient.put(`/schedules/admin/${row.id}/decision`, {
        approval_status: approvalStatus,
        admin_note: state.admin_note || null,
        suggested_day: state.suggested_day || null,
        suggested_time: state.suggested_time || null,
        approved_day: state.approved_day || row.requested_day,
        approved_time: state.approved_time || row.requested_time,
        assigned_driver_id: state.assigned_driver_id || null,
      })

      setMessage("Keputusan admin berhasil disimpan.")
      await loadRequests()
    } catch (error) {
      setMessage(extractApiError(error, "Gagal menyimpan keputusan admin"))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Pengajuan Jadwal Warga</h1>
        <p className="text-sm text-slate-300 mt-1">Setujui atau tolak pengajuan agar jadwal driver tetap seimbang dan tidak overload.</p>
        {message && <div className="mt-3 rounded-md bg-white/90 px-3 py-2 text-sm text-forest-emerald">{message}</div>}
      </header>

      <section className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm mb-5">
        <h2 className="text-lg font-semibold text-forest-emerald">Ketersediaan Jadwal Mingguan</h2>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
          {DAYS.map((day) => (
            <div key={day} className="rounded-lg border border-slate-200 p-3">
              <div className="text-sm font-semibold text-forest-emerald">{day}</div>
              <div className="text-xs text-slate-500 mt-1">Terisi: {dayLoad[day] || 0}</div>
              <div className="text-xs text-slate-500">Kapasitas: {(dayLoad[day] || 0) >= 5 ? "Padat" : "Tersedia"}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {rows.length === 0 ? (
          <div className="bg-white rounded-xl p-6 border border-dashed border-slate-300 text-sm text-slate-500">Belum ada pengajuan jadwal.</div>
        ) : (
          rows.map((row) => {
            const state = formState[row.id] || {}
            const isSaving = savingId === row.id

            return (
              <article key={row.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-forest-emerald">{row.warga_nama}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusBadge(row.approval_status)}`}>{row.approval_status}</span>
                </div>

                <p className="mt-1 text-sm text-slate-600">Alamat: {row.warga_alamat || "-"}</p>
                <p className="text-sm text-slate-600">Permintaan: {row.requested_day} - {row.requested_time}</p>
                {row.catatan && <p className="text-sm text-slate-600">Catatan warga: {row.catatan}</p>}

                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Hari Disetujui</label>
                    <select
                      value={state.approved_day || row.requested_day}
                      onChange={(e) => updateForm(row.id, { approved_day: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    >
                      {DAYS.map((day) => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Jam Disetujui</label>
                    <input
                      type="time"
                      value={state.approved_time || row.requested_time}
                      onChange={(e) => updateForm(row.id, { approved_time: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Saran Hari (jika ditolak)</label>
                    <select
                      value={state.suggested_day || row.suggested_day || ""}
                      onChange={(e) => updateForm(row.id, { suggested_day: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">-</option>
                      {DAYS.map((day) => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Saran Jam (jika ditolak)</label>
                    <input
                      type="time"
                      value={state.suggested_time || row.suggested_time || ""}
                      onChange={(e) => updateForm(row.id, { suggested_time: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Assign Driver</label>
                    <select
                      value={state.assigned_driver_id || row.assigned_driver_id || ""}
                      onChange={(e) => updateForm(row.id, { assigned_driver_id: e.target.value ? Number(e.target.value) : null })}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value="">Belum ditentukan</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>{driver.nama}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Catatan Admin</label>
                    <input
                      type="text"
                      value={state.admin_note || row.admin_note || ""}
                      onChange={(e) => updateForm(row.id, { admin_note: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      placeholder="Contoh: slot pagi penuh, pilih jam 14:00"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => submitDecision(row, "approved")}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-md bg-eco-green text-white text-sm font-semibold disabled:opacity-60"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => submitDecision(row, "rejected")}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-md border border-red-300 text-red-700 text-sm font-semibold disabled:opacity-60"
                  >
                    Tolak + Beri Saran
                  </button>
                </div>
              </article>
            )
          })
        )}
      </section>
    </div>
  )
}
