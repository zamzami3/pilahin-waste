"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ensureDefaults, registerUser } from '../../lib/mockAuth'
import StyledSelect from "../../components/StyledSelect"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState('warga')
  const [error, setError] = useState("")

  useEffect(() => {
    ensureDefaults()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    setError("")
    try {
      const user = registerUser({ name: name.trim(), email: email.trim(), password, role })
      // redirect user to their dashboard
      if (user.role === 'warga') router.push('/warga')
      else if (user.role === 'driver') router.push('/driver/tasks')
      else if (user.role === 'admin') router.push('/admin')
      else router.push('/')
    } catch (err) {
      setError(err.message || 'Gagal registrasi')
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Daftar</h1>
      <p className="text-sm text-slate-600 mb-4">Buat akun baru untuk mengakses dashboard.</p>

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

        <StyledSelect
          label="Role"
          value={role}
          onValueChange={setRole}
          options={[
            { value: "warga", label: "Warga" },
            { value: "driver", label: "Driver" },
            { value: "admin", label: "Admin" },
          ]}
        />

        <div className="flex items-center justify-between">
          <button type="submit" className="bg-eco-green text-white px-4 py-2 rounded-md font-semibold">Daftar</button>
          <Link href="/login" className="text-sm text-forest-emerald">Sudah punya akun? Masuk</Link>
        </div>
      </form>
    </div>
  )
}
