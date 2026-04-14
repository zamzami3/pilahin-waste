"use client"

import { useEffect, useState } from "react"
import { apiClient, extractApiError } from "../../../lib/apiClient"

export default function LaporPage() {
  const [jenis, setJenis] = useState("Organik")
  const [fotoUrl, setFotoUrl] = useState("")
  const [message, setMessage] = useState(null)
  const [pendingRows, setPendingRows] = useState([])

  async function loadMyPickups() {
    try {
      const { data } = await apiClient.get("/pickups")
      const rows = Array.isArray(data?.data) ? data.data : []
      setPendingRows(rows.filter((item) => item.status === "pending" || item.status === "on-process"))
    } catch (error) {
      setMessage({ type: "error", text: extractApiError(error, "Gagal mengambil laporan pickup") })
    }
  }

  useEffect(() => {
    loadMyPickups()
  }, [])

  async function submitLapor(event) {
    event.preventDefault()
    setMessage(null)

    try {
      await apiClient.post("/pickups/lapor", {
        jenis_sampah: jenis,
        foto_url: fotoUrl.trim() || null,
      })

      setFotoUrl("")
      setMessage({ type: "success", text: "Laporan berhasil dikirim. Menunggu driver mengambil tugas." })
      await loadMyPickups()
    } catch (error) {
      setMessage({ type: "error", text: extractApiError(error, "Gagal mengirim laporan pickup") })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-mint-soft">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-xl font-semibold text-forest-emerald">Lapor Pickup Sampah</h1>
        <p className="text-sm text-slate-600 mt-1">Data laporan masuk ke backend dan langsung tersedia untuk driver.</p>

        {message && (
          <div className={`mt-4 p-3 rounded ${message.type === "success" ? "bg-eco-green/10 text-eco-green" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={submitLapor} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-sm mt-2">Jenis Sampah</label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Organik">Organik</option>
              <option value="Anorganik">Anorganik</option>
              <option value="Campuran">Campuran</option>
            </select>

            <label className="block text-sm mt-2">URL Foto (opsional)</label>
            <input
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="https://..."
            />

            <div className="mt-4 flex gap-3">
              <button type="submit" className="px-4 py-2 rounded-md bg-eco-green text-white font-semibold">Kirim Laporan</button>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-forest-emerald">Status Laporan Aktif</h2>
            <div className="mt-3 bg-slate-50 rounded-md p-3 min-h-[180px]">
              {pendingRows.length === 0 ? (
                <div className="text-sm text-slate-500">Tidak ada laporan aktif.</div>
              ) : (
                <ul className="space-y-2">
                  {pendingRows.map((item) => (
                    <li key={item.id} className="p-3 bg-white rounded-md shadow-sm">
                      <div className="font-medium">{item.jenis_sampah || "-"}</div>
                      <div className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString("id-ID")}</div>
                      <div className="text-sm text-eco-green font-semibold mt-1">{item.status}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
