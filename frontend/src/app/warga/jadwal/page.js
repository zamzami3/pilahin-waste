"use client"

import React, { useEffect, useState } from "react"
import { getCurrentUser } from "../../../lib/mockAuth"
import { Calendar } from "lucide-react"

const DAYS_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
const NAME_TO_INDEX = { Minggu: 0, Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, Sabtu: 6 }

function getPickupDaysFromUser(user) {
  if (!user) return ["Selasa", "Jumat"]
  if (Array.isArray(user.pickupDays) && user.pickupDays.length) return user.pickupDays
  if (user.paket) {
    const p = String(user.paket).toLowerCase()
    if (p.includes("premium")) return ["Senin", "Rabu", "Jumat"]
    if (p.includes("mingguan")) return ["Sabtu"]
  }
  return ["Selasa", "Jumat"]
}

function computeNextPickupDate(pickupDays) {
  const now = new Date()
  const todayIndex = now.getDay() // 0..6 (Sun..Sat)
  const indices = pickupDays.map((d) => NAME_TO_INDEX[d] ?? 0)
  let best = null
  for (const idx of indices) {
    let daysUntil = (idx - todayIndex + 7) % 7
    const candidate = new Date(now)
    candidate.setDate(now.getDate() + daysUntil)
    // assume pickup at 08:00
    candidate.setHours(8, 0, 0, 0)
    if (candidate <= now) {
      candidate.setDate(candidate.getDate() + 7)
    }
    if (!best || candidate < best) best = candidate
  }
  return best
}

function formatRelative(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d} hari lagi`
  if (h > 0) return `${h} jam lagi`
  if (m > 0) return `${m} menit lagi`
  return `Beberapa saat lagi`
}

export default function JadwalPage() {
  const [user, setUser] = useState(null)
  const [pickupDays, setPickupDays] = useState([])
  const [nextPickup, setNextPickup] = useState(null)
  const [timeLeft, setTimeLeft] = useState("")
  const [reminderEnabled, setReminderEnabled] = useState(false)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    const days = getPickupDaysFromUser(u)
    setPickupDays(days)
    const next = computeNextPickupDate(days)
    setNextPickup(next)

    if (u) {
      const key = `pilahin_whatsapp_reminder_${u.id}`
      const val = localStorage.getItem(key)
      setReminderEnabled(val === "true")
    }
  }, [])

  useEffect(() => {
    if (!nextPickup) return
    const tick = () => {
      const now = new Date()
      const diff = nextPickup - now
      if (diff <= 0) {
        setTimeLeft("Sedang berlangsung")
      } else {
        setTimeLeft(formatRelative(diff))
      }
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [nextPickup])

  function toggleReminder() {
    if (!user) return
    const key = `pilahin_whatsapp_reminder_${user.id}`
    const next = !reminderEnabled
    setReminderEnabled(next)
    localStorage.setItem(key, String(next))
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-mint-soft">
      <header className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold text-forest-emerald">Jadwal Penjemputan Saya</h1>
        <p className="text-sm text-slate-700">Lihat jadwal penjemputan berdasarkan paket langganan Anda.</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-eco-green" />
              <div>
                <div className="text-sm text-slate-500">Paket Langganan</div>
                <div className="font-semibold text-forest-emerald">{user?.paket ?? "Reguler"}</div>
                <div className="text-xs text-slate-500">Hari aktif: {pickupDays.join(", ")}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-slate-500">Penjemputan Berikutnya</div>
            <div className="mt-1">
              <div className="text-xl font-semibold text-forest-emerald">{nextPickup ? new Date(nextPickup).toLocaleString("id-ID", { weekday: "long", day: "numeric", month: "short" }) : "-"}</div>
              <div className="text-sm text-slate-600">{timeLeft}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Pengingat WhatsApp</div>
              <div className="text-sm text-slate-600">Aktifkan pengingat via Fonnte (UI saja)</div>
            </div>

            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={reminderEnabled} onChange={toggleReminder} />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer-checked:bg-eco-green peer-focus:ring-2 peer-focus:ring-eco-green/30 transition" />
              </label>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <section>
          <h2 className="text-lg font-semibold mb-3 text-forest-emerald">Minggu Ini</h2>
          <div className="grid grid-cols-7 gap-2 text-center">
            {DAYS_ORDER.map((day) => {
              const active = pickupDays.includes(day)
              return (
                <div key={day} className={`py-3 rounded-lg ${active ? "bg-eco-green text-white" : "bg-white text-slate-700"} shadow-sm`}>
                  <div className="font-medium">{day}</div>
                  {active && <div className="text-xs mt-1">Penjemputan</div>}
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
