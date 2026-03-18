import DashboardSidebar from '../../components/DashboardSidebar'

export default function DriverLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-gray text-forest-emerald">
      <DashboardSidebar role="driver" />
      <div className="md:ml-64">
        <main className="p-6 container mx-auto">{children}</main>
      </div>
    </div>
  )
}
