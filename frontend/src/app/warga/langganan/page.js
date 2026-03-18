"use client"

import React, { useEffect, useState } from "react"
import PricingSection from "../../../components/PricingSection"
import { getCurrentUser, saveCurrentUser } from "../../../lib/mockAuth"

const planPrices = {
  Silver: 25000,
  Gold: 50000,
  Emerald: 100000,
  Reguler: 25000,
}

export default function LanggananPage() {
  const [user, setUser] = useState(null)
  const [expiry, setExpiry] = useState(null)
  const [payments, setPayments] = useState([])
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)

    if (u?.paketExpiry) setExpiry(new Date(u.paketExpiry))
    else {
      const d = new Date()
      d.setDate(d.getDate() + 30)
      setExpiry(d)
    }

    if (u) {
      const raw = localStorage.getItem(`pilahin_payments_${u.id}`)
      setPayments(raw ? JSON.parse(raw) : [])
    }
  }, [])

  function savePayments(arr) {
    if (!user) return
    localStorage.setItem(`pilahin_payments_${user.id}`, JSON.stringify(arr))
  }

  function perpanjang() {
    if (!user) {
      setMessage({ type: "error", text: "Silakan login terlebih dahulu." })
      return
    }
    const paket = user.paket || "Reguler"
    const amount = planPrices[paket] ?? planPrices.Reguler
    const record = { id: Date.now(), date: new Date().toISOString(), paket, amount, status: "Berhasil" }
    const newPayments = [record, ...payments]
    setPayments(newPayments)
    savePayments(newPayments)

    const newExpiry = expiry ? new Date(expiry) : new Date()
    newExpiry.setDate(newExpiry.getDate() + 30)
    setExpiry(newExpiry)

    const updatedUser = { ...(user || {}), paketExpiry: newExpiry.toISOString() }
    try {
      saveCurrentUser(updatedUser)
    } catch (e) {
      localStorage.setItem("pilahin_user", JSON.stringify(updatedUser))
    }
    setUser(updatedUser)

    setMessage({ type: "success", text: "Langganan berhasil diperpanjang." })
  }

  function changePaymentMethod() {
    setMessage({ type: "info", text: "Ubah metode pembayaran — fitur demo (UI)." })
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-mint-soft">
      <header className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold text-forest-emerald">Manajemen Langganan</h1>
        <p className="text-sm text-slate-700">Kelola paket dan riwayat pembayaran langganan Anda.</p>
      </header>

      <main className="max-w-5xl mx-auto space-y-6">
        {message && (
          <div className={`p-3 rounded-md ${message.type === "success" ? "bg-eco-green/10 text-eco-green" : message.type === "error" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-800"}`}>
            {message.text}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-sm text-slate-500">Paket Saat Ini</div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-forest-emerald">{user?.paket ?? "Reguler"}</div>
                <div className="text-sm text-slate-600 mt-1">Berlaku sampai: {expiry ? expiry.toLocaleDateString("id-ID") : "-"}</div>
                <div className="text-xs text-slate-500 mt-2">Fitur: Jadwal penjemputan, poin, dan batas berat sesuai paket.</div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={perpanjang} className="px-4 py-2 rounded-md bg-eco-green text-white font-semibold">Perpanjang Langganan</button>
              <button onClick={changePaymentMethod} className="px-4 py-2 rounded-md border border-eco-green text-eco-green font-semibold">Ubah Metode Pembayaran</button>
            </div>
          </div>

          <div className="md:col-span-2">
            <PricingSection />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-forest-emerald">Riwayat Pembayaran</h2>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            {payments.length === 0 ? (
              <div className="text-sm text-slate-500">Belum ada riwayat pembayaran.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-600">
                    <th className="py-2">Tanggal</th>
                    <th className="py-2">Paket</th>
                    <th className="py-2">Jumlah</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="py-2">{new Date(p.date).toLocaleString("id-ID")}</td>
                      <td className="py-2">{p.paket}</td>
                      <td className="py-2">Rp {Number(p.amount).toLocaleString("id-ID")}</td>
                      <td className="py-2">{p.status}</td>
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
