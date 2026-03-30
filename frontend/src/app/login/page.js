"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { loginUser } from '../../lib/mockAuth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

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

  return (
    <section className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-mint-soft p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-eco-green">Akun Pilahin</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-forest-emerald">Masuk dan lanjutkan aktivitasmu.</h1>
            <p className="mt-4 text-slate-700">
              Pantau jadwal pickup, cek poin, dan akses dashboard sesuai peran akun Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-forest-emerald">Masuk</h2>
            <p className="mt-2 text-sm text-slate-600">Gunakan email dan password yang sudah terdaftar.</p>

            {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

            <div className="mt-5 space-y-4">
              <label className="block text-sm font-semibold text-forest-emerald">
                Email
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="nama@email.com"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-eco-green"
                />
              </label>

              <label className="block text-sm font-semibold text-forest-emerald">
                Password
                <div className="relative mt-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan password"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-slate-800 outline-none transition focus:border-eco-green"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 hover:text-forest-emerald"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" className="rounded-xl bg-eco-green px-6 py-3 font-semibold text-white hover:brightness-95">Masuk</button>
              <Link href="/register" className="text-sm font-semibold text-forest-emerald hover:text-eco-green">Belum punya akun? Daftar</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
