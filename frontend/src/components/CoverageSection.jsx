"use client"

import React, { useState } from "react"
import { MapPin } from "lucide-react"

const LOCATIONS = [
  { name: "Kecamatan A", postal: "10110" },
  { name: "Kecamatan B", postal: "10220" },
  { name: "Kecamatan C", postal: "10330" },
  { name: "Desa Menteng", postal: "10440" },
  { name: "Kecamatan Sukamaju", postal: "10550" },
  { name: "Desa Harapan", postal: "10660" },
  { name: "Kecamatan Baru", postal: "10770" },
  { name: "Desa Maju", postal: "10880" },
]

export default function CoverageSection() {
  const [zip, setZip] = useState("")
  const [result, setResult] = useState(null)

  function handleCheck(e) {
    e?.preventDefault()
    const code = zip.trim()
    if (!code) {
      setResult({ status: "error", text: "Masukkan kode pos Anda." })
      return
    }

    const found = LOCATIONS.find((l) => l.postal === code || l.postal.startsWith(code))
    if (found) setResult({ status: "ok", text: `Area tercover: ${found.name} (Kode pos ${found.postal})` })
    else setResult({ status: "no", text: "Maaf, area Anda belum tercover. Coba masukkan kode pos lain." })
  }

  return (
    <section className="py-12 bg-slate-gray">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B1B1B]">Area Penjemputan Kami</h2>
            <p className="text-sm text-slate-600 mt-1">Kami melayani beberapa kecamatan dan desa di area terjangkau.</p>
          </div>

          <form onSubmit={handleCheck} className="flex items-center gap-2">
            <input
              aria-label="Cek Kode Pos"
              placeholder="Cek Kode Pos Kamu"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="px-4 py-2 border rounded-md w-48"
            />
            <button onClick={handleCheck} className="px-4 py-2 rounded-md bg-eco-green text-white">Periksa</button>
          </form>
        </div>

        {result && (
          <div className={`mb-6 p-3 rounded-md ${result.status === 'ok' ? 'bg-eco-green/10 text-forest-emerald' : result.status === 'error' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-700'}`}>
            {result.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {LOCATIONS.map((loc) => (
            <div key={loc.postal} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="p-2 rounded-md bg-forest-emerald/10 text-forest-emerald">
                <MapPin size={18} />
              </div>
              <div>
                <div className="font-medium text-[#1B1B1B]">{loc.name}</div>
                <div className="text-sm text-slate-500">Kode Pos: {loc.postal}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
