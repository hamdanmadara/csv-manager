import FileUpload from '../components/FileUpload'

export default function UploadPage() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            CSV File Upload
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload and manage your CSV files
          </p>
        </div>
        <FileUpload />
      </div>
    </div>
  )
}