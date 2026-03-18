"use client"

import { useEffect, useState } from "react"
import { MapPin, Navigation, CheckCircle2, Clock3, X, User, Camera } from "lucide-react"
import FilePicker from "../../../components/FilePicker"

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
    proofPhotoName: "",
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
    proofPhotoName: "",
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
    proofPhotoName: "",
  },
]

function statusLabel(s) {
  if (s === "pending") return "Pending"
  if (s === "on-process") return "On-Process"
  if (s === "done") return "Done"
  return s
}

function badgeClass(s) {
  if (s === "pending") return "bg-amber-100 text-amber-700 border border-amber-200"
  if (s === "on-process") return "bg-emerald-100 text-emerald-700 border border-emerald-200"
  if (s === "done") return "bg-slate-100 text-slate-700 border border-slate-200"
  return "bg-slate-100 text-slate-700 border border-slate-200"
}

export default function DriverTasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTask, setActiveTask] = useState(null)
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [weight, setWeight] = useState("")
  const [proofPhotoName, setProofPhotoName] = useState("")
  const [toastMessage, setToastMessage] = useState("")

  useEffect(() => {
    if (!toastMessage) return
    const id = window.setTimeout(() => setToastMessage(""), 2800)
    return () => window.clearTimeout(id)
  }, [toastMessage])

  const pendingCount = tasks.filter((task) => task.status === "pending").length
  const onProcessCount = tasks.filter((task) => task.status === "on-process").length

  function openMap(task) {
    const destination = `${task.lat},${task.lng}`
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
    window.open(mapUrl, "_blank", "noopener,noreferrer")
  }

  function startPickup(taskId) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "on-process",
            }
          : task
      )
    )
    setToastMessage("Penjemputan dimulai. Status tugas menjadi On-Process.")
  }

  function openFinishModal(task) {
    setActiveTask(task)
    setWeight(task.weight ? String(task.weight) : "")
    setProofPhotoName(task.proofPhotoName || "")
    setShowFinishModal(true)
  }

  function closeFinishModal() {
    setShowFinishModal(false)
    setActiveTask(null)
    setWeight("")
    setProofPhotoName("")
  }

  function completePickup() {
    if (!activeTask) return
    const w = parseFloat(weight)

    if (isNaN(w) || w <= 0) {
      alert("Masukkan berat yang valid (kg)")
      return
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === activeTask.id
          ? {
              ...task,
              status: "done",
              weight: w,
              proofPhotoName,
            }
          : task
      )
    )

    setToastMessage(`Tugas ${activeTask.name} selesai. Data berhasil disimpan.`)
    closeFinishModal()
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="rounded-2xl border border-eco-green/20 bg-gradient-to-r from-mint-soft/50 to-white p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-forest-emerald">Tugas Hari Ini</h1>
          <div className="text-sm text-slate-600">{pendingCount} Pending - {onProcessCount} On-Process</div>
        </div>
        <p className="mt-1 text-sm text-slate-600">Kelola penjemputan harian dan selesaikan tugas dengan bukti setoran.</p>
      </header>

      <section className="mt-5 grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <article key={task.id} className="rounded-xl border border-eco-green/15 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 rounded-lg bg-eco-green/10 p-2 text-eco-green">
                  <User size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-forest-emerald">{task.name}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="text-sm text-slate-600">{task.address}</p>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass(task.status)}`}>
                      {statusLabel(task.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{task.note}</p>
                  <p className="mt-1 text-xs text-slate-500">Lat/Lng: {task.lat.toFixed(6)}, {task.lng.toFixed(6)}</p>
                  {task.status === "done" && (
                    <p className="mt-1 text-xs text-emerald-700">Berat tercatat: {task.weight} kg{task.proofPhotoName ? ` - Bukti: ${task.proofPhotoName}` : ""}</p>
                  )}
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 md:w-56">
                <button
                  onClick={() => openMap(task)}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Navigation size={16} />
                  Buka Map
                </button>

                {task.status === "pending" && (
                  <button
                    onClick={() => startPickup(task.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-eco-green px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95"
                  >
                    <Clock3 size={16} />
                    Mulai Jemput
                  </button>
                )}

                {task.status === "on-process" && (
                  <button
                    onClick={() => openFinishModal(task)}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-eco-green px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95"
                  >
                    <CheckCircle2 size={16} />
                    Selesaikan
                  </button>
                )}

                {task.status === "done" && (
                  <div className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
                    <CheckCircle2 size={16} />
                    Tugas Selesai
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>

      {showFinishModal && activeTask && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <div className="absolute inset-0 bg-black/45" onClick={closeFinishModal} />
          <div className="relative z-[60] m-4 w-full max-w-xl rounded-t-xl bg-white p-5 shadow-xl md:rounded-xl md:p-6">
            <button
              onClick={closeFinishModal}
              className="absolute right-3 top-3 rounded p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Tutup modal"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-eco-green/10 p-2 text-eco-green">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-forest-emerald">Selesaikan Penjemputan</h3>
                <p className="text-sm text-slate-600">{activeTask.name} - {activeTask.address}</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-700">Berat Sampah (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-eco-green focus:outline-none"
                  placeholder="Contoh: 3.5"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-sm text-slate-700">
                  <Camera size={16} />
                  Upload/Pilih Foto Bukti (simulasi)
                </div>
                <FilePicker
                  label=""
                  accept="image/*"
                  onFileChange={(event) => {
                    const selectedFile = event?.target?.files?.[0]
                    setProofPhotoName(selectedFile ? selectedFile.name : "")
                  }}
                />
                <p className="mt-2 text-xs text-slate-500">Foto hanya simulasi untuk antarmuka dan tidak diunggah ke server.</p>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  onClick={closeFinishModal}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Batal
                </button>
                <button
                  onClick={completePickup}
                  className="rounded-md bg-eco-green px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
                >
                  Simpan & Selesaikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-[70] w-[calc(100%-2rem)] max-w-sm rounded-lg border border-emerald-200 bg-emerald-50 p-3 shadow-lg">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={18} className="mt-0.5 text-emerald-700" />
            <div>
              <p className="text-sm font-medium text-emerald-800">Sukses</p>
              <p className="text-sm text-emerald-700">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
