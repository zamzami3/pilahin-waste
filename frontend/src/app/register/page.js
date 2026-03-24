"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ensureDefaults, registerUser } from '../../lib/mockAuth'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    ensureDefaults()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    setError("")
    try {
      registerUser({ name: name.trim(), email: email.trim(), password, role: 'warga' })
      router.push('/warga')
    } catch (err) {
      setError(err.message || 'Gagal registrasi')
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Daftar</h1>
      <p className="text-sm text-slate-600 mb-4">Registrasi hanya tersedia untuk akun warga.</p>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-sm space-y-3">
        {error && <div className="text-sm text-red-600">{error}</div>}

        <label className="block text-sm">
          Nama
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" required className="w-full mt-1 px-3 py-2 border rounded-md" />
        </label>

        <label className="block text-sm">
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full mt-1 px-3 py-2 border rounded-md" />
        </label>

        <label className="block text-sm">
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full mt-1 px-3 py-2 border rounded-md" />
        </label>

        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Role akun: <span className="font-semibold text-forest-emerald">Warga</span>
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" className="bg-eco-green text-white px-4 py-2 rounded-md font-semibold">Daftar</button>
          <Link href="/login" className="text-sm text-forest-emerald">Sudah punya akun? Masuk</Link>
        </div>
      </form>
    </div>
  )
}
