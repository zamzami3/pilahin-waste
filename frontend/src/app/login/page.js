"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ensureDefaults, getUsers, loginUser } from '../../lib/mockAuth'
import { LogIn, User, Key } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [samples, setSamples] = useState([])

  useEffect(() => {
    ensureDefaults()
    // load sample users
    const u = getUsers()
    setSamples(u)
  }, [])

  function goToRoleHome(role) {
    if (role === 'warga') return '/warga'
    if (role === 'driver') return '/driver/tasks'
    if (role === 'admin') return '/admin'
    return '/'
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError("")
    try {
      const user = loginUser(email.trim(), password)
      router.push(goToRoleHome(user.role))
    } catch (err) {
      setError(err.message || 'Gagal login')
    }
  }

  function quickLogin(sample) {
    try {
      const user = loginUser(sample.email, sample.password)
      router.push(goToRoleHome(user.role))
    } catch (err) {
      setError(err.message || 'Gagal login cepat')
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Masuk</h1>
      <p className="text-sm text-slate-600 mb-4">Masuk menggunakan akun Anda atau coba login cepat dengan sample.</p>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-sm space-y-3">
        {error && <div className="text-sm text-red-600">{error}</div>}

        <label className="block text-sm">
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full mt-1 px-3 py-2 border rounded-md" />
        </label>

        <label className="block text-sm">
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full mt-1 px-3 py-2 border rounded-md" />
        </label>

        <div className="flex items-center justify-between">
          <button type="submit" className="bg-eco-green text-white px-4 py-2 rounded-md font-semibold">Masuk</button>
          <Link href="/register" className="text-sm text-forest-emerald">Belum punya akun? Daftar</Link>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">Login cepat (sample)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {samples.map((s) => (
            <button key={s.email} onClick={() => quickLogin(s)} className="bg-white border rounded-md p-3 text-sm shadow-sm hover:shadow-md">
              <div className="font-semibold">{s.role}</div>
              <div className="text-xs text-slate-500">{s.email}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 text-xs text-slate-500">Credential sample: warga@example.com / warga123 — driver@example.com / driver123 — admin@example.com / admin123</div>
      </div>
    </div>
  )
}
