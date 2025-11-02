// This is a client-side component - enables browser-based interactivity and real-time features
"use client"

// Import React type for form event handling
import type React from "react"
// Import React hooks for state management, references, and side effects
import { useState, useRef, useEffect } from "react"
// Import Button UI component for user actions
import { Button } from "@/components/ui/button"
// Import Input component for user text input
import { Input } from "@/components/ui/input"
// Import icons from lucide-react: Send for submission, Mic for voice input, Loader2 for loading state
import { Send, Mic, Loader2 } from "lucide-react"
// Import Supabase client for database and authentication operations
import { createClient } from "@/lib/supabase/client"
// Import toast notification system for user feedback
import { toast } from "sonner"

/**
 * Props for the ChatInterface component
 * @property pdfId - The unique identifier of the PDF being discussed
 * @property pdfContent - The text content of the PDF for context in AI responses
 */
interface ChatInterfaceProps {
  pdfId: string
  pdfContent: string
}

/**
 * Message interface representing a single chat message
 * @property id - Unique identifier for the message
 * @property role - Indicates who sent the message: 'user' or 'assistant' (AI)
 * @property content - The text content of the message
 */
interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

/**
 * ChatInterface Component - Interactive chat interface for AI-powered document Q&A
 * Features:
 * - Display conversation history with user and AI messages
 * - Send text messages to query the AI about the document
 * - Voice input using browser's speech recognition API
 * - Auto-scroll to latest messages
 * - Loading indicators while AI processes responses
 * - Persistent message storage in Supabase database
 * 
 * @param props - Component props containing pdfId and pdfContent
 * @returns JSX element with full chat interface
 */
export default function ChatInterface({
  pdfId,
  pdfContent,
}: ChatInterfaceProps) {
  // State for storing all chat messages (user and AI responses)
  const [messages, setMessages] = useState<Message[]>([])
  // State for the current user input in the text field
  const [input, setInput] = useState("")
  // State to track if AI is processing a response
  const [isLoading, setIsLoading] = useState(false)
  // State to track if voice recognition is active
  const [isListening, setIsListening] = useState(false)
  // Reference to the bottom of messages container for auto-scroll functionality
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // Initialize Supabase client for database operations
  const supabase = createClient()

  /**
   * Scroll to the bottom of the messages container
   * Used to show the latest message automatically
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load existing messages from database when component mounts or PDF changes
  useEffect(() => {
    const loadMessages = async () => {
      // Get the current authenticated user
      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser()

      // Only proceed if user is authenticated
      if (user) {
        // Fetch all messages for this user and PDF from the database
        const {
          data,
          error,
        } = await supabase
          .from("messages")
          .select("*")
          .eq("user_id", user.id)
          .eq("pdf_id", pdfId)
          .order("created_at", {
            ascending: true,
          })

        // If successful, populate messages state with fetched data
        if (data && !error) {
          setMessages(
            data.map((msg) => ({
              id: msg.id,
              role: msg.role as "user" | "assistant",
              content: msg.content,
            })),
          )
        }
      }
    }

    loadMessages()
  }, [pdfId, supabase])

  /**
   * Handle text message submission
   * Sends user message to AI endpoint and stores in database
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Don't process empty messages
    if (!input.trim()) return

    // Create a user message object
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    // Update UI with user message immediately
    setMessages((prev) => [...prev, userMessage])
    // Clear input field for next message
    setInput("")
    // Indicate that AI is processing
    setIsLoading(true)

    try {
      // Send message to AI chat endpoint along with PDF context
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          pdfContent: pdfContent,
          pdfId: pdfId,
          conversationHistory: messages,
        }),
      })

      // Check if the API request was successful
      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      // Parse the AI response
      const data = await response.json()
      
      // Create assistant message object from AI response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
      }

      // Add AI response to message history
      setMessages((prev) => [...prev, assistantMessage])
      
      // Store both messages in the database
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Save user message to database
        await supabase.from("messages").insert({
          user_id: user.id,
          pdf_id: pdfId,
          role: "user",
          content: input,
        })

        // Save AI response to database
        await supabase.from("messages").insert({
          user_id: user.id,
          pdf_id: pdfId,
          role: "assistant",
          content: data.response,
        })
      }
    } catch (error) {
      // Show error message to user
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to get response",
      )
    } finally {
      // Stop showing loading indicator
      setIsLoading(false)
    }
  }

  /**
   * Handle voice input using browser's Web Speech API
   * Captures user's spoken words and converts them to text
   */
  const handleVoiceInput = async () => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in your browser")
      return
    }

    // Create a new speech recognition instance
    const recognition = new SpeechRecognition()
    
    // Configure speech recognition settings
    recognition.continuous = false
    recognition.interimResults = false
    recognition.language = "en-US"

    // Handle when speech recognition starts
    recognition.onstart = () => {
      setIsListening(true)
    }

    // Handle when recognized text is received
    recognition.onresult = (event) => {
      // Get the transcript from the speech recognition results
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")

      // Set the recognized text in the input field
      setInput(transcript)
    }

    // Handle errors in speech recognition
    recognition.onerror = (event) => {
      toast.error(`Speech recognition error: ${event.error}`)
    }

    // Handle when speech recognition ends
    recognition.onend = () => {
      setIsListening(false)
    }

    // Start the speech recognition
    recognition.start()
  }

  return (
    // Main chat container with flexbox layout
    <div className="flex h-full flex-col bg-background">
      {/* Chat header with title and description */}
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold">AI Tutor Chat</h2>
        <p className="text-xs text-muted-foreground">
          Ask questions about your document
        </p>
      </div>

      {/* Messages display area - scrollable container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Show empty state if no messages yet */}
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-2">
              {/* Instruction text for users */}
              <p className="text-sm text-muted-foreground">
                Start a conversation with your AI tutor
              </p>
              <p className="text-xs text-muted-foreground">
                Ask questions about the document
              </p>
              {/* Suggested questions to help users get started */}
              <div className="mt-4 space-y-1">
                <p className="text-xs text-muted-foreground font-medium">
                  Try asking:
                </p>
                <p className="text-xs text-muted-foreground">
                  "Summarize this document"
                </p>
                <p className="text-xs text-muted-foreground">
                  "Explain the main concepts"
                </p>
                <p className="text-xs text-muted-foreground">
                  "What are the key takeaways?"
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Display conversation messages
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Message bubble with different styling for user vs assistant */}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {/* Message content with preserved formatting */}
                <p className="text-sm whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}
        {/* Show loading indicator while AI is processing */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2 flex items-center gap-2">
              {/* Animated spinner icon */}
              <Loader2 className="h-4 w-4 animate-spin" />
              {/* Loading text */}
              <span className="text-sm text-muted-foreground">
                AI is thinking...
              </span>
            </div>
          </div>
        )}
        {/* Reference point for auto-scroll to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area for sending messages */}
      <div className="border-t p-4">
        {/* Form for message submission */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          {/* Text input field for user messages */}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the document..."
            disabled={isLoading}
            className="flex-1"
          />
          {/* Voice input button - toggles speech recognition */}
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleVoiceInput}
            disabled={isListening}
          >
            {/* Microphone icon - red when listening */}
            <Mic
              className={`h-4 w-4 ${
                isListening ? "text-red-500 animate-pulse" : ""
              }`}
            />
          </Button>
          {/* Submit button - disabled while loading or input is empty */}
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            {/* Send icon */}
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {/* Help text for voice input feature */}
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Click the microphone to use voice input
        </p>
      </div>
    </div>
  )
}
