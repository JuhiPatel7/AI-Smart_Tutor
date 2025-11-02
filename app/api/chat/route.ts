// Import Supabase client creation function for server-side authentication
import { createClient } from "@/lib/supabase/server"
// Import generateText function from the Vercel AI SDK for LLM interaction
import { generateText } from "ai"
// Import OpenAI model provider from the AI SDK
import { openai } from "@ai-sdk/openai"

/**
 * POST API Route Handler for Chat
 * This endpoint handles incoming chat requests from the client
 * It authenticates users, processes their messages with context from PDF files,
 * and returns AI-generated responses using OpenAI's gpt-4o-mini model
 * 
 * @param req - The incoming HTTP request containing messages and PDF content
 * @returns JSON response with the AI tutor's message or an error
 */
export async function POST(req: Request) {
  try {
    // Parse the incoming request body to extract messages and PDF content
    const { messages, pdfContent } = await req.json()
    
    // Create a Supabase client instance for authentication
    const supabase = await createClient()
    
    // Get the currently authenticated user from the session
    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    // Check if user is authenticated - return 401 Unauthorized if not
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Construct the system prompt that defines the AI tutor's behavior
    // This prompt includes the PDF content for context-aware responses
    const systemPrompt = `You are an AI tutor helping a student understand their study materials. 
Here is the content from their PDF document:
${pdfContent}
Based on this content, answer the student's questions clearly and helpfully. 
If the question is not related to the document, politely guide them back to the material.
Provide explanations, examples, and break down complex concepts when needed.`
    
    // Call the AI SDK to generate a response from OpenAI
    const { text } = await generateText({
      // Use gpt-4o-mini model for fast, cost-effective responses
      model: openai("gpt-4o-mini"),
      // Construct message history: system prompt + user messages
      messages: [
        { role: "system", content: systemPrompt },
        // Spread the user's message history with proper formatting
        ...messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      // Temperature: 0.7 provides creative but coherent responses (not too random)
      temperature: 0.7,
      // Limit response length to prevent overly long answers
      maxTokens: 1000,
    })
    
    // Return the AI-generated response as JSON
    return Response.json({ message: text })
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[v0] Chat API error:", error)
    
    // Extract error message if available
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    
    // Return a 500 error response with the error details
    return Response.json(
      { error: `Failed to get AI response: ${errorMessage}` },
      { status: 500 }
    )
  }
}
