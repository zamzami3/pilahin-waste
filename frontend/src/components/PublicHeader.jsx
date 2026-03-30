"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X, LogIn } from "lucide-react"
import { getCurrentUser } from "../lib/mockAuth"
import { usePathname } from "next/navigation"

export default function PublicHeader() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const pathname = usePathname()

  useEffect(() => {
    // update on mount and when pathname changes (login/redirect)
    setUser(getCurrentUser())

    function onStorage(e) {
      if (e.key === 'pilahin_user') setUser(getCurrentUser())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [pathname])

  // hide public header on internal dashboard routes regardless of login state
  // this ensures public header only appears on public pages
  if (pathname?.startsWith('/warga') || pathname?.startsWith('/driver') || pathname?.startsWith('/admin')) return null

  const navItems = [
    { href: '/', label: 'Beranda', match: 'exact' },
    { href: '/about', label: 'Tentang Kami', match: 'prefix' },
    { href: '/paket', label: 'Paket Layanan', match: 'prefix' },
    { href: '/coverage', label: 'Lokasi Jangkauan', match: 'prefix' },
  ]

  function isActive(href, match) {
    if (!pathname) return false
    if (match === 'exact') return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-forest-emerald font-bold text-lg">Pilahin</Link>
            <nav className="hidden md:flex ml-8 space-x-6">
              {navItems.map((item) => {
                const active = isActive(item.href, item.match)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`text-sm transition-colors ${active ? 'font-semibold text-eco-green' : 'text-forest-emerald hover:text-eco-green'}`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-md text-forest-emerald hover:bg-forest-emerald/5">
                <LogIn size={16} />
                Masuk
              </Link>
              <Link href="/subscribe" className="bg-eco-green text-white px-4 py-2 rounded-full text-sm font-medium hover:brightness-95">
                Mulai Berlangganan
              </Link>
            </div>

            <button className="md:hidden p-2 rounded-md text-forest-emerald" onClick={() => setOpen(!open)} aria-label="menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.href, item.match)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${active ? 'bg-mint-soft font-semibold text-eco-green' : 'text-forest-emerald hover:bg-slate-50'}`}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="pt-2 border-t mt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2 rounded-md text-forest-emerald"><LogIn size={16}/> Masuk</Link>
              <Link href="/subscribe" className="bg-eco-green text-white px-4 py-2 rounded-full text-sm font-medium">Mulai Berlangganan</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
