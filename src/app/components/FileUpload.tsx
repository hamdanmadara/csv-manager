// src/app/components/FileUpload.tsx
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'

interface UploadStatus {
  progress: number
  status: 'uploading' | 'completed' | 'error'
}

interface FileWithId extends File {
  id: string;
}

interface UploadStatusMap {
  [key: string]: UploadStatus
}

const FileUpload = () => {
  const [files, setFiles] = useState<FileWithId[]>([])
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [uploadStatus, setUploadStatus] = useState<UploadStatusMap>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    if (errorMessage) {
      timeoutId = setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [errorMessage])

  // Function to check if file already exists
  const isFileAlreadyAdded = (fileName: string) => {
    return files.some(file => file.name === fileName)
  }

  // Create a unique ID for each file
  const createFileWithId = (file: File): FileWithId => {
    return Object.assign(file, {
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    })
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const processFiles = (newFiles: File[]) => {
    setErrorMessage(null)
    let duplicateCount = 0
    let invalidCount = 0
    
    const filesToUpload = newFiles.reduce((acc: FileWithId[], file: File) => {
      if (!file.name.endsWith('.csv')) {
        invalidCount++
        return acc
      }

      if (isFileAlreadyAdded(file.name)) {
        duplicateCount++
        return acc
      }

      const fileWithId = createFileWithId(file)
      acc.push(fileWithId)
      return acc
    }, [])

    // Set appropriate error messages
    if (invalidCount > 0 && duplicateCount > 0) {
      setErrorMessage(`${invalidCount} invalid files and ${duplicateCount} duplicate files were skipped`)
    } else if (invalidCount > 0) {
      setErrorMessage(`${invalidCount} invalid files were skipped. Only CSV files are allowed`)
    } else if (duplicateCount > 0) {
      setErrorMessage(`${duplicateCount} duplicate files were skipped`)
    }

    if (filesToUpload.length > 0) {
      setFiles(prev => [...prev, ...filesToUpload])
      filesToUpload.forEach(file => handleFileUpload(file))
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileUpload = async (file: FileWithId) => {
    setUploadStatus(prev => ({
      ...prev,
      [file.id]: { progress: 0, status: 'uploading' }
    }))

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploadStatus(prev => ({
        ...prev,
        [file.id]: { progress: 100, status: 'completed' }
      }))
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus(prev => ({
        ...prev,
        [file.id]: { progress: 0, status: 'error' }
      }))
      setErrorMessage(`Failed to upload ${file.name}`)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId))
    setUploadStatus(prev => {
      const newStatus = { ...prev }
      delete newStatus[fileId]
      return newStatus
    })
  }

  const removeAllFiles = () => {
    setFiles([])
    setUploadStatus({})
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div
        className={`transition-all duration-500 ease-in-out ${
          errorMessage 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform -translate-y-2 pointer-events-none'
        } absolute top-4 right-4 left-4 z-50`}
      >
        {errorMessage && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-md shadow-lg">
            <p className="text-orange-600">{errorMessage}</p>
          </div>
        )}
      </div>
      
      <div 
        className={`relative border-2 border-dashed rounded-lg p-8 text-center
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          transition-all duration-200 ease-in-out`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".csv"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              processFiles(Array.from(e.target.files))
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-semibold">Drop CSV files here or click to upload</p>
            <p className="text-sm text-gray-500">Multiple files are allowed</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <>
          <div className="flex justify-between items-center mt-6 mb-3">
            <h3 className="text-lg font-semibold text-gray-700">
              Uploaded Files ({files.length})
            </h3>
            <button
              onClick={removeAllFiles}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              Remove All
            </button>
          </div>
          <div className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="bg-white rounded-lg shadow p-4 transition-all duration-200 hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {uploadStatus[file.id]?.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {uploadStatus[file.id]?.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    {uploadStatus[file.id]?.status === 'uploading' && (
                      <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    <span className="font-medium">{file.name}</span>
                    <span className="text-sm text-gray-500">
                      ({Math.round(file.size / 1024)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              
                <div className="relative w-full h-2 bg-gray-100 rounded">
                  <div
                    className={`absolute left-0 top-0 h-full rounded transition-all duration-300
                      ${uploadStatus[file.id]?.status === 'error' 
                        ? 'bg-red-500' 
                        : uploadStatus[file.id]?.status === 'completed'
                          ? 'bg-green-500'
                          : 'bg-blue-500'}`}
                    style={{ width: `${uploadStatus[file.id]?.progress || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default FileUpload