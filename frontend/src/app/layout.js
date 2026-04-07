import '../styles/globals.css'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'
import ScrollRevealWrapper from '../components/ScrollRevealWrapper'

export const metadata = {
  title: 'Pilahin - Kelola Sampah Jadi Berkah',
  description: 'Platform Pilahin untuk layanan pengelolaan sampah yang terstruktur dan modern.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen">
        <PublicHeader />
        <div className="flex-1">
          <ScrollRevealWrapper className="h-full">{children}</ScrollRevealWrapper>
        </div>
        <PublicFooter />
      </body>
    </html>
  )
}
