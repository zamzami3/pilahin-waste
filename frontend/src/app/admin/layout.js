"use client"

import DashboardSidebar from '../../components/DashboardSidebar'
import ScrollRevealWrapper from '../../components/ScrollRevealWrapper'
import RoleGuard from '../../components/RoleGuard'

export default function AdminLayout({ children }) {
  return (
    <RoleGuard role="admin">
      <div className="min-h-screen bg-forest-emerald text-slate-gray">
        <DashboardSidebar role="admin" />
        <div className="md:ml-64">
          <main className="p-6 container mx-auto">
            <ScrollRevealWrapper>{children}</ScrollRevealWrapper>
          </main>
        </div>
      </div>
    </RoleGuard>
  )
}
