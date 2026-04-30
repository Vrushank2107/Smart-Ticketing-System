import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../lib/auth'
import Navbar from '../components/Navbar'
import Providers from '../components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Smart Event Ticketing System',
  description: 'Advanced ticketing system with capacity management and waitlist automation',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
