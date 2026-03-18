"use client"

import React, { useEffect, useState } from "react"
import { getCurrentUser } from "../../../lib/mockAuth"
import StyledSelect from "../../../components/StyledSelect"
import FilePicker from "../../../components/FilePicker"

export default function LaporPage() {
  const [user, setUser] = useState(null)
  const [jenis, setJenis] = useState("Organik")
  const [volume, setVolume] = useState("Kecil")
  const [notes, setNotes] = useState("")
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [reports, setReports] = useState([])
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const u = getCurrentUser()
    setUser(u)
    if (u) {
      const raw = localStorage.getItem(`pilahin_reports_${u.id}`)
      setReports(raw ? JSON.parse(raw) : [])
    }
  }, [])

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0]
    setPhotoFile(f)
    if (f) {
      try {
        const url = URL.createObjectURL(f)
        setPhotoPreview(url)
      } catch (e) {
        setPhotoPreview(null)
      }
    } else setPhotoPreview(null)
  }

  function saveReportsForUser(uid, arr) {
    localStorage.setItem(`pilahin_reports_${uid}`, JSON.stringify(arr))
  }

  function simulateFonnteNotification(payload) {
    // simple localStorage queue to simulate Fonnte
    const raw = localStorage.getItem('pilahin_fonnte_notifications')
    const arr = raw ? JSON.parse(raw) : []
    arr.unshift(payload)
    localStorage.setItem('pilahin_fonnte_notifications', JSON.stringify(arr))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!user) {
      setMessage({ type: 'error', text: 'Silakan login terlebih dahulu.' })
      return
    }

    const locationText = user.address || user.alamat || 'Alamat tidak tersedia'

    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      jenis,
      volume,
      notes,
      location: locationText,
      photoName: photoFile ? photoFile.name : null,
      status: 'Diproses'
    }

    const next = [entry, ...reports]
    setReports(next)
    saveReportsForUser(user.id, next)

    simulateFonnteNotification({ id: entry.id, type: 'lapor', userId: user.id, title: 'Laporan Sampah Penuh', message: `${jenis} - ${volume}`, date: entry.date })

    setMessage({ type: 'success', text: 'Laporan terkirim. Tim akan menindaklanjuti.' })
    // reset minimal fields
    setNotes('')
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-mint-soft">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-xl font-semibold text-forest-emerald">Lapor Sampah Penuh</h1>
        <p className="text-sm text-slate-600 mt-1">Isi form berikut untuk melaporkan lokasi sampah penuh. Tombol akan mengirim laporan dan mensimulasikan notifikasi Fonnte.</p>

        {message && (
          <div className={`mt-4 p-3 rounded ${message.type === 'success' ? 'bg-eco-green/10 text-eco-green' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <StyledSelect
              label="Jenis Sampah"
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              options={["Organik", "Anorganik", "Campuran"]}
            />

            <label className="block text-sm mt-2">Estimasi Volume</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setVolume('Kecil')} className={`px-3 py-2 rounded-md border ${volume === 'Kecil' ? 'bg-eco-green text-white' : 'bg-white'}`}>Kecil</button>
              <button type="button" onClick={() => setVolume('Sedang')} className={`px-3 py-2 rounded-md border ${volume === 'Sedang' ? 'bg-eco-green text-white' : 'bg-white'}`}>Sedang</button>
              <button type="button" onClick={() => setVolume('Besar')} className={`px-3 py-2 rounded-md border ${volume === 'Besar' ? 'bg-eco-green text-white' : 'bg-white'}`}>Besar</button>
            </div>

            <label className="block text-sm mt-2">Catatan Tambahan</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 border rounded-md" rows={4} placeholder="Tambahkan keterangan lokasi atau akses" />
          </div>

          <div className="space-y-3">
            <label className="block text-sm">Foto Sampah (opsional)</label>
            <div className="border border-dashed rounded-md h-40 flex items-center justify-center">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-sm text-slate-500">Tidak ada foto. Unggah untuk membantu identifikasi.</div>
              )}
            </div>

            <FilePicker accept="image/*" onFileChange={handleFileChange} />

            <div className="mt-2">
              <div className="text-sm text-slate-500">Lokasi (konfirmasi)</div>
              <div className="mt-1 text-sm text-forest-emerald font-medium">{user?.address || user?.alamat || 'Alamat pengguna tidak tersedia'}</div>
            </div>

            <div className="mt-4 flex gap-3">
              <button type="submit" className="px-4 py-2 rounded-md bg-eco-green text-white font-semibold">Kirim Laporan Sekarang</button>
              <button type="button" onClick={() => { setJenis('Organik'); setVolume('Kecil'); setNotes(''); setPhotoFile(null); setPhotoPreview(null); }} className="px-4 py-2 rounded-md border">Reset</button>
            </div>
          </div>
        </form>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-forest-emerald">Riwayat Laporan Darurat (Sedang Diproses)</h2>
          <div className="mt-3 bg-slate-50 rounded-md p-3">
            {reports.filter(r => r.status === 'Diproses').length === 0 ? (
              <div className="text-sm text-slate-500">Tidak ada laporan darurat yang sedang diproses.</div>
            ) : (
              <ul className="space-y-2">
                {reports.filter(r => r.status === 'Diproses').map((r) => (
                  <li key={r.id} className="p-3 bg-white rounded-md shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{r.jenis} — {r.volume}</div>
                        <div className="text-xs text-slate-500">{new Date(r.date).toLocaleString('id-ID')}</div>
                        <div className="text-sm text-slate-600 mt-1">{r.notes}</div>
                        <div className="text-xs text-slate-500 mt-1">{r.location}</div>
                      </div>
                      <div className="text-sm text-eco-green font-semibold">{r.status}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
