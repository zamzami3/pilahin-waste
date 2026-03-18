"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Calendar,
  CreditCard,
  Gift,
  MessageSquare,
  Clipboard,
  Map,
  Clock,
  BarChart2,
  Users,
  Truck,
  DollarSign,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { logout } from "../lib/mockAuth"

export default function DashboardSidebar({ role = "warga" }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname() || "/"
  const router = useRouter()

  const menuMap = {
    warga: [
      { label: "Dashboard", href: "/warga", icon: Home },
      { label: "Jadwal Saya", href: "/warga/jadwal", icon: Calendar },
      { label: "Langganan", href: "/warga/langganan", icon: CreditCard },
      { label: "Tukar Poin", href: "/warga/tukar-poin", icon: Gift },
      { label: "Lapor Sampah", href: "/warga/lapor", icon: MessageSquare },
    ],
    driver: [
      { label: "Dashboard", href: "/driver", icon: Home },
      { label: "Tugas Hari Ini", href: "/driver/tasks", icon: Clipboard },
      { label: "Peta Rute", href: "/driver/map", icon: Map },
      { label: "Riwayat Kerja", href: "/driver/history", icon: Clock },
    ],
    admin: [
      { label: "Dashboard", href: "/admin", icon: Home },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
      { label: "Manajemen User", href: "/admin/users", icon: Users },
      { label: "Armada", href: "/admin/armada", icon: Truck },
      { label: "Keuangan", href: "/admin/keuangan", icon: DollarSign },
    ],
  }

  const items = menuMap[role] || []

  // Determine the most specific matching menu href for the current pathname.
  // This avoids marking parent items (like `/driver`) active when a more
  // specific child route (like `/driver/tasks`) is active.
  const activeHref = items.reduce((best, it) => {
    if (pathname === it.href || pathname.startsWith(it.href + "/")) {
      if (!best || it.href.length > best.length) return it.href
    }
    return best
  }, null)

  function handleLogout() {
    // clear mock auth and redirect to login
    try {
      logout()
    } catch (e) {
      // ignore
    }
    router.push("/login")
  }

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-md bg-white/90 text-forest-emerald shadow"
          aria-label="open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-forest-emerald text-white min-h-screen p-4 fixed left-0 top-0">
        <div className="mb-6 text-xl font-bold">Pilahin</div>

        <nav className="flex-1 space-y-1">
          {items.map((it) => {
            const Icon = it.icon
            const isActive = it.href === activeHref
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive ? "bg-eco-green text-white font-semibold" : "text-white/90 hover:bg-eco-green/10"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-white/90"} />
                <span>{it.label}</span>
              </Link>
            )
          })}
        </nav>

        <div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-eco-green/10">
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />

          <aside className="w-64 p-4 bg-forest-emerald text-white h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-bold">Pilahin</div>
              <button onClick={() => setOpen(false)} className="p-2 rounded text-white/90">
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-1">
              {items.map((it) => {
                const Icon = it.icon
                const isActive = it.href === activeHref
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive ? "bg-eco-green text-white font-semibold" : "text-white/90 hover:bg-eco-green/10"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <Icon size={18} className={isActive ? "text-white" : "text-white/90"} />
                    <span>{it.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-6">
              <button onClick={() => { setOpen(false); handleLogout() }} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-eco-green/10">
                <LogOut size={16} />
                Keluar
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
