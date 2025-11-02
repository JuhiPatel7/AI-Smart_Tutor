// This is a client-side component - enables file selection and upload interactivity
"use client"

// Import React type for form event handling
import type React from "react"
// Import useState hook for managing component state
import { useState } from "react"
// Import Dialog components for modal dialog UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
// Import Button UI component
import { Button } from "@/components/ui/button"
// Import Input component for file selection
import { Input } from "@/components/ui/input"
// Import Label component for form fields
import { Label } from "@/components/ui/label"
// Import icons: Upload for upload button, Loader2 for loading state
import { Upload, Loader2 } from "lucide-react"
// Import Supabase client for file storage and database operations
import { createClient } from "@/lib/supabase/client"
// Import toast notification system for user feedback
import { toast } from "sonner"

/**
 * Props for the PdfUploadDialog component
 * @property open - Whether the dialog is currently open
 * @property onOpenChange - Callback when dialog open state changes
 * @property onPdfUploaded - Callback when PDF is successfully uploaded
 */
interface PdfUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPdfUploaded: (pdf: any) => void
}

/**
 * PdfUploadDialog - Modal dialog for uploading PDF files
 * Features:
 * - File selection with PDF validation
 * - Upload to Supabase Storage
 * - Extract text content from PDF using PDF.js
 * - Store metadata in database
 * - Error handling and user feedback
 * 
 * @param open - Whether dialog is open
 * @param onOpenChange - Callback for dialog open state changes
 * @param onPdfUploaded - Callback when upload completes successfully
 * @returns JSX element with upload dialog UI
 */
export default function PdfUploadDialog({
  open,
  onOpenChange,
  onPdfUploaded,
}: PdfUploadDialogProps) {
  // State for storing the selected PDF file
  const [file, setFile] = useState<File | null>(null)
  // State for tracking if upload is in progress
  const [isUploading, setIsUploading] = useState(false)
  // State for displaying error messages
  const [error, setError] = useState<string | null>(null)

  /**
   * Handle file selection from input
   * Validates that selected file is a PDF
   * @param e - File input change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the first selected file
    const selectedFile = e.target.files?.[0]
    // Check if file is PDF type
    if (selectedFile && selectedFile.type === "application/pdf") {
      // Store the file and clear any previous errors
      setFile(selectedFile)
      setError(null)
    } else {
      // Show error if not a PDF and clear file
      setError("Please select a valid PDF file")
      setFile(null)
    }
  }

  /**
   * Handle PDF file upload
   * Uploads to Supabase Storage, extracts text, and stores metadata
   */
  const handleUpload = async () => {
    // Do nothing if no file is selected
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // Initialize Supabase client
      const supabase = createClient()
      
      // Get current authenticated user
      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser()

      // Ensure user is authenticated
      if (!user) throw new Error("Not authenticated")

      // Upload PDF to Supabase Storage
      // Generate unique filename using user ID and timestamp
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Upload file to 'pdfs' storage bucket
      const {
        error: uploadError,
      } = await supabase.storage
        .from("pdfs")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

      // Check for upload errors
      if (uploadError) throw uploadError

      // Get public URL for the uploaded PDF
      const {
        data: {
          publicUrl,
        },
      } = supabase.storage.from("pdfs").getPublicUrl(fileName)

      // Extract text from PDF using FormData and API endpoint
      const formData = new FormData()
      formData.append("file", file)

      // Send PDF to extraction endpoint
      const extractResponse = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      })

      // Check if text extraction was successful
      if (!extractResponse.ok) {
        throw new Error("Failed to extract text from PDF")
      }

      // Parse extracted text and page count
      const { text, pageCount } = await extractResponse.json()

      // Store PDF metadata in database
      const { data: pdfRecord, error: dbError } = await supabase
        .from("pdf_files")
        .insert({
          user_id: user.id,
          name: file.name,
          url: publicUrl,
          text_content: text,
          page_count: pageCount,
        })
        .select()
        .single()

      // Check for database errors
      if (dbError) throw dbError

      // Show success message
      toast.success("PDF uploaded successfully!")

      // Notify parent component of successful upload
      onPdfUploaded(pdfRecord)

      // Close the dialog
      onOpenChange(false)

      // Reset file selection
      setFile(null)
    } catch (error) {
      // Set error message for display
      setError(
        error instanceof Error ? error.message : "Failed to upload PDF"
      )
      // Show error toast notification
      toast.error(
        error instanceof Error ? error.message : "Failed to upload PDF"
      )
    } finally {
      // Stop showing loading state
      setIsUploading(false)
    }
  }

  return (
    // Modal dialog for file upload
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Dialog content container */}
      <DialogContent className="sm:max-w-[425px]">
        {/* Dialog header with title and description */}
        <DialogHeader>
          {/* Dialog title */}
          <DialogTitle>Upload PDF</DialogTitle>
          {/* Dialog description */}
          <DialogDescription>
            Select a PDF file to upload and start chatting with your AI tutor
            about it.
          </DialogDescription>
        </DialogHeader>

        {/* Dialog body - form controls */}
        <div className="grid gap-4 py-4">
          {/* File input label */}
          <Label htmlFor="pdf-file">PDF File</Label>
          {/* File input field */}
          <Input
            id="pdf-file"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {/* Display selected filename if file is selected */}
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          {/* Display error message if any */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* Dialog footer with action buttons */}
        <div className="flex gap-3 justify-end">
          {/* Cancel button - closes dialog */}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          {/* Upload button - uploads selected file */}
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {/* Show loading icon and text while uploading */}
            {isUploading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {/* Show different text based on loading state */}
            {isUploading ? "Uploading..." : (
              <>
                {/* Upload icon */}
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
