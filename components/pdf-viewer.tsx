// This is a client-side component - enables interactive PDF viewing and annotations
"use client"

// Import React type for event annotations
import type React from "react"
// Import React hooks for state and lifecycle management
import { useState, useEffect } from "react"
// Import Button UI component for toolbar actions
import { Button } from "@/components/ui/button"
// Import icons for navigation and annotation tools
import { ChevronLeft, ChevronRight, Highlighter, Underline, Trash2 } from "lucide-react"
// Import Supabase client for persisting annotations
import { createClient } from "@/lib/supabase/client"
// Import toast for user feedback notifications
import { toast } from "sonner"
// Import Switch for toggling annotation mode
import { Switch } from "@/components/ui/switch"

/**
 * A single annotation entity stored and rendered over the PDF
 * - id: unique id in database
 * - type: visual type of annotation (highlight or underline)
 * - color: color applied to the annotation shape
 * - text_content: optional text captured within selection
 * - position: relative coordinates of the annotation box
 * - page_number: which page the annotation belongs to
 */
interface Annotation {
  id: string
  type: "highlight" | "underline"
  color: string
  text_content?: string
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  page_number: number
}

/**
 * PdfViewer props
 * - pdfUrl: public URL of the PDF to display
 * - pdfName: display name of the PDF
 * - pdfId: database identifier for the PDF (used to fetch/store annotations)
 * - pageCount: total number of pages (for navigation bounds)
 */
interface PdfViewerProps {
  pdfUrl: string
  pdfName: string
  pdfId: string
  pageCount: number
}

/**
 * PdfViewer - Renders a PDF with page navigation and basic annotation tools
 * Features:
 * - Next/Prev page navigation with bounds checks
 * - Toggle Annotation Mode to create selection boxes
 * - Create highlight/underline annotations from box selections
 * - Persist annotations to Supabase and reload per page
 * - Delete annotations
 */
export default function PdfViewer({
  pdfUrl,
  pdfName,
  pdfId,
  pageCount,
}: PdfViewerProps) {
  // Current visible page index (1-based)
  const [currentPage, setCurrentPage] = useState(1)
  // All annotations for the current page
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  // Context menu visibility for creating annotation at a selection
  const [showMenu, setShowMenu] = useState(false)
  // Position of the annotation creation menu
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  // Whether user is currently dragging to select a region
  const [isSelecting, setIsSelecting] = useState(false)
  // Drag start point (relative to PDF viewport)
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 })
  // Drag end point (relative to PDF viewport)
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 })
  // Computed selection rectangle (x,y,width,height) or null if none
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  // Global toggle for enabling annotation interactions
  const [annotationMode, setAnnotationMode] = useState(false)

  // Supabase client for DB operations
  const supabase = createClient()

  // Load annotations when page or pdf changes
  useEffect(() => {
    loadAnnotations()
  }, [currentPage, pdfId])

  /**
   * Fetch annotations for the current page from the database
   */
  const loadAnnotations = async () => {
    const { data, error } = await supabase
      .from("annotations")
      .select("*")
      .eq("pdf_id", pdfId)
      .eq("page_number", currentPage)

    if (error) {
      console.error("Error loading annotations:", error)
      return
    }

    setAnnotations(data || [])
  }

  /**
   * Compute a normalized selection rectangle from start and end points
   */
  const computeSelectionBox = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const x = Math.min(start.x, end.x)
    const y = Math.min(start.y, end.y)
    const width = Math.abs(end.x - start.x)
    const height = Math.abs(end.y - start.y)
    return { x, y, width, height }
  }

  /**
   * Begin a selection drag when annotation mode is enabled
   */
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!annotationMode) return
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setIsSelecting(true)
    setSelectionStart({ x, y })
    setSelectionEnd({ x, y })
    setSelectionBox(null)
    setShowMenu(false)
  }

  /**
   * Update live selection box while dragging
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting) return
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const end = { x, y }
    setSelectionEnd(end)
    setSelectionBox(computeSelectionBox(selectionStart, end))
  }

  /**
   * Finish selection and show annotation creation menu
   */
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting) return
    setIsSelecting(false)
    if (!selectionBox) return
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const x = selectionBox.x + rect.left
    const y = selectionBox.y + rect.top
    setMenuPosition({ x, y })
    setShowMenu(true)
  }

  /**
   * Persist a new annotation of given type/color using current selection
   */
  const createAnnotation = async (type: Annotation["type"], color: string) => {
    if (!selectionBox) return

    // Insert annotation into DB
    const { data, error } = await supabase
      .from("annotations")
      .insert({
        pdf_id: pdfId,
        page_number: currentPage,
        type,
        color,
        position: selectionBox,
      })
      .select()
      .single()

    if (error) {
      toast.error("Failed to create annotation")
      return
    }

    // Update local state to include the new annotation
    setAnnotations((prev) => [...prev, data as Annotation])
    setSelectionBox(null)
    setShowMenu(false)
    toast.success("Annotation added")
  }

  /**
   * Remove an annotation from DB and local state
   */
  const deleteAnnotation = async (id: string) => {
    const { error } = await supabase.from("annotations").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete annotation")
      return
    }
    setAnnotations((prev) => prev.filter((a) => a.id !== id))
    toast.success("Annotation deleted")
  }

  /**
   * Navigate to previous page
   */
  const prevPage = () => setCurrentPage((p) => Math.max(1, p - 1))

  /**
   * Navigate to next page
   */
  const nextPage = () => setCurrentPage((p) => Math.min(pageCount, p + 1))

  return (
    <div className="flex h-full w-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium truncate" title={pdfName}>
            {pdfName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Annotation Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Annotate</span>
            <Switch checked={annotationMode} onCheckedChange={setAnnotationMode} />
          </div>
          {/* Page navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevPage} disabled={currentPage <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {currentPage} / {pageCount}
            </span>
            <Button variant="outline" size="icon" onClick={nextPage} disabled={currentPage >= pageCount}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* PDF viewport */}
      <div className="relative flex-1 overflow-auto bg-muted/30">
        {/* PDF content - using iframe for simplicity; replace with pdf.js for richer features */}
        <div
          className="relative mx-auto my-4 w-[90%] max-w-5xl rounded-md bg-background shadow"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: annotationMode ? "crosshair" : "default" }}
        >
          <iframe
            src={`${pdfUrl}#page=${currentPage}`}
            className="h-[75vh] w-full rounded-md"
          />

          {/* Render existing annotations for current page */}
          {annotations.map((a) => (
            <div
              key={a.id}
              className="absolute"
              style={{
                left: a.position.x,
                top: a.position.y,
                width: a.position.width,
                height: a.position.height,
                backgroundColor: a.type === "highlight" ? a.color : "transparent",
                borderBottom: a.type === "underline" ? `2px solid ${a.color}` : "none",
                opacity: 0.35,
                pointerEvents: "auto",
              }}
              title={a.text_content || "Annotation"}
            >
              {/* Delete button for each annotation */}
              <button
                className="absolute -right-2 -top-2 rounded bg-background/80 p-0.5 shadow"
                onClick={() => deleteAnnotation(a.id)}
                aria-label="Delete annotation"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Live selection rectangle */}
          {selectionBox && (
            <div
              className="absolute border-2 border-primary/70 bg-primary/10"
              style={{
                left: selectionBox.x,
                top: selectionBox.y,
                width: selectionBox.width,
                height: selectionBox.height,
              }}
            />
          )}

          {/* Context menu for creating annotation */}
          {showMenu && selectionBox && (
            <div
              className="absolute z-10 rounded-md border bg-background p-1 shadow"
              style={{ left: selectionBox.x, top: Math.max(0, selectionBox.y - 40) }}
            >
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => createAnnotation("highlight", "#fde68a")}
                  title="Highlight">
                  <Highlighter className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => createAnnotation("underline", "#60a5fa")}
                  title="Underline">
                  <Underline className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
