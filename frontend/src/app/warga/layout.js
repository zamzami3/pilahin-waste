import DashboardSidebar from '../../components/DashboardSidebar'

export default function WargaLayout({ children }) {
  return (
    <div className="min-h-screen bg-mint-soft text-forest-emerald">
      <DashboardSidebar role="warga" />
      <div className="md:ml-64">
        <main className="p-6 container mx-auto">{children}</main>
      </div>
    </div>
  )
}
