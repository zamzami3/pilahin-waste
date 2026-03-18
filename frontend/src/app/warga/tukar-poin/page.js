"use client"

import React, { useEffect, useState } from "react"
import { getCurrentUser, saveCurrentUser } from "../../../lib/mockAuth"

const gifts = [
  { id: "voucher", title: "Voucher Belanja", cost: 150, desc: "Diskon belanja di toko mitra" },
  { id: "pulsa", title: "Pulsa", cost: 100, desc: "Pulsa telepon seluler" },
  { id: "sembako", title: "Paket Sembako", cost: 250, desc: "Paket kebutuhan pokok" },
]

export default function TukarPoinPage() {
  const [user, setUser] = useState(null)
  const [balance, setBalance] = useState(0)
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const u = getCurrentUser()
    if (u) {
      setUser(u)
      setBalance(u.points ?? 0)
      const raw = localStorage.getItem(`pilahin_point_history_${u.id}`)
      setHistory(raw ? JSON.parse(raw) : [])
    } else {
      setUser(null)
      setBalance(0)
      setHistory([])
    }
  }, [])

  function saveHistoryForUser(uid, arr) {
    localStorage.setItem(`pilahin_point_history_${uid}`, JSON.stringify(arr))
  }

  function handleRedeem(gift) {
    if (!user) {
      setMessage({ type: "error", text: "Silakan login untuk menukar poin." })
      return
    }
    if (balance < gift.cost) {
      setMessage({ type: "error", text: "Poin tidak cukup untuk menukar hadiah ini." })
      return
    }

    const newBalance = balance - gift.cost
    const updatedUser = { ...user, points: newBalance }
    try {
      saveCurrentUser(updatedUser)
    } catch (e) {
      // fallback
      localStorage.setItem("pilahin_user", JSON.stringify(updatedUser))
    }
    setUser(updatedUser)
    setBalance(newBalance)

    const entry = { id: Date.now(), title: gift.title, cost: gift.cost, date: new Date().toISOString(), status: "Berhasil" }
    const newHistory = [entry, ...history]
    setHistory(newHistory)
    saveHistoryForUser(user.id, newHistory)

    setMessage({ type: "success", text: `Berhasil menukar ${gift.title} (-${gift.cost} poin)` })
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-mint-soft">
      <header className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold text-forest-emerald">Tukar Poin</h1>
        <p className="text-sm text-slate-700">Tukar poin Anda dengan hadiah menarik.</p>

        <div className="mt-4 flex items-center gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-slate-500">Saldo Poin Saat Ini</div>
            <div className="text-3xl font-bold text-forest-emerald">{balance}</div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {message && (
          <div className={`p-3 rounded-md mb-4 ${message.type === "success" ? "bg-eco-green/10 text-eco-green" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <section>
          <h2 className="text-lg font-semibold mb-3 text-forest-emerald">Katalog Hadiah</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gifts.map((g) => (
              <div key={g.id} className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-lg font-semibold text-forest-emerald">{g.title}</div>
                  <div className="text-sm text-slate-500 mt-1">{g.desc}</div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-slate-600">Butuh <span className="font-semibold">{g.cost} poin</span></div>
                  <button onClick={() => handleRedeem(g)} className="px-4 py-2 rounded-md bg-eco-green text-white font-semibold">Tukar</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-forest-emerald">Riwayat Penukaran</h3>
          <div className="bg-white rounded-lg shadow-sm p-3">
            {history.length === 0 ? (
              <div className="text-sm text-slate-500">Belum ada riwayat penukaran.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-600">
                    <th className="py-2">Tanggal</th>
                    <th className="py-2">Hadiah</th>
                    <th className="py-2">Poin</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-t">
                      <td className="py-2">{new Date(h.date).toLocaleString('id-ID')}</td>
                      <td className="py-2">{h.title}</td>
                      <td className="py-2">{h.cost}</td>
                      <td className="py-2">{h.status}</td>
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
