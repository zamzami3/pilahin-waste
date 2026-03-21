"use client"

import { useMemo, useState } from "react"
import { BarChart3, PieChart, TrendingUp, Home, Truck, MapPin } from "lucide-react"
import StyledSelect from "../../../components/StyledSelect"

const FILTER_OPTIONS = [
  { value: "7d", label: "7 Hari Terakhir" },
  { value: "30d", label: "30 Hari Terakhir" },
  { value: "year", label: "Tahunan" },
]

const ANALYTICS_DATA = {
  "7d": {
    title: "Performa 7 Hari",
    trend: [
      { label: "Sen", kg: 392 },
      { label: "Sel", kg: 418 },
      { label: "Rab", kg: 437 },
      { label: "Kam", kg: 463 },
      { label: "Jum", kg: 451 },
      { label: "Sab", kg: 478 },
      { label: "Min", kg: 442 },
    ],
    wasteMix: { organik: 64, anorganik: 36 },
    metrics: {
      wargaGrowth: 7.8,
      avgWastePerHousehold: 12.4,
    },
    topDrivers: [
      { name: "Andi Pratama", pickups: 68 },
      { name: "Rina Cahya", pickups: 64 },
      { name: "Budi Saputra", pickups: 59 },
      { name: "Dina Lestari", pickups: 54 },
      { name: "Fajar Nugroho", pickups: 49 },
    ],
    topAreas: [
      { name: "Kecamatan A", densityKg: 972 },
      { name: "Kecamatan C", densityKg: 903 },
      { name: "Kecamatan D", densityKg: 846 },
      { name: "Kecamatan B", densityKg: 818 },
      { name: "Kecamatan E", densityKg: 771 },
    ],
  },
  "30d": {
    title: "Performa 30 Hari",
    trend: [
      { label: "M1", kg: 2910 },
      { label: "M2", kg: 3048 },
      { label: "M3", kg: 3275 },
      { label: "M4", kg: 3182 },
      { label: "M5", kg: 3354 },
      { label: "M6", kg: 3461 },
      { label: "M7", kg: 3589 },
    ],
    wasteMix: { organik: 60, anorganik: 40 },
    metrics: {
      wargaGrowth: 10.6,
      avgWastePerHousehold: 13.1,
    },
    topDrivers: [
      { name: "Andi Pratama", pickups: 281 },
      { name: "Rina Cahya", pickups: 270 },
      { name: "Budi Saputra", pickups: 261 },
      { name: "Dina Lestari", pickups: 247 },
      { name: "Fajar Nugroho", pickups: 239 },
    ],
    topAreas: [
      { name: "Kecamatan A", densityKg: 6721 },
      { name: "Kecamatan C", densityKg: 6249 },
      { name: "Kecamatan D", densityKg: 5983 },
      { name: "Kecamatan B", densityKg: 5802 },
      { name: "Kecamatan E", densityKg: 5576 },
    ],
  },
  year: {
    title: "Performa Tahunan",
    trend: [
      { label: "Jan", kg: 12932 },
      { label: "Feb", kg: 13487 },
      { label: "Mar", kg: 14250 },
      { label: "Apr", kg: 14866 },
      { label: "Mei", kg: 15231 },
      { label: "Jun", kg: 15988 },
      { label: "Jul", kg: 16214 },
    ],
    wasteMix: { organik: 58, anorganik: 42 },
    metrics: {
      wargaGrowth: 16.2,
      avgWastePerHousehold: 14.6,
    },
    topDrivers: [
      { name: "Andi Pratama", pickups: 3234 },
      { name: "Rina Cahya", pickups: 3102 },
      { name: "Budi Saputra", pickups: 3001 },
      { name: "Dina Lestari", pickups: 2889 },
      { name: "Fajar Nugroho", pickups: 2764 },
    ],
    topAreas: [
      { name: "Kecamatan A", densityKg: 77844 },
      { name: "Kecamatan C", densityKg: 74198 },
      { name: "Kecamatan D", densityKg: 71635 },
      { name: "Kecamatan B", densityKg: 69583 },
      { name: "Kecamatan E", densityKg: 66829 },
    ],
  },
}

function MetricsCard({ icon: Icon, label, value, note }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 border border-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-forest-emerald mt-1">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{note}</p>
        </div>
        <span className="h-10 w-10 rounded-full bg-mint-soft flex items-center justify-center text-eco-green">
          <Icon size={18} />
        </span>
      </div>
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState("7d")

  const selectedData = ANALYTICS_DATA[timeFilter]
  const maxTrendValue = useMemo(
    () => Math.max(...selectedData.trend.map((item) => item.kg)),
    [selectedData]
  )

  const organicPercent = selectedData.wasteMix.organik
  const inorganicPercent = selectedData.wasteMix.anorganik

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics &amp; Laporan</h1>
          <p className="text-sm text-slate-300 mt-1">
            Pantau performa pengelolaan sampah, pertumbuhan warga, dan area prioritas operasional.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow px-4 py-3 min-w-[220px]">
          <StyledSelect
            label="Filter Waktu"
            value={timeFilter}
            onValueChange={setTimeFilter}
            options={FILTER_OPTIONS}
            placeholder="Pilih filter"
          />
          <p className="text-xs text-slate-400 mt-2">Dataset aktif: {selectedData.title}</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <MetricsCard
          icon={TrendingUp}
          label="Pertumbuhan Warga Baru"
          value={`${selectedData.metrics.wargaGrowth}%`}
          note="Dibanding periode sebelumnya"
        />
        <MetricsCard
          icon={Home}
          label="Rata-rata Berat Sampah / Rumah"
          value={`${selectedData.metrics.avgWastePerHousehold} kg`}
          note="Rata-rata per rumah tangga aktif"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white rounded-xl shadow p-5 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-forest-emerald flex items-center gap-2">
              <BarChart3 size={18} />
              Tren Berat Sampah (kg)
            </h2>
            <span className="text-xs text-slate-400">Visual mingguan</span>
          </div>

          <div className="h-72 rounded-lg border border-slate-100 bg-slate-50 p-4">
            <div className="h-full flex items-end justify-between gap-2">
              {selectedData.trend.map((point) => {
                const barHeight = Math.max(10, Math.round((point.kg / maxTrendValue) * 100))
                return (
                  <div key={point.label} className="h-full flex-1 flex flex-col justify-end items-center gap-2">
                    <span className="text-[11px] text-slate-500">{point.kg.toLocaleString("id-ID")}</span>
                    <div
                      className="w-full max-w-[56px] rounded-t-md"
                      style={{
                        height: `${barHeight}%`,
                        backgroundColor: "#2D6A4F",
                      }}
                    />
                    <span className="text-xs text-slate-600 font-medium">{point.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border border-slate-100">
          <h2 className="text-lg font-semibold text-forest-emerald flex items-center gap-2 mb-4">
            <PieChart size={18} />
            Proporsi Jenis Sampah
          </h2>

          <div className="flex flex-col items-center justify-center">
            <div
              className="h-44 w-44 rounded-full"
              style={{
                background: `conic-gradient(#2D6A4F 0% ${organicPercent}%, #95D5B2 ${organicPercent}% 100%)`,
              }}
              aria-label="Pie chart proporsi sampah"
            />

            <div className="w-full mt-5 space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="h-3 w-3 rounded-full bg-eco-green" /> Organik
                </span>
                <span className="font-semibold text-forest-emerald">{organicPercent}%</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="h-3 w-3 rounded-full bg-[#95D5B2]" /> Anorganik
                </span>
                <span className="font-semibold text-forest-emerald">{inorganicPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5 border border-slate-100">
          <h2 className="text-lg font-semibold text-forest-emerald flex items-center gap-2 mb-4">
            <Truck size={18} />
            Top 5 Driver Penjemputan
          </h2>
          <div className="space-y-3">
            {selectedData.topDrivers.map((driver, index) => (
              <div key={driver.name} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-mint-soft text-forest-emerald text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-medium text-slate-700">{driver.name}</span>
                </div>
                <span className="text-sm font-semibold text-forest-emerald">{driver.pickups} penjemputan</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border border-slate-100">
          <h2 className="text-lg font-semibold text-forest-emerald flex items-center gap-2 mb-4">
            <MapPin size={18} />
            Top 5 Wilayah Terpadat
          </h2>
          <div className="space-y-3">
            {selectedData.topAreas.map((area, index) => (
              <div key={area.name} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-mint-soft text-forest-emerald text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-medium text-slate-700">{area.name}</span>
                </div>
                <span className="text-sm font-semibold text-forest-emerald">{area.densityKg.toLocaleString("id-ID")} kg</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}