"use client"

import { useState } from "react"
import { MapPin, Map, CheckCircle, Clock, X, ChevronRight } from "lucide-react"

const initialTasks = [
  {
    id: 1,
    address: "Jl. Merdeka No.12, Kecamatan A",
    note: "Sampah organik + plastik",
    lat: -6.200392,
    lng: 106.816048,
    status: "pending",
  },
  {
    id: 2,
    address: "Perumahan B, Blok C3",
    note: "Rumah tangga - Kode 22",
    lat: -6.201234,
    lng: 106.817123,
    status: "pending",
  },
  {
    id: 3,
    address: "Pasar Tradisional, Kios 5-6",
    note: "Sampah basah + kertas",
    lat: -6.202345,
    lng: 106.818234,
    status: "on-process",
  },
]

function statusLabel(s) {
  if (s === "pending") return "Pending"
  if (s === "on-process") return "On-Process"
  if (s === "done") return "Done"
  return s
}

function badgeClass(s) {
  if (s === "pending") return "bg-yellow-400 text-black"
  if (s === "on-process") return "bg-eco-green text-white"
  if (s === "done") return "bg-slate-800 text-white"
  return "bg-slate-300 text-black"
}

export default function DriverTasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [active, setActive] = useState(null)
  const [showWeightForm, setShowWeightForm] = useState(false)
  const [weight, setWeight] = useState(0)

  function openTask(task) {
    // mark on-process when opened (if pending)
    if (task.status === "pending") {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: "on-process" } : t)))
    }
    setActive(task)
    setShowWeightForm(false)
    setWeight(0)
  }

  function closeModal() {
    setActive(null)
    setShowWeightForm(false)
  }

  function openMap(task) {
    const dest = `${task.lat},${task.lng}`
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`
    window.open(url, "_blank")
  }

  function submitWeight() {
    if (!active) return
    const w = parseFloat(weight)
    if (isNaN(w) || w <= 0) {
      alert("Masukkan berat yang valid (kg)")
      return
    }

    setTasks((prev) => prev.map((t) => (t.id === active.id ? { ...t, status: "done", weight: w } : t)))
    setActive(null)
    setShowWeightForm(false)
    setWeight(0)
  }

  return (
    <div className="p-4 md:p-6 container mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black">Tugas Hari Ini</h1>
        <div className="text-sm text-slate-600">{tasks.filter((t) => t.status !== "done").length} tugas tersisa</div>
      </header>

      <ul className="mt-4 space-y-3">
        {tasks.map((t) => (
          <li
            key={t.id}
            onClick={() => openTask(t)}
            className="bg-white border border-slate-200 rounded-lg p-4 flex items-start justify-between gap-3 shadow-sm hover:shadow-md active:scale-[.997] transition-transform"
            role="button"
            aria-label={`Buka tugas ${t.address}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-forest-emerald/10 p-2 rounded-lg text-forest-emerald">
                <MapPin size={20} />
              </div>
              <div>
                <div className="font-medium text-black">{t.address}</div>
                <div className="text-sm text-slate-500 mt-1">{t.note}</div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${badgeClass(t.status)}`}>{statusLabel(t.status)}</span>
              <ChevronRight size={18} className="text-slate-400" />
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          <div className="relative w-full md:w-2/5 bg-white rounded-t-xl md:rounded-xl p-4 md:p-6 m-4 shadow-lg z-60">
            <button onClick={closeModal} className="absolute right-3 top-3 p-2 rounded text-slate-600 hover:bg-slate-100">
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <div className="bg-forest-emerald/10 text-forest-emerald p-3 rounded-lg">
                <MapPin size={22} />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-black">{active.address}</h2>
                <p className="text-sm text-slate-600 mt-1">{active.note}</p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-500" />
                    <div className="text-sm text-slate-500">Status: <span className="font-medium text-black">{statusLabel(active.status)}</span></div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <div className="text-sm text-slate-500">Koordinat:</div>
                    <div className="text-sm font-medium text-black">{active.lat.toFixed(6)}, {active.lng.toFixed(6)}</div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button onClick={() => openMap(active)} className="flex-1 bg-black text-white px-4 py-3 rounded-md font-semibold shadow">Buka Map</button>
                  <button onClick={() => setShowWeightForm((s) => !s)} className="flex-1 bg-eco-green text-white px-4 py-3 rounded-md font-semibold shadow">Selesaikan Tugas</button>
                </div>

                {showWeightForm && (
                  <div className="mt-4">
                    <label className="text-sm text-slate-600">Berat Sampah (kg)</label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full border border-slate-200 rounded-md px-3 py-2 text-black"
                        placeholder="Masukkan berat dalam kg"
                        min="0"
                        step="0.1"
                      />
                      <button onClick={submitWeight} className="bg-forest-emerald text-white px-4 py-2 rounded-md font-semibold">Kirim</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
