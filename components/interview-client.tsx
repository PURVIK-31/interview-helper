"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/protected-route";
import VapiInterviewAgent from "@/components/vapi-interview-agent";
import VapiInterviewConfig from "@/components/vapi-interview-config";

interface InterviewClientProps {
  id: string;
}

interface Interview {
  userId: string;
  role: string;
  type: string;
  experience: string;
  technologies: string;
  questions: Array<{ question: string; type: string }>;
  status: string;
  createdAt: string;
  isVoiceGenerated?: boolean;
}

function InterviewContent({ id }: InterviewClientProps) {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVoiceMode = searchParams.get('mode') === 'voice';
  
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchInterview = async () => {
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
          setError("You don't have permission to view this interview");
          return;
        }
        
        if (interviewData.status === "completed") {
          router.push(`/feedback/${id}`);
          return;
        }
        
        setInterview(interviewData);
        
        // Set configured to true if this is not a voice-generated interview or if mode is not voice
        if (!interviewData.isVoiceGenerated || !isVoiceMode) {
          setIsConfigured(true);
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
        setError("Failed to load interview details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInterview();
  }, [id, user, router, isVoiceMode]);

  const handleInterviewComplete = (responses: any[]) => {
    setInterviewCompleted(true);
    toast.success("Interview completed! Generating feedback...");
  };
  
  const handleVoiceConfig = async (configData: {
    role: string;
    type: string;
    experience: string;
    technologies: string;
  }) => {
    try {
      if (!interview) return;
      
      // Call the API to generate questions based on voice input
      const response = await fetch('/api/vapi/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: id,
          role: configData.role,
          type: configData.type,
          experience: configData.experience,
          technologies: configData.technologies,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate interview questions');
      }
      
      const responseData = await response.json();
      
      // Default to existing questions if API doesn't return any
      const updatedQuestions = responseData.questions || interview.questions;
      
      // Update the interview with the voice-provided data and generated questions
      const interviewRef = doc(db, "interviews", id);
      await updateDoc(interviewRef, {
        role: configData.role,
        type: configData.type,
        experience: configData.experience,
        technologies: configData.technologies,
        questions: updatedQuestions
      });
      
      // Update local state
      setInterview({
        ...interview,
        ...configData,
        questions: updatedQuestions
      });
      
      setIsConfigured(true);
      toast.success("Interview configured via voice");
    } catch (error) {
      console.error("Error updating interview:", error);
      toast.error("Failed to configure interview");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold">Loading interview...</h2>
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

  if (!interview) {
    return null;
  }
  
  // Show the voice configuration component if in voice mode and not yet configured
  if (isVoiceMode && !isConfigured && interview.isVoiceGenerated) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Voice Interview Setup</h1>
            <p className="text-gray-400">
              Configure your interview using voice commands
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded border border-gray-700 bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-700"
            >
              Dashboard
            </button>
          </div>
        </div>
        
        <VapiInterviewConfig interviewId={id} onConfigComplete={handleVoiceConfig} />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{interview.role} Interview</h1>
          <p className="text-gray-400">
            {interview.experience} • {interview.type}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded border border-gray-700 bg-gray-800 px-4 py-2 font-medium text-white hover:bg-gray-700"
          >
            Dashboard
          </button>
        </div>
      </div>

      {interviewCompleted ? (
        <div className="rounded-lg bg-green-900/20 p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold">Interview Completed!</h2>
          <p className="mb-6 text-gray-300">
            Your responses have been recorded. We're generating your feedback.
          </p>
          <button
            onClick={() => router.push(`/feedback/${id}`)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            View Feedback
          </button>
        </div>
      ) : (
        <VapiInterviewAgent
          interviewId={id}
          questions={interview.questions}
          onComplete={handleInterviewComplete}
        />
      )}

      <div className="mt-8 rounded-lg bg-gray-900 p-6">
        <h2 className="mb-4 text-xl font-bold">About This Interview</h2>
        <ul className="space-y-2 text-gray-300">
          <li>
            <span className="font-semibold">Role:</span> {interview.role}
          </li>
          <li>
            <span className="font-semibold">Experience Level:</span> {interview.experience}
          </li>
          <li>
            <span className="font-semibold">Interview Type:</span> {interview.type}
          </li>
          <li>
            <span className="font-semibold">Technologies:</span> {interview.technologies}
          </li>
          <li>
            <span className="font-semibold">Questions:</span> {interview.questions.length}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function InterviewClient({ id }: InterviewClientProps) {
  return (
    <ProtectedRoute>
      <InterviewContent id={id} />
    </ProtectedRoute>
  );
} 