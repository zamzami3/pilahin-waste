"use client"

import React from "react"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    id: "silver",
    name: "Silver",
    price: "Rp 25.000 / bln",
    pickups: "1x/minggu",
    weight: "hingga 10 kg/bulan",
    points: "Akses katalog poin",
    popular: false,
  },
  {
    id: "gold",
    name: "Gold",
    price: "Rp 50.000 / bln",
    pickups: "2x/minggu",
    weight: "hingga 25 kg/bulan",
    points: "Akses katalog poin + prioritas rute",
    popular: true,
  },
  {
    id: "emerald",
    name: "Emerald",
    price: "Rp 100.000 / bln",
    pickups: "Harian",
    weight: "hingga 100 kg/bulan",
    points: "Akses penuh + bonus poin",
    popular: false,
  },
]

export default function PricingSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 md:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B1B1B]">Paket Layanan</h2>
          <p className="mt-2 text-slate-600">Pilih paket yang sesuai dengan kebutuhan rumah tangga Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative bg-white rounded-2xl p-6 shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-lg border ${p.popular ? 'ring-2 ring-eco-green/10' : ''}`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="px-3 py-1 rounded-full text-sm font-semibold bg-mint-soft text-forest-emerald">Paling Populer</div>
                </div>
              )}

              <div className="flex flex-col items-start gap-4 h-full">
                <div>
                  <h3 className="text-xl font-semibold text-[#1B1B1B]">{p.name}</h3>
                  <div className="text-2xl font-bold text-forest-emerald mt-2">{p.price}</div>
                </div>

                <ul className="mt-4 space-y-3 flex-1">
                  <li className="flex items-start gap-3">
                    <span className="p-2 rounded-md bg-eco-green/10 text-eco-green">
                      <Check size={16} />
                    </span>
                    <div>
                      <div className="font-medium text-[#1B1B1B]">Jadwal Penjemputan</div>
                      <div className="text-sm text-slate-500">{p.pickups}</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="p-2 rounded-md bg-eco-green/10 text-eco-green">
                      <Check size={16} />
                    </span>
                    <div>
                      <div className="font-medium text-[#1B1B1B]">Batas Berat</div>
                      <div className="text-sm text-slate-500">{p.weight}</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="p-2 rounded-md bg-eco-green/10 text-eco-green">
                      <Check size={16} />
                    </span>
                    <div>
                      <div className="font-medium text-[#1B1B1B]">Poin & Hadiah</div>
                      <div className="text-sm text-slate-500">{p.points}</div>
                    </div>
                  </li>
                </ul>

                <div className="w-full mt-4">
                  {p.popular ? (
                    <Link href="/register" className="block text-center w-full px-4 py-3 rounded-md bg-eco-green text-white font-semibold">Pilih Paket</Link>
                  ) : (
                    <Link href="/register" className="block text-center w-full px-4 py-3 rounded-md border border-eco-green text-eco-green font-semibold hover:bg-eco-green hover:text-white transition">Pilih Paket</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
