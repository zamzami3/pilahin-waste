import DashboardSidebar from '../../components/DashboardSidebar'
import ScrollRevealWrapper from '../../components/ScrollRevealWrapper'

export default function DriverLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-gray text-forest-emerald">
      <DashboardSidebar role="driver" />
      <div className="md:ml-64">
        <main className="p-6 container mx-auto">
          <ScrollRevealWrapper>{children}</ScrollRevealWrapper>
        </main>
      </div>
    </div>
  )
}
