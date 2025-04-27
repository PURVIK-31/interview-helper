import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interviewId, action, feedback } = body;
    
    // Validate request
    if (!interviewId) {
      return NextResponse.json(
        { success: false, message: "Interview ID is required" },
        { status: 400 }
      );
    }
    
    // Get the interview document from Firestore
    const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
    
    if (!interviewDoc.exists()) {
      return NextResponse.json(
        { success: false, message: "Interview not found" },
        { status: 404 }
      );
    }
    
    const interviewData = interviewDoc.data();
    
    // Handle different actions
    switch (action) {
      case "start":
        // Setup for starting the interview
        // In a real implementation, you might create a Vapi workflow or assistant session here
        return NextResponse.json({
          success: true,
          message: "Interview session started",
          interviewData: {
            role: interviewData.role,
            type: interviewData.type,
            level: interviewData.level,
            questions: interviewData.questions,
            workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID || null,
          }
        });
        
      case "end":
        // Handle ending the interview
        // Update the interview document to mark it as completed
        await updateDoc(doc(db, "interviews", interviewId), {
          completed: true,
          completedAt: new Date().toISOString()
        });
        
        return NextResponse.json({
          success: true,
          message: "Interview session ended",
        });
        
      case "save_feedback":
        // Save feedback from the interview
        if (!feedback) {
          return NextResponse.json(
            { success: false, message: "Feedback is required" },
            { status: 400 }
          );
        }
        
        // Update the interview document with the feedback
        await updateDoc(doc(db, "interviews", interviewId), {
          feedback,
          feedbackSavedAt: new Date().toISOString()
        });
        
        return NextResponse.json({
          success: true,
          message: "Interview feedback saved",
        });
        
      default:
        return NextResponse.json(
          { success: false, message: "Unknown action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in interview handler:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to process interview request",
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}

// GET method for testing the endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Interview endpoint is active and ready",
    status: "online",
    info: "This endpoint handles interview sessions with Vapi",
    workflowId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID || "Not configured",
    usageInstructions: {
      start: "POST with {interviewId, action: 'start'} to begin an interview",
      end: "POST with {interviewId, action: 'end'} to complete an interview",
      saveFeedback: "POST with {interviewId, action: 'save_feedback', feedback: {...}} to save interview feedback"
    }
  });
} 