import DashboardSidebar from '../../components/DashboardSidebar'
import ClientErrorBoundary from '../../components/ClientErrorBoundary'
import ScrollRevealWrapper from '../../components/ScrollRevealWrapper'

export default function WargaLayout({ children }) {
  return (
    <div className="min-h-screen bg-mint-soft text-forest-emerald">
      <DashboardSidebar role="warga" />
      <div className="md:ml-64">
        <ClientErrorBoundary>
          <main className="p-6 container mx-auto">
            <ScrollRevealWrapper>{children}</ScrollRevealWrapper>
          </main>
        </ClientErrorBoundary>
      </div>
    </div>
  )
}
