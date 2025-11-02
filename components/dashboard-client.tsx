// This is a client-side component - enables browser-based interactivity
"use client"

// Import useState hook for managing component state
import { useState } from "react"
// Import User type from Supabase for type safety
import type { User } from "@supabase/supabase-js"
// Import Button UI component for user actions
import { Button } from "@/components/ui/button"
// Import icons: LogOut for logout button, Upload for PDF upload, FileText for PDF file display
import { LogOut, Upload, FileText } from "lucide-react"
// Import Supabase client for authentication and database operations
import { createClient } from "@/lib/supabase/client"
// Import router for navigation after logout
import { useRouter } from "next/navigation"
// Import PdfUploadDialog component for PDF file uploads
import PdfUploadDialog from "@/components/pdf-upload-dialog"
// Import PdfViewer component for displaying PDF documents
import PdfViewer from "@/components/pdf-viewer"
// Import ChatInterface component for AI-powered document Q&A
import ChatInterface from "@/components/chat-interface"

/**
 * Interface representing a PDF file stored in the database
 * @property id - Unique identifier for the PDF
 * @property name - Display name of the PDF file
 * @property url - URL to access the PDF file
 * @property text_content - Extracted text content from the PDF for AI processing
 * @property page_count - Total number of pages in the PDF
 * @property created_at - Timestamp when the PDF was uploaded
 */
interface PdfFile {
  id: string
  name: string
  url: string
  text_content: string
  page_count: number
  created_at: string
}

/**
 * Props for the DashboardClient component
 * @property user - Authenticated user information from Supabase
 * @property initialPdfFiles - Initial list of PDFs from server-side fetch
 */
interface DashboardClientProps {
  user: User
  initialPdfFiles: PdfFile[]
}

/**
 * DashboardClient - Main interactive dashboard component
 * Manages the layout and state for:
 * - PDF file list sidebar
 * - PDF viewer panel
 * - AI chat interface panel
 * - User authentication (logout)
 * - PDF upload functionality
 * 
 * @param user - Current authenticated user
 * @param initialPdfFiles - Initial PDF files loaded from server
 * @returns JSX element with complete dashboard layout
 */
export default function DashboardClient({
  user,
  initialPdfFiles,
}: DashboardClientProps) {
  // State for managing the list of PDF files (updates when new PDFs are uploaded)
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>(initialPdfFiles)
  // State for tracking which PDF is currently selected for viewing
  const [selectedPdf, setSelectedPdf] = useState<PdfFile | null>(
    initialPdfFiles[0] || null
  )
  // State for controlling visibility of the PDF upload dialog
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  // Router for navigation after logout
  const router = useRouter()
  // Supabase client for authentication operations
  const supabase = createClient()

  /**
   * Handle user logout
   * Signs out the user from Supabase and redirects to home page
   */
  const handleLogout = async () => {
    // Sign out the user from Supabase
    await supabase.auth.signOut()
    // Redirect to home page
    router.push("/")
  }

  /**
   * Handle new PDF upload
   * Adds the newly uploaded PDF to the file list and selects it for viewing
   * @param newPdf - The newly uploaded PDF file object
   */
  const handlePdfUploaded = (newPdf: PdfFile) => {
    // Add new PDF to the beginning of the list
    setPdfFiles([newPdf, ...pdfFiles])
    // Automatically select the newly uploaded PDF
    setSelectedPdf(newPdf)
    // Close the upload dialog
    setIsUploadOpen(false)
  }

  return (
    // Main dashboard container with vertical flex layout
    <div className="flex h-screen flex-col">
      {/* Header section with navigation and controls */}
      <header className="flex h-16 items-center justify-between border-b bg-background px-6">
        {/* Left side of header - branding and upload button */}
        <div className="flex items-center gap-4">
          {/* Application title */}
          <h1 className="text-xl font-bold">AI Tutor</h1>
          {/* Upload PDF button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUploadOpen(true)}
          >
            {/* Upload icon */}
            <Upload className="mr-2 h-4 w-4" />
            Upload PDF
          </Button>
        </div>

        {/* Right side of header - user info and logout */}
        <div className="flex items-center gap-4">
          {/* Display current user's email */}
          <span className="text-sm text-muted-foreground">
            {user.email}
          </span>
          {/* Logout button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
          >
            {/* Logout icon */}
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main content area with split view */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - PDF files list */}
        <aside className="w-64 border-r bg-muted/50 overflow-y-auto">
          {/* Sidebar header */}
          <div className="border-b p-4">
            {/* Sidebar title */}
            <h2 className="text-sm font-semibold">Your Documents</h2>
          </div>

          {/* PDF files list container */}
          <div className="p-4 space-y-2">
            {/* Check if there are any PDF files */}
            {pdfFiles.length === 0 ? (
              // Empty state - show when no PDFs uploaded
              <div className="text-center py-8">
                {/* Empty state icon */}
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                {/* Empty state message */}
                <p className="text-sm text-muted-foreground">
                  No documents yet
                </p>
                {/* Hint to upload */}
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a PDF to get started
                </p>
              </div>
            ) : (
              // Display list of PDF files
              pdfFiles.map((pdf) => (
                // PDF file item button
                <button
                  key={pdf.id}
                  onClick={() => setSelectedPdf(pdf)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedPdf?.id === pdf.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {/* PDF file icon */}
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    {/* PDF filename */}
                    <span className="truncate">{pdf.name}</span>
                  </div>
                  {/* PDF page count info */}
                  <p className="text-xs text-muted-foreground mt-1">
                    {pdf.page_count} pages
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Right content area - PDF viewer and chat split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Check if a PDF is selected */}
          {selectedPdf ? (
            // Display PDF viewer and chat interface when PDF is selected
            <>
              {/* PDF Viewer panel - takes up left side */}
              <div className="flex-1 overflow-hidden border-r">
                <PdfViewer
                  pdfUrl={selectedPdf.url}
                  pdfName={selectedPdf.name}
                />
              </div>

              {/* Chat Interface panel - takes up right side */}
              <div className="w-96 overflow-hidden flex flex-col border-l">
                <ChatInterface
                  pdfId={selectedPdf.id}
                  pdfContent={selectedPdf.text_content}
                />
              </div>
            </>
          ) : (
            // Empty state when no PDF is selected
            <div className="flex-1 flex items-center justify-center">
              {/* Empty state message */}
              <div className="text-center">
                {/* Empty state icon */}
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                {/* Empty state text */}
                <p className="text-lg font-semibold mb-2">No PDF selected</p>
                <p className="text-sm text-muted-foreground">
                  Upload or select a PDF to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Upload Dialog - opened when upload button is clicked */}
      <PdfUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onPdfUploaded={handlePdfUploaded}
      />
    </div>
  )
}
