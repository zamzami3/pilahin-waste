"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { getUsers } from "../../../lib/mockAuth"
import StyledSelect from "../../../components/StyledSelect"

const ROLE_OPTIONS = [
  { value: "all", label: "Semua Role" },
  { value: "admin", label: "Admin" },
  { value: "driver", label: "Driver" },
  { value: "warga", label: "Warga" },
]

function normalizeRole(role) {
  const safeRole = String(role || "warga").toLowerCase()
  if (safeRole === "admin") return "Admin"
  if (safeRole === "driver") return "Driver"
  return "Warga"
}

function getRoleBadgeClass(role) {
  const safeRole = String(role || "warga").toLowerCase()
  if (safeRole === "admin") return "bg-emerald-100 text-emerald-700"
  if (safeRole === "driver") return "bg-sky-100 text-sky-700"
  return "bg-amber-100 text-amber-700"
}

function getAccountStatus(user) {
  const rawStatus = String(
    user?.status || (user?.isSuspended ? "suspen" : "aktif")
  ).toLowerCase()

  if (rawStatus === "suspen" || rawStatus === "suspend" || rawStatus === "suspended") {
    return "Suspen"
  }
  return "Aktif"
}

function getStatusBadgeClass(status) {
  if (status === "Suspen") return "bg-red-100 text-red-700"
  return "bg-emerald-100 text-emerald-700"
}

function getWhatsApp(user) {
  return user?.phone || user?.wa || user?.whatsapp || user?.fonnte || "Belum diisi"
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    setUsers(getUsers())
  }, [])

  const filteredUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    return users.filter((user) => {
      const roleMatch = roleFilter === "all" || String(user.role || "").toLowerCase() === roleFilter
      const searchMatch =
        keyword.length === 0 ||
        String(user.name || "").toLowerCase().includes(keyword) ||
        String(user.email || "").toLowerCase().includes(keyword)

      return roleMatch && searchMatch
    })
  }, [users, query, roleFilter])

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen User</h1>
          <p className="text-sm text-slate-300 mt-1">
            Kelola akun pengguna Pilahin beserta role dan status aksesnya.
          </p>
        </div>

        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-md bg-eco-green px-4 py-2 text-sm font-semibold text-white hover:bg-forest-emerald transition-colors"
        >
          Tambah User Baru
        </Link>
      </header>

      <section className="bg-white rounded-xl shadow border border-slate-100 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Cari User (Nama / Email)</label>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ketik nama atau email..."
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-eco-green"
            />
          </div>

          <div>
            <StyledSelect
              label="Filter Role"
              value={roleFilter}
              onValueChange={setRoleFilter}
              options={ROLE_OPTIONS}
              placeholder="Pilih role"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
        <div className="max-h-[560px] overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 font-semibold">Nama</th>
                <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 font-semibold">Email</th>
                <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 font-semibold">No. WA (Fonnte)</th>
                <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 font-semibold">Role</th>
                <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 font-semibold">Status Akun</th>
                <th className="sticky top-0 z-10 bg-slate-50 px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    User tidak ditemukan untuk filter saat ini.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const accountStatus = getAccountStatus(user)
                  return (
                    <tr key={user.id} className="border-t border-slate-100 text-slate-700">
                      <td className="px-4 py-3 font-medium">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{getWhatsApp(user)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeClass(user.role)}`}>
                          {normalizeRole(user.role)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(accountStatus)}`}>
                          {accountStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="rounded-md bg-forest-emerald px-3 py-1.5 text-xs font-semibold text-white hover:bg-eco-green"
                          >
                            Reset Password
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}