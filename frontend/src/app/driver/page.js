"use client"

import { useState } from "react"
import { MapPin, ClipboardList, Scale, Coins, Activity, BarChart3 } from "lucide-react"
import { initialTasks } from "./initialTasks"

const trendWeightData = [
  { day: "Sen", kg: 2.4 },
  { day: "Sel", kg: 3.1 },
  { day: "Rab", kg: 1.8 },
  { day: "Kam", kg: 4.2 },
  { day: "Jum", kg: 3.6 },
]

const CARD_ICON_SIZE = 20

export default function DriverDashboard() {
  const [onDuty, setOnDuty] = useState(true)
  const [tasks, setTasks] = useState(initialTasks)
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [weight, setWeight] = useState("")
  const [category, setCategory] = useState("Organik")

  const totalDone = tasks.filter((t) => t.status === "done").length
  const totalTasks = tasks.length
  const totalWeightValue = tasks.reduce((s, t) => s + (t.weight || 0), 0)
  const totalWeight = totalWeightValue.toFixed(1)
  const totalPoints = Math.round(totalWeightValue * 12)
  const activeTasks = tasks.filter((t) => t.status === "on-process")
  const currentActiveTask = activeTasks[0] || null
  const maxTrendKg = Math.max(...trendWeightData.map((item) => item.kg), 1)

  const statCards = [
    {
      title: "Total Tugas",
      value: totalTasks,
      subtitle: `${totalDone} selesai hari ini`,
      icon: ClipboardList,
    },
    {
      title: "Berat Sampah",
      value: `${totalWeight} kg`,
      subtitle: "Akumulasi sampah terkumpul",
      icon: Scale,
    },
    {
      title: "Poin",
      value: totalPoints,
      subtitle: "Estimasi poin dari setoran",
      icon: Coins,
    },
  ]

  function toggleDuty() {
    setOnDuty((s) => !s)
  }

  function startPickup(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "on-process" } : t)))
  }

  function openFinish(task) {
    setSelected(task)
    setWeight("")
    setCategory("Organik")
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setSelected(null)
  }

  function confirmFinish() {
    const w = parseFloat(weight)
    if (isNaN(w) || w <= 0) {
      alert("Masukkan berat yang valid (kg)")
      return
    }
    setTasks((prev) => prev.map((t) => (t.id === selected.id ? { ...t, status: "done", weight: w, category } : t)))
    closeModal()
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-eco-green/20 bg-gradient-to-r from-mint-soft/60 to-white p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-forest-emerald">Tugas & Dashboard Driver</h1>
          <p className="text-sm text-slate-700">Ringkasan tugas penjemputan, progres aktif, dan tren berat sampah.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3 py-2 rounded-full font-semibold ${onDuty ? "bg-eco-green text-white" : "bg-slate-100 text-slate-800"}`}>
            {onDuty ? 'On-Duty' : 'Off-Duty'}
          </div>
          <button onClick={toggleDuty} className="px-3 py-2 rounded-md bg-white border border-eco-green/30 text-sm text-forest-emerald font-medium">
            Toggle
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <article key={card.title} className="rounded-xl border border-eco-green/40 bg-mint-soft p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-forest-emerald/80">{card.title}</p>
                  <p className="mt-1 text-2xl font-semibold text-forest-emerald">{card.value}</p>
                </div>
                <div className="rounded-lg border border-eco-green/30 bg-white/80 p-2 text-eco-green">
                  <Icon size={CARD_ICON_SIZE} />
                </div>
              </div>
              <p className="mt-3 text-xs text-forest-emerald/70">{card.subtitle}</p>
            </article>
          )
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <article className="xl:col-span-2 rounded-xl border border-eco-green/20 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-forest-emerald">
            <Activity size={CARD_ICON_SIZE} />
            <h2 className="text-base font-semibold">Tugas Aktif Saat Ini</h2>
          </div>

          {currentActiveTask ? (
            <div className="mt-4 rounded-lg border border-eco-green/30 bg-mint-soft p-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-eco-green [animation-duration:2s]" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-eco-green" />
                </span>
                <p className="font-medium text-forest-emerald">Sedang dalam proses</p>
              </div>
              <p className="mt-2 text-sm text-slate-700">{currentActiveTask.name} - {currentActiveTask.address}</p>
              <p className="text-xs text-slate-500">Catatan: {currentActiveTask.note}</p>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              Tidak ada tugas yang sedang berjalan saat ini.
            </div>
          )}
        </article>

        <article className="xl:col-span-3 rounded-xl border border-eco-green/20 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-forest-emerald">
            <BarChart3 size={CARD_ICON_SIZE} />
            <h2 className="text-base font-semibold">Tren Berat Sampah (5 Hari)</h2>
          </div>

          <div className="mt-5 flex h-48 items-end justify-between gap-3 rounded-lg border border-slate-100 bg-slate-gray/60 px-3 pb-3 pt-6">
            {trendWeightData.map((item) => {
              const barHeight = Math.max((item.kg / maxTrendKg) * 100, 12)
              return (
                <div key={item.day} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <div className="text-xs text-slate-500">{item.kg} kg</div>
                  <div className="w-full rounded-t-md bg-mint-soft/60 p-1">
                    <div
                      className="w-full rounded-t-md bg-eco-green"
                      style={{ height: `${barHeight}%`, minHeight: "12px" }}
                    />
                  </div>
                  <div className="text-xs font-medium text-slate-600">{item.day}</div>
                </div>
              )
            })}
          </div>
        </article>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Daftar Penjemputan</h2>
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li key={t.id} className="bg-white rounded-lg p-4 shadow-sm border border-eco-green/10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-md bg-forest-emerald/10 text-forest-emerald">
                      <MapPin size={CARD_ICON_SIZE} />
                    </div>
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${t.lat},${t.lng}`} target="_blank" rel="noreferrer" className="text-sm text-slate-500">{t.address}</a>
                      <div className="text-sm text-slate-400">{t.note}</div>
                      <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${t.status === "done" ? "bg-emerald-100 text-emerald-700" : t.status === "on-process" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-40 flex flex-col gap-3">
                  <button onClick={() => startPickup(t.id)} disabled={t.status !== 'pending'} className={`w-full py-3 text-lg rounded-md font-semibold ${t.status === 'pending' ? 'bg-forest-emerald text-white' : 'bg-slate-100 text-slate-600 cursor-not-allowed'}`}>
                    Mulai Jemput
                  </button>
                  <button onClick={() => openFinish(t)} disabled={t.status !== "on-process"} className={`w-full py-3 text-lg rounded-md font-semibold ${t.status === "on-process" ? "bg-eco-green text-white" : "bg-slate-100 text-slate-500 cursor-not-allowed"}`}>
                    Selesai
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Modal for finishing */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          <div className="relative w-full max-w-md bg-white rounded-t-xl md:rounded-xl p-6 m-4 shadow-lg z-60">
            <h3 className="text-lg font-semibold">Selesaikan Penjemputan</h3>
            <p className="text-sm text-slate-600 mt-1">Masukkan berat sampah dan kategori.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm">Berat (kg)</label>
                <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="Contoh: 3.5" />
              </div>

              <div>
                <label className="text-sm">Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md">
                  <option>Organik</option>
                  <option>Anorganik</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 rounded-md border">Batal</button>
              <button onClick={confirmFinish} className="px-4 py-2 rounded-md bg-eco-green text-white font-semibold">Simpan & Selesai</button>
            </div>
          </div>
        </div>
      )}
    </div>
    )
}
