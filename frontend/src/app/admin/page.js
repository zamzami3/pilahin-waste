"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getUsers } from "../../lib/mockAuth"
import { BarChart2, Users, Truck, DollarSign, MapPin, Clock, RefreshCw } from "lucide-react"

export default function AdminHome() {
  const [users, setUsers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const u = getUsers()
    setUsers(u)
    const d = u.filter((x) => x.role === "driver")
    // augment drivers with mock status/area
    const dWithStatus = d.map((drv, i) => ({
      ...drv,
      status: i % 2 === 0 ? "on-route" : "idle",
      area: `Kecamatan ${String.fromCharCode(65 + (i % 4))}`,
      lastSeen: `${10 + i}m`
    }))
    setDrivers(dWithStatus)

    // mock new requests from warga
    setRequests([
      { id: 1001, address: "Jl. Merdeka No.12", type: "Sampah Organik", reportedAt: "2 jam lalu", status: "new" },
      { id: 1002, address: "Perumahan B, Blok C3", type: "Sampah Plastik", reportedAt: "1 jam lalu", status: "new" },
      { id: 1003, address: "Pasar Tradisional, Kios 5-6", type: "Sampah Basah", reportedAt: "30 menit lalu", status: "new" },
    ])
  }, [])

  const totalIncome = 12500000
  const totalResidents = users.filter((u) => u.role === "warga").length
  const driversOnDuty = drivers.filter((d) => d.status === "on-route").length
  const totalTrash = 3420 // kg (mock)

  function assignRequest(id) {
    const driver = drivers[0]
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "assigned", assignedTo: driver?.name || null } : r)))
  }

  function refreshFleet() {
    // simple client-side shuffle/status flip for demo
    setDrivers((prev) => prev.map((d) => ({ ...d, status: Math.random() > 0.4 ? "on-route" : "idle", lastSeen: Math.floor(Math.random() * 30) + "m" })))
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Command Center</h1>
        <p className="text-sm text-slate-600 mt-1">Ringkasan operasional, armada, dan permintaan terbaru.</p>
      </header>

      {/* Top metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-sm text-slate-500">Total Pemasukan</div>
          <div className="text-2xl font-semibold text-forest-emerald">Rp {totalIncome.toLocaleString('id-ID')}</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-sm text-slate-500">Total Warga Aktif</div>
          <div className="text-2xl font-semibold text-forest-emerald">{totalResidents}</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-sm text-slate-500">Driver Bertugas</div>
          <div className="text-2xl font-semibold text-forest-emerald">{driversOnDuty}</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow">
          <div className="text-sm text-slate-500">Total Sampah Seluruhnya (kg)</div>
          <div className="text-2xl font-semibold text-forest-emerald">{totalTrash} kg</div>
        </div>
      </section>

      {/* Main content */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Tren Volume Mingguan</h3>
            <div className="text-sm text-slate-500">(placeholder grafik)</div>
          </div>
          <div className="h-64 rounded-md bg-slate-100 flex items-center justify-center text-slate-400">Grafik volume mingguan (placeholder)</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Map / Fleet Monitor</h3>
            <button onClick={refreshFleet} className="text-sm px-3 py-1 rounded-md bg-eco-green text-white flex items-center gap-2"><RefreshCw size={14}/> Refresh</button>
          </div>

          <div className="space-y-3">
            {drivers.length === 0 && <div className="text-sm text-slate-500">Tidak ada driver terdaftar.</div>}
            {drivers.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-md border">
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-sm text-slate-500">{d.area} • terakhir {d.lastSeen}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${d.status === 'on-route' ? 'bg-eco-green text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {d.status === 'on-route' ? 'On-Route' : 'Idle'}
                  </div>
                  <Link href={`/admin/armada`} className="text-sm text-forest-emerald">Lihat</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New requests table */}
      <section className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">New Requests</h3>
          <div className="text-sm text-slate-500">Permintaan baru dari warga</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-slate-500">
                <th className="py-2">#</th>
                <th>Alamat</th>
                <th>Jenis</th>
                <th>Dilaporkan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-3 text-sm">{r.id}</td>
                  <td className="py-3">{r.address}</td>
                  <td className="py-3 text-sm text-slate-600">{r.type}</td>
                  <td className="py-3 text-sm text-slate-500">{r.reportedAt}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${r.status === 'new' ? 'bg-yellow-100 text-yellow-800' : r.status === 'assigned' ? 'bg-eco-green text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {r.status === 'new' ? (
                      <button onClick={() => assignRequest(r.id)} className="px-3 py-1 rounded-md bg-forest-emerald text-white text-sm">Assign</button>
                    ) : (
                      <div className="text-sm text-slate-500">{r.assignedTo ? `Assigned to ${r.assignedTo}` : r.status}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick links */}
      <section className="flex flex-wrap gap-3">
        <Link href="/admin/users" className="px-4 py-2 rounded-md bg-white shadow">Manajemen User</Link>
        <Link href="/admin/finance" className="px-4 py-2 rounded-md bg-white shadow">Laporan Keuangan</Link>
        <Link href="/admin/armada" className="px-4 py-2 rounded-md bg-white shadow">Manajemen Armada</Link>
        <Link href="/admin/settings" className="px-4 py-2 rounded-md bg-white shadow">Pengaturan API Token</Link>
      </section>
    </div>
  )
}
