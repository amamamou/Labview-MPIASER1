/**
 * CSV Uploader Component
 * Handles CSV file upload and data processing
 */

"use client"

import { useRef, useState } from "react"
import { Upload, FileText, AlertCircle, CheckCircle2, X } from "lucide-react"
import { parseCSVData } from "@/lib/api-client"

interface CSVUploaderProps {
  onDataParsed?: (data: any[]) => void
  onError?: (error: string) => void
}

const REQUIRED_FIELDS = ["time_h", "irradiance_Wm2", "solar_power_W", "load_power_W"];

export function CSVUploader({ onDataParsed, onError }: CSVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [rowCount, setRowCount] = useState(0)

  const handleFileSelect = async (selectedFile: File) => {
    setError(null)
    setSuccess(false)

    // Validate file
    if (!selectedFile.name.endsWith(".csv")) {
      const err = "Please select a valid CSV file"
      setError(err)
      onError?.(err)
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      const err = "File size must be less than 10MB"
      setError(err)
      onError?.(err)
      return
    }

    setFile(selectedFile)
    setLoading(true)

    try {
      const text = await selectedFile.text()
      const data = parseCSVData(text)

      if (data.length === 0) {
        throw new Error("No valid data found in CSV")
      }

      // Validate required fields
      const missingFields = REQUIRED_FIELDS.filter((field) => !Object.keys(data[0]).includes(field));
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      setRowCount(data.length)
      setSuccess(true)
      onDataParsed?.(data)

      // Auto-reset after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to parse CSV file"
      setError(errMsg)
      onError?.(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-light">Upload CSV Data</h3>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <FileText className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
          <div>
            <p className="font-light text-foreground">Drag and drop your CSV file here</p>
            <p className="text-sm text-muted-foreground font-light">or click to browse</p>
          </div>
          <p className="text-xs text-muted-foreground font-light">Max 10MB • CSV format</p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 font-light">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-green-600 font-light">
            Successfully loaded {rowCount} data points from {file?.name}
          </p>
        </div>
      )}

      {file && !loading && !error && (
        <div className="mt-4 p-3 bg-muted rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm font-light text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground font-light">
                {(file.size / 1024).toFixed(1)} KB • {rowCount} rows
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFile(null)
              setRowCount(0)
              if (fileInputRef.current) fileInputRef.current.value = ""
            }}
            className="p-1 hover:bg-muted-foreground/20 rounded transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-xs text-primary font-light animate-pulse">Processing CSV file...</p>
        </div>
      )}
    </div>
  )
}
