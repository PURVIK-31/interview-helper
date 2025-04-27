import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateInterviewQuestions } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interviewId, role, type, experience, technologies, fromVoice } = body;
    
    // If this is a direct call from the Vapi assistant (which happens in the background)
    // We can extract and store the data in Firebase
    if (fromVoice) {
      // In a real implementation, you would fetch the data from Vapi's API
      // using the conversation ID that was created during the voice session
      
      // For now, we'll mock some data
      const mockData = {
        role: "Software Engineer",
        type: "technical",
        experience: "mid",
        technologies: "JavaScript, React, Node.js",
      };
      
      // Generate questions using the mock data
      const questions = await generateInterviewQuestions(
        mockData.role,
        mockData.type,
        mockData.experience,
        mockData.technologies,
        5 // Default to 5 questions
      );
      
      // Return the generated data to be used by the client
      return NextResponse.json({
        success: true,
        message: "Interview configuration retrieved from voice session",
        role: mockData.role,
        type: mockData.type,
        experience: mockData.experience,
        technologies: mockData.technologies,
        questions,
      });
    }
    
    // If this is a standard request with all parameters
    if (interviewId && role && type && experience && technologies) {
      const questionCount = 5; // Default to 5 questions
      
      // Generate the questions using Gemini
      const questions = await generateInterviewQuestions(
        role,
        type,
        experience,
        technologies,
        questionCount
      );
      
      return NextResponse.json({
        success: true,
        message: "Interview questions generated successfully",
        questions,
        role,
        type,
        experience,
        technologies
      });
    }
    
    // For unrecognized requests or requests without required parameters
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