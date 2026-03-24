"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginUser } from '../../lib/mockAuth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Masuk</h1>
      <p className="text-sm text-slate-600 mb-4">Masuk menggunakan akun Anda.</p>

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
    </div>
  )
}
