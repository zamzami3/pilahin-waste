"use client"

import { useEffect, useState } from "react"
import { MapPin, Map, Clipboard, Truck, Home } from "lucide-react"

const initialTasks = [
  {
    id: 1,
    name: "Ibu Sari",
    address: "Jl. Merdeka No.12, Kecamatan A",
    note: "Sampah organik + plastik",
    lat: -6.200392,
    lng: 106.816048,
    status: "pending",
    weight: null,
    category: null,
  },
  {
    id: 2,
    name: "Bapak Anton",
    address: "Perumahan B, Blok C3",
    note: "Rumah tangga - Kode 22",
    lat: -6.201234,
    lng: 106.817123,
    status: "pending",
    weight: null,
    category: null,
  },
  {
    id: 3,
    name: "Bu Wati",
    address: "Pasar Tradisional, Kios 5-6",
    note: "Sampah basah + kertas",
    lat: -6.202345,
    lng: 106.818234,
    status: "on-process",
    weight: null,
    category: null,
  },
]

export default function DriverDashboard() {
  const [onDuty, setOnDuty] = useState(true)
  const [tasks, setTasks] = useState(initialTasks)
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [weight, setWeight] = useState("")
  const [category, setCategory] = useState("Organik")

  useEffect(() => {
    // could fetch real tasks here
  }, [])

  const totalDone = tasks.filter((t) => t.status === "done").length
  const totalWeight = tasks.reduce((s, t) => s + (t.weight || 0), 0).toFixed(1)

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
    <div className="p-4 md:p-6 container mx-auto">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Tugas & Dashboard</h1>
          <p className="text-sm text-slate-600">Ringkasan tugas dan penjemputan hari ini.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3 py-2 rounded-full font-semibold ${onDuty ? 'bg-eco-green text-white' : 'bg-slate-100 text-slate-800'}`}>
            {onDuty ? 'On-Duty' : 'Off-Duty'}
          </div>
          <button onClick={toggleDuty} className="px-3 py-2 rounded-md bg-white border text-sm">
            Toggle
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-slate-500">Total Penjemputan (Selesai)</div>
          <div className="text-2xl font-semibold text-forest-emerald">{totalDone}</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-slate-500">Total Berat Terkumpul (kg)</div>
          <div className="text-2xl font-semibold text-forest-emerald">{totalWeight} kg</div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Daftar Penjemputan</h2>
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li key={t.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-md bg-forest-emerald/10 text-forest-emerald">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${t.lat},${t.lng}`} target="_blank" rel="noreferrer" className="text-sm text-slate-500">{t.address}</a>
                      <div className="text-sm text-slate-400">{t.note}</div>
                    </div>
                  </div>
                </div>

                <div className="w-40 flex flex-col gap-3">
                  <button onClick={() => startPickup(t.id)} disabled={t.status !== 'pending'} className={`w-full py-3 text-lg rounded-md font-semibold ${t.status === 'pending' ? 'bg-forest-emerald text-white' : 'bg-slate-100 text-slate-600 cursor-not-allowed'}`}>
                    Mulai Jemput
                  </button>
                  <button onClick={() => openFinish(t)} className="w-full py-3 text-lg rounded-md bg-eco-green text-white font-semibold">Selesai</button>
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
