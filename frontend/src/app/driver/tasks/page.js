"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, Clock3, MapPin, Navigation, X } from "lucide-react"
import { apiClient, extractApiError } from "../../../lib/apiClient"

function statusBadge(status) {
  if (status === "done") return "bg-emerald-100 text-emerald-700"
  if (status === "otw") return "bg-sky-100 text-sky-700"
  return "bg-amber-100 text-amber-700"
}

export default function DriverTasksPage() {
  const [tasks, setTasks] = useState([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [modalTask, setModalTask] = useState(null)
  const [weight, setWeight] = useState("")

  async function loadTasks() {
    try {
      const { data } = await apiClient.get("/schedules/driver/week")
      setTasks(Array.isArray(data?.data) ? data.data : [])
    } catch (error) {
      setMessage(extractApiError(error, "Gagal mengambil tugas minggu ini"))
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const pendingCount = useMemo(() => tasks.filter((task) => task.pickup_status === "pending").length, [tasks])
  const otwCount = useMemo(() => tasks.filter((task) => task.pickup_status === "otw").length, [tasks])

  async function setTaskStatus(taskId, pickupStatus, payload = {}) {
    setLoading(true)
    try {
      await apiClient.put(`/schedules/driver/${taskId}/status`, {
        pickup_status: pickupStatus,
        ...payload,
      })
      setMessage(pickupStatus === "otw" ? "Status tugas diperbarui ke Otw." : "Tugas selesai dan poin warga diperbarui.")
      await loadTasks()
    } catch (error) {
      setMessage(extractApiError(error, "Gagal memperbarui status tugas"))
    } finally {
      setLoading(false)
    }
  }

  function openMap(task) {
    const query = encodeURIComponent(task.warga_alamat || task.warga_nama || "")
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`
    window.open(mapUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="rounded-2xl border border-eco-green/20 bg-white p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-forest-emerald">Tugas Minggu Ini</h1>
          <div className="text-sm text-slate-600">{pendingCount} Pending - {otwCount} Otw</div>
        </div>
        <p className="mt-1 text-sm text-slate-600">Driver hanya bisa menandai Otw satu rumah dalam satu waktu. Selesaikan tugas sebelumnya sebelum lanjut.</p>
        {message && <div className="mt-3 rounded-md bg-eco-green/10 text-eco-green px-3 py-2 text-sm">{message}</div>}
      </header>

      <section className="mt-5 grid grid-cols-1 gap-4">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
            Belum ada penugasan minggu ini.
          </div>
        ) : (
          tasks.map((task) => (
            <article key={task.id} className="rounded-xl border border-eco-green/15 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-forest-emerald">{task.warga_nama}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span>{task.approved_day || task.requested_day}</span>
                    <span>-</span>
                    <span>{task.approved_time || task.requested_time}</span>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(task.pickup_status)}`}>
                      {task.pickup_status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{task.warga_alamat || "Alamat belum tersedia"}</p>
                  {task.catatan && <p className="mt-1 text-xs text-slate-500">Catatan warga: {task.catatan}</p>}
                  {task.pickup_status === "done" && (
                    <p className="mt-1 text-xs text-emerald-700">
                      Selesai - berat: {Number(task.weight_kg || 0) > 0 ? `${task.weight_kg} kg` : "default"}, poin: {task.earned_points}
                    </p>
                  )}
                </div>

                <div className="flex w-full flex-col gap-2 md:w-56">
                  <button
                    onClick={() => openMap(task)}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Navigation size={16} />
                    Buka Map
                  </button>

                  {task.pickup_status === "pending" && (
                    <button
                      onClick={() => setTaskStatus(task.id, "otw")}
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-eco-green px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      <Clock3 size={16} />
                      Tandai Otw
                    </button>
                  )}

                  {task.pickup_status === "otw" && (
                    <button
                      onClick={() => {
                        setModalTask(task)
                        setWeight("")
                      }}
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-eco-green px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      <CheckCircle2 size={16} />
                      Selesaikan
                    </button>
                  )}

                  {task.pickup_status === "done" && (
                    <div className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
                      <CheckCircle2 size={16} />
                      Tugas Selesai
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {modalTask && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <div className="absolute inset-0 bg-black/45" onClick={() => setModalTask(null)} />
          <div className="relative z-[60] m-4 w-full max-w-lg rounded-t-xl bg-white p-5 shadow-xl md:rounded-xl md:p-6">
            <button
              onClick={() => setModalTask(null)}
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
                <p className="text-sm text-slate-600">{modalTask.warga_nama} - {modalTask.warga_alamat || "Alamat belum tersedia"}</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-700">Berat Sampah (kg) - opsional</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800 focus:border-eco-green focus:outline-none"
                  placeholder="Kosongkan untuk poin default 2"
                  min="0"
                  step="0.1"
                />
                <p className="mt-1 text-xs text-slate-500">Jika berat diisi, poin = berat x 3. Jika kosong, poin default = 2.</p>
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setModalTask(null)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const parsed = Number(weight)
                    const payload = Number.isFinite(parsed) && parsed > 0 ? { weight_kg: parsed } : {}
                    setTaskStatus(modalTask.id, "done", payload)
                    setModalTask(null)
                  }}
                  className="rounded-md bg-eco-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  disabled={loading}
                >
                  Simpan & Selesaikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
