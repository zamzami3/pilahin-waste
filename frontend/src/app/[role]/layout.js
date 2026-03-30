import DashboardSidebar from '../../components/DashboardSidebar'
import ClientErrorBoundary from '../../components/ClientErrorBoundary'
import ScrollRevealWrapper from '../../components/ScrollRevealWrapper'

const ROLE_THEME = {
  warga: 'bg-mint-soft text-forest-emerald',
  driver: 'bg-slate-gray text-forest-emerald',
  admin: 'bg-[#10271d] text-slate-gray',
}

function normalizeRole(role) {
  return ['warga', 'driver', 'admin'].includes(role) ? role : 'warga'
}

export default function RoleLayout({ children, params }) {
  const role = normalizeRole(params?.role)

  return (
    <div className={`min-h-screen ${ROLE_THEME[role]}`}>
      <DashboardSidebar role={role} />
      <div className="md:ml-64">
        <ClientErrorBoundary>
          <main className="container mx-auto p-6">
            <ScrollRevealWrapper>{children}</ScrollRevealWrapper>
          </main>
        </ClientErrorBoundary>
      </div>
    </div>
  )
}