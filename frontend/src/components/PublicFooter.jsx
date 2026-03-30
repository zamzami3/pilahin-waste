"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function PublicFooter() {
  const pathname = usePathname()

  // hide footer on internal app routes
  if (
    pathname?.startsWith('/warga') ||
    pathname?.startsWith('/driver') ||
    pathname?.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/register'
  ) return null

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-6 py-14 md:grid-cols-3 md:px-8 md:py-16">
        <div>
          <h4 className="text-xl font-bold text-forest-emerald">Pilahin</h4>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-slate-600">Solusi pengelolaan sampah yang menguntungkan masyarakat dan lingkungan.</p>
        </div>

        <div>
          <h4 className="text-lg font-bold text-forest-emerald">Navigasi</h4>
          <ul className="mt-4 space-y-2.5 text-base text-slate-600">
            <li><Link href="/" className="hover:text-eco-green">Beranda</Link></li>
            <li><Link href="/about" className="hover:text-eco-green">Tentang Kami</Link></li>
            <li><Link href="/paket" className="hover:text-eco-green">Paket Layanan</Link></li>
            <li><Link href="/coverage" className="hover:text-eco-green">Lokasi Jangkauan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold text-forest-emerald">Kontak</h4>
          <div className="mt-4 text-base text-slate-600">WhatsApp: <a href="#" className="font-semibold text-forest-emerald hover:text-eco-green">(0812) 3456-7890</a></div>
          <div className="mt-3 text-sm text-slate-500">Integrasi layanan WhatsApp akan terus disempurnakan.</div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6">
        <div className="container mx-auto px-6 text-center text-sm text-slate-500 md:px-8">© {new Date().getFullYear()} Pilahin — All rights reserved.</div>
      </div>
    </footer>
  )
}
