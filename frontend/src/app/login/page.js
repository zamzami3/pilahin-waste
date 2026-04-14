"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Eye, EyeOff, LogIn } from "lucide-react"
import { login, goToRoleHome } from "../../lib/authApi"
import { extractApiError } from "../../lib/apiClient"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    try {
      const response = await login(email.trim(), password)
      router.push(goToRoleHome(response?.user?.role))
    } catch (err) {
      setError(extractApiError(err, 'Gagal login'))
    }
  }

  return (
    <section className="px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_70px_-45px_rgba(27,67,50,0.8)]">
        <div className="grid min-h-[520px] md:min-h-[calc(100vh-180px)] md:grid-cols-[1.2fr_1fr]">
          <div className="relative hidden md:block">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1400&q=80')",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-forest-emerald/55 p-8 text-white">
              <p className="text-sm uppercase tracking-[0.18em] text-white/85">Pilahin Access</p>
              <h2 className="mt-3 text-5xl font-bold leading-[1.03]">Masuk untuk kelola layanan harian</h2>
              <p className="mt-4 flex items-center gap-2 text-sm text-white/90">
                Dashboard warga, driver, dan admin dalam satu akun
                <ArrowUpRight size={16} />
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-50 px-6 py-6 md:px-10">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-eco-green/25 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-eco-green">
                  <LogIn size={14} />
                  Login Pilahin
                </div>
                <h1 className="mt-4 text-4xl font-extrabold leading-tight text-forest-emerald">Welcome Back</h1>
                <p className="mt-2 text-sm text-slate-600">Gunakan email dan password yang sudah terdaftar.</p>
              </div>

              {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">
                  Email
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-eco-green"
                  />
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Password
                  <div className="relative mt-2">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="your password"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-800 outline-none transition focus:border-eco-green"
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

              <div className="mt-6 flex items-center justify-end">
                <button type="button" className="text-sm font-medium text-slate-500 hover:text-forest-emerald">Forgot password?</button>
              </div>

              <button type="submit" className="mt-6 w-full rounded-xl bg-black px-6 py-3 text-base font-semibold text-white hover:opacity-95">Log In</button>

              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <span>pilahin.id</span>
                <span>contact us</span>
                <span>2026</span>
              </div>

              <div className="mt-4 text-center">
                <Link href="/register" className="text-sm font-semibold text-forest-emerald hover:text-eco-green">Belum punya akun? Daftar</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
