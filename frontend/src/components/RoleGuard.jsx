"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { fetchMe, getCurrentUser, goToRoleHome } from "../lib/authApi"
import { getStoredToken } from "../lib/apiClient"

export default function RoleGuard({ role, children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)

  const expectedRole = useMemo(() => String(role || "").toLowerCase(), [role])

  useEffect(() => {
    let isMounted = true

    async function validateSession() {
      const token = getStoredToken()
      if (!token) {
        router.replace("/login")
        return
      }

      const localUser = getCurrentUser()
      if (localUser?.role && localUser.role !== expectedRole) {
        router.replace(goToRoleHome(localUser.role))
        return
      }

      try {
        const me = await fetchMe()
        if (!isMounted) return

        if (!me?.role) {
          router.replace("/login")
          return
        }

        if (String(me.role).toLowerCase() !== expectedRole) {
          router.replace(goToRoleHome(me.role))
          return
        }

        setIsReady(true)
      } catch (error) {
        router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`)
      }
    }

    validateSession()

    return () => {
      isMounted = false
    }
  }, [expectedRole, pathname, router])

  if (!isReady) {
    return (
      <div className="min-h-[30vh] flex items-center justify-center text-sm text-slate-500">
        Memverifikasi sesi...
      </div>
    )
  }

  return children
}
