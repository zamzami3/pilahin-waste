import Link from 'next/link'

export default function PublicFooter() {
  return (
    <footer className="bg-slate-gray py-10">
      <div className="container mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold text-forest-emerald">Pilahin</h4>
          <p className="text-sm text-slate-600 mt-2">Solusi pengelolaan sampah yang menguntungkan masyarakat dan lingkungan.</p>
        </div>

        <div>
          <h4 className="font-semibold text-forest-emerald">Navigasi</h4>
          <ul className="mt-2 text-sm text-slate-600 space-y-1">
            <li><Link href="/">Beranda</Link></li>
            <li><Link href="/about">Tentang Kami</Link></li>
            <li><Link href="/paket">Paket Layanan</Link></li>
            <li><Link href="/coverage">Lokasi Jangkauan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-forest-emerald">Kontak</h4>
          <div className="mt-2 text-sm text-slate-600">WhatsApp: <a href="#" className="text-forest-emerald">(0812) 3456-7890</a></div>
          <div className="mt-2 text-xs text-slate-500">(Placeholder — integrasi Fonnte/WhatsApp menyusul)</div>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="container mx-auto px-6 md:px-8 text-sm text-slate-500">© {new Date().getFullYear()} Pilahin — All rights reserved.</div>
      </div>
    </footer>
  )
}
