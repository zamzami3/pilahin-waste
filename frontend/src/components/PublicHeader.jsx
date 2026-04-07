"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
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
    <header className="sticky top-0 z-50 bg-primary/95 text-offwhite shadow-sm backdrop-blur supports-[backdrop-filter]:bg-primary/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-offwhite font-bold text-lg">
              <Image src="/logo.png" alt="Logo Pilahin" width={240} height={64} className="h-14 w-auto object-contain" priority />
            </Link>
            <nav className="hidden md:flex ml-8 space-x-6">
              {navItems.map((item) => {
                const active = isActive(item.href, item.match)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative px-0.5 pb-1 text-sm transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-highlight after:origin-center after:transition-transform after:duration-300 after:ease-out ${active ? 'font-semibold text-highlight after:scale-x-100' : 'text-offwhite/85 after:scale-x-0 hover:text-highlight hover:after:scale-x-100'}`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-md text-offwhite hover:bg-secondary/30">
                <LogIn size={16} className="text-highlight" />
                Masuk
              </Link>
              <Link href="/subscribe" className="bg-accent text-offwhite px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary">
                Mulai Berlangganan
              </Link>
            </div>

            <button className="md:hidden p-2 rounded-md text-offwhite hover:bg-secondary/30" onClick={() => setOpen(!open)} aria-label="menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-primary border-t border-secondary/50">
          <nav className="px-4 py-4 space-y-2">
            <Link href="/" onClick={() => setOpen(false)} className="mb-3 flex items-center text-offwhite font-bold text-base">
              <Image src="/logo.png" alt="Logo Pilahin" width={200} height={54} className="h-12 w-auto object-contain" priority />
            </Link>
            {navItems.map((item) => {
              const active = isActive(item.href, item.match)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`block rounded-md border-b-2 px-2 py-1.5 text-sm transition-all ${active ? 'border-highlight bg-accent font-semibold text-highlight' : 'border-transparent text-offwhite/90 hover:border-highlight/60 hover:bg-secondary/45 hover:text-highlight'}`}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-secondary/50 mt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2 rounded-md text-offwhite hover:bg-secondary/30"><LogIn size={16} className="text-highlight"/> Masuk</Link>
              <Link href="/subscribe" className="bg-accent text-offwhite px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary">Mulai Berlangganan</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
