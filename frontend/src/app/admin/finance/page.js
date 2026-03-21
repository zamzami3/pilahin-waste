"use client"

import { useMemo } from "react"
import { DollarSign, FileText, Gift, Printer } from "lucide-react"

const TRANSACTION_LOGS = [
  {
    id: "TRX-240301",
    date: "2026-03-03",
    warga: "Ayu Lestari",
    paket: "Silver",
    amount: 45000,
    method: "VA BCA",
    status: "Berhasil",
  },
  {
    id: "TRX-240302",
    date: "2026-03-05",
    warga: "Rio Pratama",
    paket: "Gold",
    amount: 85000,
    method: "E-Wallet",
    status: "Berhasil",
  },
  {
    id: "TRX-240303",
    date: "2026-03-07",
    warga: "Nina Amalia",
    paket: "Emerald",
    amount: 150000,
    method: "Transfer Bank",
    status: "Berhasil",
  },
  {
    id: "TRX-240304",
    date: "2026-03-12",
    warga: "Dewi Maharani",
    paket: "Gold",
    amount: 85000,
    method: "VA Mandiri",
    status: "Berhasil",
  },
  {
    id: "TRX-240305",
    date: "2026-03-16",
    warga: "Bagas Wirawan",
    paket: "Silver",
    amount: 45000,
    method: "E-Wallet",
    status: "Berhasil",
  },
  {
    id: "TRX-240306",
    date: "2026-03-18",
    warga: "Salsa Putri",
    paket: "Emerald",
    amount: 150000,
    method: "Transfer Bank",
    status: "Berhasil",
  },
]

const REDEEMED_POINTS = [
  { warga: "Ayu Lestari", points: 900 },
  { warga: "Rio Pratama", points: 1200 },
  { warga: "Nina Amalia", points: 500 },
  { warga: "Dewi Maharani", points: 700 },
  { warga: "Bagas Wirawan", points: 1000 },
]

function rupiah(value) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`
}

export default function AdminFinancePage() {
  const successfulTransactions = useMemo(
    () => TRANSACTION_LOGS.filter((item) => item.status === "Berhasil"),
    []
  )

  const revenueByPackage = useMemo(() => {
    const breakdown = { Silver: 0, Gold: 0, Emerald: 0 }
    successfulTransactions.forEach((item) => {
      breakdown[item.paket] = (breakdown[item.paket] || 0) + item.amount
    })
    return breakdown
  }, [successfulTransactions])

  const totalRevenue = useMemo(
    () => Object.values(revenueByPackage).reduce((sum, value) => sum + value, 0),
    [revenueByPackage]
  )

  const totalRedeemedPoints = useMemo(
    () => REDEEMED_POINTS.reduce((sum, row) => sum + row.points, 0),
    []
  )

  const pointExpenseRupiah = useMemo(() => (totalRedeemedPoints / 100) * 1000, [totalRedeemedPoints])

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
          <p className="mt-1 text-sm text-slate-300">
            Ringkasan pendapatan langganan, biaya penukaran poin, dan log transaksi warga.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-eco-green px-4 py-2 text-sm font-semibold text-white hover:bg-forest-emerald"
          >
            <Printer size={16} />
            Cetak Laporan Keuangan
          </button>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow">PDF</span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow">Excel</span>
        </div>
      </header>

      <section className="mb-6 rounded-2xl border border-eco-green/20 bg-forest-emerald p-6 text-white shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-white/80">Revenue Summary - Bulan Ini</p>
            <h2 className="mt-2 text-4xl font-bold font-mono tabular-nums">{rupiah(totalRevenue)}</h2>
            <p className="mt-2 text-xs text-white/80">Akumulasi dari paket Silver, Gold, dan Emerald.</p>
          </div>

          <div className="rounded-xl bg-white/10 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-6">
                <span>Silver</span>
                <span className="font-semibold font-mono tabular-nums">{rupiah(revenueByPackage.Silver)}</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span>Gold</span>
                <span className="font-semibold font-mono tabular-nums">{rupiah(revenueByPackage.Gold)}</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span>Emerald</span>
                <span className="font-semibold font-mono tabular-nums">{rupiah(revenueByPackage.Emerald)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Point Expense (Estimasi)</p>
              <p className="mt-2 text-3xl font-bold text-forest-emerald font-mono tabular-nums">{rupiah(pointExpenseRupiah)}</p>
              <p className="mt-2 text-xs text-slate-500">Konversi: 100 poin = Rp 1.000</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-soft text-eco-green">
              <Gift size={18} />
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Transaksi Berhasil</p>
              <p className="mt-2 text-3xl font-bold text-forest-emerald font-mono tabular-nums">{successfulTransactions.length}</p>
              <p className="mt-2 text-xs text-slate-500">Periode bulan berjalan</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-soft text-eco-green">
              <DollarSign size={18} />
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-100 bg-white p-5 shadow">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-forest-emerald">
          <FileText size={18} />
          Log Transaksi Langganan
        </h2>

        <div className="overflow-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">ID Transaksi</th>
                <th className="px-4 py-3 font-semibold">Tanggal</th>
                <th className="px-4 py-3 font-semibold">Nama Warga</th>
                <th className="px-4 py-3 font-semibold">Paket</th>
                <th className="px-4 py-3 font-semibold">Metode</th>
                <th className="px-4 py-3 font-semibold">Nilai</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {successfulTransactions.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 text-slate-700">
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3">{new Date(item.date).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-3">{item.warga}</td>
                  <td className="px-4 py-3">{item.paket}</td>
                  <td className="px-4 py-3">{item.method}</td>
                  <td className="px-4 py-3 font-semibold text-forest-emerald font-mono tabular-nums">{rupiah(item.amount)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}