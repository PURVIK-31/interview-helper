import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For initial Vapi setup, just return a success response with the received data
    return NextResponse.json({
      success: true,
      message: "Vapi endpoint ready for integration",
      receivedData: body,
      // Mock some interview questions for testing
      questions: [
        {
          question: "Tell me about yourself and your experience.",
          type: "behavioral"
        },
        {
          question: "What are your strengths and weaknesses?",
          type: "behavioral"
        },
        {
          question: "Describe a challenging project you worked on.",
          type: "behavioral"
        }
      ]
    });
  } catch (error) {
    console.error("Error in Vapi handler:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to process request" 
      },
      { status: 500 }
    );
  }
}

// GET method for testing the endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Vapi endpoint is active and ready for integration",
    status: "online"
  });
} 