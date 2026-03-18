import DashboardSidebar from '../../components/DashboardSidebar'

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-forest-emerald text-slate-gray">
      <DashboardSidebar role="admin" />
      <div className="md:ml-64">
        <main className="p-6 container mx-auto">{children}</main>
      </div>
    </div>
  )
}
