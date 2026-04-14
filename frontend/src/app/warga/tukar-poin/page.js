"use client"

import { useEffect, useState } from "react"
import { fetchMe } from "../../../lib/authApi"
import { apiClient, extractApiError } from "../../../lib/apiClient"

export default function TukarPoinPage() {
  const [balance, setBalance] = useState(0)
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState("")

  async function loadData() {
    try {
      const me = await fetchMe()
      setBalance(Number(me?.saldo_poin || 0))

      const { data } = await apiClient.get("/auth/me/points")
      setHistory(Array.isArray(data?.data) ? data.data : [])
    } catch (error) {
      setMessage(extractApiError(error, "Gagal mengambil data poin"))
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-6 bg-mint-soft">
      <header className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold text-forest-emerald">Saldo & Riwayat Poin</h1>
        <p className="text-sm text-slate-700">Penukaran hadiah akan diintegrasikan pada endpoint redeem berikutnya.</p>

        <div className="mt-4 flex items-center gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-slate-500">Saldo Poin Saat Ini</div>
            <div className="text-3xl font-bold text-forest-emerald">{balance}</div>
          </div>
        </div>

        {message && <div className="mt-3 p-3 rounded-md bg-red-100 text-red-700 text-sm">{message}</div>}
      </header>

      <main className="max-w-5xl mx-auto">
        <section>
          <h3 className="text-lg font-semibold mb-3 text-forest-emerald">Riwayat Poin</h3>
          <div className="bg-white rounded-lg shadow-sm p-3">
            {history.length === 0 ? (
              <div className="text-sm text-slate-500">Belum ada riwayat poin.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-600">
                    <th className="py-2">Tanggal</th>
                    <th className="py-2">Tipe</th>
                    <th className="py-2">Poin</th>
                    <th className="py-2">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="py-2">{new Date(item.created_at).toLocaleString("id-ID")}</td>
                      <td className="py-2">{item.tipe}</td>
                      <td className="py-2">{item.jumlah_poin}</td>
                      <td className="py-2">{item.keterangan || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
