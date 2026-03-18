"use client"

import React from "react"
import { Home, Eye, Gift } from "lucide-react"

export default function AboutSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: image placeholder */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80"
              alt="Lingkungan bersih"
              className="w-full h-80 md:h-[460px] object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Right: text content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B1B1B] mb-4">Mengapa Pilahin?</h2>

            <p className="text-lg text-[#1B1B1B] leading-relaxed mb-6">
              Pilahin hadir untuk mendigitalisasi manajemen sampah agar proses penjemputan, pencatatan,
              dan pelaporan menjadi lebih terukur, efisien, dan ramah lingkungan. Dengan data yang
              tersimpan rapi, kita bisa memaksimalkan nilai dari sampah dan membuat kota lebih bersih.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-3 bg-forest-emerald/10 text-forest-emerald rounded-lg">
                  <Home size={20} />
                </div>
                <div>
                  <div className="font-semibold text-[#1B1B1B]">Praktis</div>
                  <div className="text-sm text-slate-500">Jemput di rumah</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-3 bg-forest-emerald/10 text-forest-emerald rounded-lg">
                  <Eye size={20} />
                </div>
                <div>
                  <div className="font-semibold text-[#1B1B1B]">Transparan</div>
                  <div className="text-sm text-slate-500">Berat sampah tercatat</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-3 bg-forest-emerald/10 text-forest-emerald rounded-lg">
                  <Gift size={20} />
                </div>
                <div>
                  <div className="font-semibold text-[#1B1B1B]">Bermanfaat</div>
                  <div className="text-sm text-slate-500">Sampah jadi poin</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
