// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CSV File Manager',
  description: 'Upload and manage your CSV files',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link 
                    href="/" 
                    className="text-xl font-bold text-gray-800"
                  >
                    CSV Manager
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    href="/"
                    className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
                  >
                    Home
                  </Link>
                  <Link
                    href="/upload"
                    className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
                  >
                    Upload
                  </Link>
                  <Link
                    href="/files"
                    className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
                  >
                    Files
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}