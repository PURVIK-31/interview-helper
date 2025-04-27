"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/protected-route";
import Link from "next/link";

interface FeedbackClientProps {
  id: string;
}

interface FeedbackData {
  overallScore: number;
  feedbackDetails: Array<{
    question: string;
    answer: string;
    feedback: {
      strengths: string[];
      improvements: string[];
      score: number;
      tips: string;
    };
  }>;
  completedAt: string;
}

interface Interview {
  userId: string;
  role: string;
  status: string;
}

function FeedbackContent({ id }: FeedbackClientProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const interviewRef = doc(db, "interviews", id);
        const interviewDoc = await getDoc(interviewRef);
        
        if (!interviewDoc.exists()) {
          setError("Interview not found");
          return;
        }
        
        const interviewData = interviewDoc.data() as Interview;
        
        // Check if the interview belongs to the current user
        if (interviewData.userId !== user.uid) {
          setError("You don't have permission to view this feedback");
          return;
        }
        
        // Check if the interview is completed
        if (interviewData.status !== "completed") {
          router.push(`/interview/${id}`);
          return;
        }
        
        setInterview(interviewData);
        
        // Extract feedback data
        const feedbackData = {
          overallScore: interviewDoc.data().overallScore,
          feedbackDetails: interviewDoc.data().feedbackDetails,
          completedAt: interviewDoc.data().completedAt,
        } as FeedbackData;
        
        setFeedback(feedbackData);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Failed to load feedback");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeedback();
  }, [id, user, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold">Loading feedback...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-500">{error}</h2>
            <p className="text-gray-400">
              Please check that you have the correct link or go back to the dashboard.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!interview || !feedback) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interview Feedback</h1>
          <p className="text-gray-400">
            {interview.role} • {new Date(feedback.completedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="rounded-full bg-blue-900/30 px-4 py-2 text-xl font-bold text-blue-300">
          {feedback.overallScore}/10
        </div>
      </div>

      <div className="mb-8 rounded-lg bg-gray-900 p-6">
        <h2 className="mb-4 text-xl font-bold">Performance Summary</h2>
        <p className="mb-4 text-gray-300">
          Your overall interview performance score is {feedback.overallScore}/10. Below you'll find detailed feedback on each of your responses.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <div className="rounded-full bg-blue-900/20 px-4 py-1 text-sm font-medium text-blue-300">
            Detailed Feedback
          </div>
          <div className="rounded-full bg-green-900/20 px-4 py-1 text-sm font-medium text-green-300">
            Strengths Highlighted
          </div>
          <div className="rounded-full bg-yellow-900/20 px-4 py-1 text-sm font-medium text-yellow-300">
            Improvement Areas
          </div>
        </div>
      </div>

      {feedback.feedbackDetails.map((item, index) => (
        <div key={index} className="mb-6 rounded-lg bg-gray-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Question {index + 1}</h3>
            <div className="rounded-full bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-300">
              Score: {item.feedback.score}/10
            </div>
          </div>
          
          <div className="mb-4 rounded-lg bg-gray-800 p-4">
            <p className="mb-2 font-semibold">Question:</p>
            <p className="text-gray-300">{item.question}</p>
          </div>
          
          <div className="mb-4 rounded-lg bg-gray-800 p-4">
            <p className="mb-2 font-semibold">Your Answer:</p>
            <p className="text-gray-300">{item.answer}</p>
          </div>
          
          <div className="mb-4">
            <p className="mb-2 font-semibold">Strengths:</p>
            <ul className="list-inside list-disc space-y-1 text-green-300">
              {item.feedback.strengths.map((strength, i) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <p className="mb-2 font-semibold">Areas for Improvement:</p>
            <ul className="list-inside list-disc space-y-1 text-yellow-300">
              {item.feedback.improvements.map((improvement, i) => (
                <li key={i}>{improvement}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="mb-2 font-semibold">Tips:</p>
            <p className="text-gray-300">{item.feedback.tips}</p>
          </div>
        </div>
      ))}

      <div className="mt-8 flex gap-4">
        <Link
          href="/dashboard"
          className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 text-center font-medium text-white hover:bg-gray-700"
        >
          Back to Dashboard
        </Link>
        <Link
          href="/interview/create"
          className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white hover:bg-blue-700"
        >
          New Interview
        </Link>
      </div>
    </div>
  );
}

export default function FeedbackClient({ id }: FeedbackClientProps) {
  return (
    <ProtectedRoute>
      <FeedbackContent id={id} />
    </ProtectedRoute>
  );
} 