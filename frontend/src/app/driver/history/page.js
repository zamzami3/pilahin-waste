"use client"

import { useMemo, useState } from "react"
import { Scale, Coins } from "lucide-react"
import { initialTasks } from "../initialTasks"

const POINTS_PER_KG = 12
const INCENTIVE_PER_POINT = 100

function toIsoDate(date) {
  return date.toISOString().slice(0, 10)
}

function dateDaysAgo(daysAgo) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - daysAgo)
  return toIsoDate(date)
}

function getWeekRange(date) {
  const current = new Date(date)
  current.setHours(0, 0, 0, 0)
  const day = current.getDay()
  const diffToMonday = day === 0 ? 6 : day - 1

  const start = new Date(current)
  start.setDate(current.getDate() - diffToMonday)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)

  return { start, end }
}

function formatDate(isoDate) {
  const date = new Date(isoDate)
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

function statusClassName(status) {
  if (status === "Done") return "bg-emerald-100 text-emerald-700 border border-emerald-200"
  if (status === "On-Process") return "bg-amber-100 text-amber-700 border border-amber-200"
  return "bg-slate-100 text-slate-700 border border-slate-200"
}

const historyLogSeed = [
  // Start empty for driver database testing.
]

export default function DriverHistoryPage() {
  const [search, setSearch] = useState("")

  const logs = useMemo(() => {
    return historyLogSeed
      .map((entry) => {
        const task = initialTasks[entry.taskIndex]
        return {
          id: entry.id,
          date: dateDaysAgo(entry.daysAgo),
          residentName: task?.name || "Warga",
          location: task?.address || "Alamat tidak tersedia",
          weight: entry.weight,
          status: entry.status,
        }
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [])

  const weekRange = useMemo(() => getWeekRange(new Date()), [])

  const weeklyDoneLogs = useMemo(() => {
    return logs.filter((log) => {
      if (log.status !== "Done") return false
      const logDate = new Date(log.date)
      return logDate >= weekRange.start && logDate <= weekRange.end
    })
  }, [logs, weekRange])

  const totalWeeklyWeight = weeklyDoneLogs.reduce((sum, log) => sum + log.weight, 0)
  const totalWeeklyPoints = Math.round(totalWeeklyWeight * POINTS_PER_KG)
  const totalWeeklyIncentive = totalWeeklyPoints * INCENTIVE_PER_POINT

  const filteredLogs = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return logs

    return logs.filter((log) => {
      const dateLabel = formatDate(log.date).toLowerCase()
      return (
        log.residentName.toLowerCase().includes(keyword) ||
        log.date.toLowerCase().includes(keyword) ||
        dateLabel.includes(keyword)
      )
    })
  }, [logs, search])

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-eco-green/20 bg-gradient-to-r from-mint-soft/60 to-white p-5">
        <h1 className="text-2xl font-semibold text-forest-emerald">Riwayat Kerja</h1>
        <p className="mt-1 text-sm text-slate-600">Rekap penjemputan dan performa kerja driver.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <article className="rounded-xl border border-eco-green/20 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Berat Minggu Ini</p>
              <p className="mt-1 text-2xl font-semibold text-forest-emerald">{totalWeeklyWeight.toFixed(1)} kg</p>
            </div>
            <div className="rounded-lg bg-mint-soft p-2 text-eco-green">
              <Scale size={18} />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-eco-green/20 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Poin / Insentif</p>
              <p className="mt-1 text-2xl font-semibold text-forest-emerald">{totalWeeklyPoints} poin</p>
              <p className="text-xs text-slate-500">Rp {new Intl.NumberFormat("id-ID").format(totalWeeklyIncentive)}</p>
            </div>
            <div className="rounded-lg bg-mint-soft p-2 text-eco-green">
              <Coins size={18} />
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-eco-green/20 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <label htmlFor="history-search" className="block text-sm font-medium text-slate-700">
            Cari Riwayat (nama warga atau tanggal)
          </label>
          <input
            id="history-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-eco-green"
            placeholder="Contoh: Ibu Sari atau 2026-03-19"
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-[680px] w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Tanggal</th>
                <th className="px-3 py-2 text-left font-semibold">Lokasi</th>
                <th className="px-3 py-2 text-left font-semibold">Berat (kg)</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr key={log.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-3 py-2 align-top text-slate-700">
                    <div>{formatDate(log.date)}</div>
                    <div className="text-xs text-slate-500">{log.date}</div>
                  </td>
                  <td className="px-3 py-2 align-top text-slate-700">
                    <div className="font-medium text-forest-emerald">{log.residentName}</div>
                    <div className="text-slate-600">{log.location}</div>
                  </td>
                  <td className="px-3 py-2 align-top text-slate-700">{log.weight > 0 ? log.weight.toFixed(1) : "-"}</td>
                  <td className="px-3 py-2 align-top">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClassName(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}

              {!filteredLogs.length && (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-sm text-slate-500">
                    Tidak ada data yang sesuai dengan kata kunci pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
