"use client"

import { useMemo, useState } from "react"
import { BarChart3, PieChart, TrendingUp, Home, Truck, MapPin } from "lucide-react"
import StyledSelect from "../../../components/StyledSelect"

const FILTER_OPTIONS = [
  { value: "7d", label: "7 Hari Terakhir" },
  { value: "30d", label: "30 Hari Terakhir" },
  { value: "year", label: "Tahunan" },
]

const EMPTY_ANALYTICS_DATA = {
  title: "Belum ada data",
  trend: [],
  wasteMix: { organik: 0, anorganik: 0 },
  metrics: {
    wargaGrowth: 0,
    avgWastePerHousehold: 0,
  },
  topDrivers: [],
  topAreas: [],
}

const ANALYTICS_DATA = {
  "7d": EMPTY_ANALYTICS_DATA,
  "30d": EMPTY_ANALYTICS_DATA,
  year: EMPTY_ANALYTICS_DATA,
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
  const hasTrendData = selectedData.trend.length > 0
  const maxTrendValue = useMemo(
    () => (hasTrendData ? Math.max(...selectedData.trend.map((item) => item.kg), 1) : 1),
    [selectedData]
  )

  const organicPercent = selectedData.wasteMix.organik
  const inorganicPercent = selectedData.wasteMix.anorganik
  const hasWasteMix = organicPercent + inorganicPercent > 0

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
            {hasTrendData ? (
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
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Belum ada data tren berat sampah.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border border-slate-100">
          <h2 className="text-lg font-semibold text-forest-emerald flex items-center gap-2 mb-4">
            <PieChart size={18} />
            Proporsi Jenis Sampah
          </h2>

          <div className="flex flex-col items-center justify-center">
            {hasWasteMix ? (
              <div
                className="h-44 w-44 rounded-full"
                style={{
                  background: `conic-gradient(#2D6A4F 0% ${organicPercent}%, #95D5B2 ${organicPercent}% 100%)`,
                }}
                aria-label="Pie chart proporsi sampah"
              />
            ) : (
              <div className="flex h-44 w-44 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500">Belum ada data</div>
            )}

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
            {selectedData.topDrivers.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">Belum ada data driver penjemputan.</div>
            ) : (
              selectedData.topDrivers.map((driver, index) => (
                <div key={driver.name} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-mint-soft text-forest-emerald text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-700">{driver.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-forest-emerald">{driver.pickups} penjemputan</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border border-slate-100">
          <h2 className="text-lg font-semibold text-forest-emerald flex items-center gap-2 mb-4">
            <MapPin size={18} />
            Top 5 Wilayah Terpadat
          </h2>
          <div className="space-y-3">
            {selectedData.topAreas.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500">Belum ada data wilayah terpadat.</div>
            ) : (
              selectedData.topAreas.map((area, index) => (
                <div key={area.name} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-mint-soft text-forest-emerald text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-700">{area.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-forest-emerald">{area.densityKg.toLocaleString("id-ID")} kg</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}