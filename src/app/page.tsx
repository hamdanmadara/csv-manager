// src/app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Welcome to CSV File Manager
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Upload, manage, and analyze your CSV files easily
          </p>
          <div className="mt-8">
            <Link
              href="/upload"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}