import '../styles/globals.css'
import PublicHeader from '../components/PublicHeader'
import PublicFooter from '../components/PublicFooter'

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen">
        <PublicHeader />
        <div className="flex-1">{children}</div>
        <PublicFooter />
      </body>
    </html>
  )
}
