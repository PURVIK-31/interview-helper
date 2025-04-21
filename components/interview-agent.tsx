"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface InterviewAgentProps {
  interviewId: string;
  questions: any[];
}

export default function InterviewAgent({ 
  interviewId, 
  questions 
}: InterviewAgentProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "connecting" | "active" | "completed" | "error">("idle");
  
  const startInterview = async () => {
    try {
      setStatus("connecting");
      
      // Simulating connection
      setTimeout(() => {
        setStatus("active");
        toast.success("Interview started");
      }, 1500);
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to start interview");
      setStatus("error");
    }
  };
  
  const stopInterview = async () => {
    try {
      // Simulating end of interview
      setTimeout(() => {
        setStatus("completed");
        toast.success("Interview completed");
      }, 1000);
      
    } catch (error) {
      console.error(error);
    }
  };
  
  const viewFeedback = () => {
    router.push(`/feedback/${interviewId}`);
  };
  
  return (
    <div className="space-y-6 rounded-lg bg-gray-900 p-6">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-bold">AI Voice Interview</h2>
        <p className="text-gray-400">
          {status === "idle" && "Ready to start your interview"}
          {status === "connecting" && "Connecting to your interviewer..."}
          {status === "active" && "Interview in progress"}
          {status === "completed" && "Interview completed"}
          {status === "error" && "There was an error with the interview"}
        </p>
      </div>
      
      {/* Display questions list */}
      {questions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Interview Questions:</h3>
          <ul className="space-y-2">
            {questions.map((q, index) => (
              <li key={index} className="rounded bg-gray-800 p-3">
                <span className="font-medium">Q{index + 1}:</span> {q.question}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex justify-center gap-4">
        {status === "idle" && (
          <button
            onClick={startInterview}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Start Interview
          </button>
        )}
        
        {status === "active" && (
          <button
            onClick={stopInterview}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            End Interview
          </button>
        )}
        
        {status === "completed" && (
          <button
            onClick={viewFeedback}
            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            View Feedback
          </button>
        )}
        
        {status === "error" && (
          <button
            onClick={startInterview}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        )}
      </div>
      
      <div className="rounded-lg bg-blue-900/20 p-4 text-sm">
        <p className="font-medium text-blue-400">Note:</p>
        <p className="text-blue-300">
          This is a placeholder for the Vapi voice integration. In a production environment, 
          you would need to properly configure the Vapi client and implement the real-time 
          voice interview experience.
        </p>
      </div>
    </div>
  );
} 