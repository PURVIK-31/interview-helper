import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { generateFeedback } from "@/lib/gemini";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Fetch the interview from Firestore using Admin SDK
    const interviewRef = adminDb.collection('interviews').doc(id);
    const interviewDoc = await interviewRef.get();
    
    if (!interviewDoc.exists) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }
    
    const interview = interviewDoc.data();
    
    // Handle different action types from Vapi
    switch (body.action) {
      case "getQuestions":
        return NextResponse.json({
          success: true,
          questions: interview?.questions,
        });
        
      case "updateResponse":
        const { questionIndex, response } = body;
        
        const responses = interview?.responses || [];
        
        // Update or add the response
        responses[questionIndex] = {
          question: interview?.questions[questionIndex].question,
          answer: response,
        };
        
        // Update Firestore
        await interviewRef.update({
          responses,
          updatedAt: new Date().toISOString(),
        });
        
        return NextResponse.json({ success: true });
        
      case "generateFeedback":
        // Generate feedback for each question/answer pair
        const feedbackPromises = interview?.responses.map(
          async (response: any) => {
            const feedback = await generateFeedback(
              response.question,
              response.answer,
              interview.role
            );
            
            return {
              ...response,
              feedback,
            };
          }
        );
        
        const feedbackResults = await Promise.all(feedbackPromises);
        
        // Calculate overall score
        const overallScore =
          feedbackResults.reduce(
            (sum: number, item: any) => sum + item.feedback.score,
            0
          ) / feedbackResults.length;
        
        // Create feedback document
        await interviewRef.update({
          feedbackDetails: feedbackResults,
          overallScore: Math.round(overallScore * 10) / 10,
          status: "completed",
          completedAt: new Date().toISOString(),
        });
        
        return NextResponse.json({
          success: true,
          feedbackId: id,
        });
        
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process interview" },
      { status: 500 }
    );
  }
} 