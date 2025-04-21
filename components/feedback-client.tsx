"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface FeedbackClientProps {
  id: string;
}

export default function FeedbackClient({ id }: FeedbackClientProps) {
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const interviewDoc = await getDoc(doc(db, "interviews", id));
        
        if (!interviewDoc.exists() || interviewDoc.data()?.status !== "completed") {
          notFound();
          return;
        }
        
        setFeedback({ id, ...interviewDoc.data() });
      } catch (err) {
        console.error(err);
        setError("Failed to load feedback");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4">Loading feedback...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="rounded-lg bg-red-900/20 p-6">
          <h2 className="text-xl font-bold text-red-400">Error</h2>
          <p className="mt-2 text-red-300">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!feedback || !feedback.feedbackDetails) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="rounded-lg bg-yellow-900/20 p-6">
          <h2 className="text-xl font-bold text-yellow-400">Feedback Not Available</h2>
          <p className="mt-2 text-yellow-300">
            Feedback for this interview is not available yet. Please complete the interview first.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Interview Feedback</h1>
      
      <div className="space-y-8">
        {feedback.feedbackDetails.map((item: any, index: number) => (
          <div key={index} className="overflow-hidden rounded-lg bg-gray-900">
            <div className="border-b border-gray-800 bg-gray-800 p-4">
              <h3 className="text-lg font-bold">
                Question {index + 1}: {item.question}
              </h3>
            </div>
            
            <div className="space-y-4 p-6">
              <div>
                <h4 className="mb-2 font-medium text-gray-400">Your Answer:</h4>
                <p className="rounded bg-gray-800 p-3">{item.answer}</p>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium text-gray-400">Strengths:</h4>
                <p className="rounded bg-green-900/20 p-3 text-green-300">
                  {item.feedback.strengths}
                </p>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium text-gray-400">Areas for Improvement:</h4>
                <p className="rounded bg-yellow-900/20 p-3 text-yellow-300">
                  {item.feedback.improvements}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <h4 className="font-medium text-gray-400">Score:</h4>
                <div className="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium">
                  {item.feedback.score}/10
                </div>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium text-gray-400">Tips:</h4>
                <ul className="list-inside list-disc space-y-1 rounded bg-blue-900/20 p-3 text-blue-300">
                  {item.feedback.tips.split('\n').map((tip: string, i: number) => (
                    <li key={i}>{tip.trim()}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
        
        <div className="rounded-lg bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-bold">Overall Performance</h2>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Overall Score:</span>
            <span className="rounded-full bg-blue-600 px-4 py-2 text-lg font-bold">
              {feedback.overallScore}/10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 