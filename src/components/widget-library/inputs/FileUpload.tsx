'use client'

import { useRef, useState } from 'react'

export interface FileUploadProps {
  value: File | null
  onChange: (file: File | null) => void
  label?: string
  helpText?: string
  required?: boolean
  accept?: string
  maxSize?: number // in bytes
}

export function FileUpload({ 
  value = null, 
  onChange, 
  label,
  helpText,
  required,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024 // 5MB default
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)
    
    if (!file) {
      onChange(null)
      setPreview(null)
      return
    }

    if (maxSize && file.size > maxSize) {
      setError(`File size must be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB`)
      return
    }

    onChange(file)
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && inputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(file)
      inputRef.current.files = dt.files
      handleFileChange({ target: { files: dt.files } } as any)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeFile = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onChange(null)
    setPreview(null)
    setError(null)
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          
        </label>
      )}
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          required={required}
          className="hidden"
        />
        
        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-32 rounded-lg"
            />
            <div className="text-sm text-gray-600">
              {value?.name} ({(value?.size || 0 / (1024 * 1024)).toFixed(1)}KB)
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-sm text-gray-600">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Upload a file
              </button>
              <span> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">
              {accept} up to {(maxSize / (1024 * 1024)).toFixed(1)}MB
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}