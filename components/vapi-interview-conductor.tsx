"use client";

import React, { useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import Image from "next/image";

interface VapiInterviewConductorProps {
  interviewId: string;
  role: string;
  type: string;
  level: string;
  questions: string[];
  onComplete: (transcript: string) => void;
}

export default function VapiInterviewConductor({
  interviewId,
  role,
  type,
  level,
  questions,
  onComplete,
}: VapiInterviewConductorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const vapiRef = useRef<any>(null);

  // Format questions for the system prompt
  const questionsText = questions.map((q, i) => `${i+1}. ${q}`).join('\n');

  // Check for microphone permissions upfront
  useEffect(() => {
    async function checkPermissions() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("MediaDevices API not supported in this browser");
          setHasPermission(false);
          return;
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Clean up
        setHasPermission(true);
        console.log("Microphone permission granted");
      } catch (err) {
        console.error("Microphone permission denied:", err);
        setHasPermission(false);
      }
    }
    
    checkPermissions();
  }, []);

  const validateApiKey = (key: string | undefined): boolean => {
    if (!key) {
      console.error("Missing Vapi API key - cannot initialize");
      toast.error("Missing API configuration. Please check your environment variables.");
      return false;
    }
    
    if (!key.startsWith('vapi_')) {
      console.warn("API key may be invalid - should start with 'vapi_'");
    }
    
    return true;
  };

  const startInterview = async () => {
    try {
      setIsLoading(true);
      console.log("Starting interview process...");
      
      if (hasPermission === false) {
        console.error("Microphone permission denied - cannot start interview");
        toast.error("Microphone permission is required. Please enable it in your browser settings.");
        setIsLoading(false);
        return;
      }
      
      // Get API key and validate
      const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY as string;
      console.log("API Key present:", !!apiKey);
      
      if (!validateApiKey(apiKey)) {
        setIsLoading(false);
        return;
      }
      
      // Notify API that we're starting the interview
      const response = await fetch('/api/vapi/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId,
          action: 'start'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to start interview:", errorData);
        toast.error("Failed to start interview: " + (errorData.message || "Unknown error"));
        setIsLoading(false);
        return;
      }
      
      // Create a Vapi instance if it doesn't exist
      if (!vapiRef.current) {
        try {
          console.log("Initializing new Vapi instance...");
          vapiRef.current = new Vapi(apiKey);
          
          // Set up event listeners
          vapiRef.current.on('call-start', (data: any) => {
            console.log("Interview started successfully", data);
            setIsStarted(true);
            setIsLoading(false);
            addToTranscript("Interviewer", "Hello! I'll be conducting your interview today. Let's get started.");
          });
          
          vapiRef.current.on('call-end', (data: any) => {
            console.log("Interview ended with data:", data);
            handleInterviewComplete();
          });
          
          vapiRef.current.on('message', (message: any) => {
            console.log("Message received from Vapi:", message);
            if (message.content) {
              addToTranscript("Interviewer", message.content);
            }
          });
          
          vapiRef.current.on('transcript', (transcript: any) => {
            console.log("Transcript update:", transcript);
            if (transcript.content) {
              addToTranscript("You", transcript.content);
            }
          });
          
          vapiRef.current.on('error', (error: any) => {
            console.error("Vapi error occurred:", error);
            if (error.response) {
              console.error("Response status:", error.response.status);
              console.error("Response data:", error.response.data);
            }
            toast.error("Error during interview. Please try again.");
            setIsLoading(false);
          });
          
          // Handle volume levels for UI feedback
          vapiRef.current.on('volume-level', (level: number) => {
            setCurrentVolume(level);
          });
          
        } catch (error: any) {
          console.error("Failed to initialize Vapi instance:", error);
          toast.error("Failed to initialize voice service. Please try again.");
          setIsLoading(false);
          return;
        }
      }
      
      // Prepare system prompt for the interviewer
      const systemPrompt = `
You are an experienced interviewer conducting a ${type} interview for a ${level} ${role} position.
Your task is to ask the candidate the following predetermined questions one by one:

${questionsText}

Guidelines for conducting the interview:
1. Start by introducing yourself briefly and explaining that you'll be asking a set of questions about their background and experience.
2. Ask only one question at a time and wait for the candidate to respond before moving to the next question.
3. Respond to the candidate's answers with short follow-up questions if needed for clarity.
4. Be professional, friendly, and supportive throughout the interview.
5. Feel free to adapt slightly based on the candidate's responses, but make sure to cover all the predetermined questions.
6. When all questions are completed, thank the candidate for their time and end the interview politely.

This is a voice conversation, so keep your responses concise and natural.
      `;
      
      // Prepare configuration object for Vapi
      const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
      let vapiConfig: any = {};
      
      // If using workflow ID
      if (workflowId) {
        console.log(`Using workflow ID: ${workflowId}`);
        vapiConfig = { workflowId };
      } else {
        // If using custom assistant config
        console.log("Using custom assistant configuration");
        vapiConfig = {
          name: `${role} Interviewer`,
          firstMessage: `Hello! I'm your interviewer today for the ${level} ${role} position. I'll be asking you a series of questions to learn more about your experience and skills. Are you ready to begin?`,
          systemPrompt: systemPrompt,
          transcriber: {
            provider: "deepgram",
            model: "nova-2"
          },
          voice: {
            provider: "11labs",
            voiceId: "rachel"
          },
          model: {
            provider: "openai",
            model: "gpt-4"
          },
          metadata: {
            interviewId: interviewId,
            role: role,
            type: type,
            level: level
          }
        };
      }
      
      // Log the full configuration for debugging
      console.log("Starting Vapi with configuration:", JSON.stringify(vapiConfig, null, 2));
      
      // Start the interview with Vapi
      try {
        await vapiRef.current.start(vapiConfig);
        console.log("Vapi started successfully");
      } catch (error: any) {
        console.error("Failed to start Vapi:", error);
        console.error("Error details:", error.message || "Unknown error");
        
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        }
        
        // Specific error handling based on error codes or messages
        if (error.message?.includes("400")) {
          toast.error("Invalid configuration format. Please check your Vapi settings.");
        } else if (error.message?.includes("401")) {
          toast.error("Authentication failed. Please check your API key.");
        } else {
          toast.error("Failed to connect to voice service. Please try again later.");
        }
        
        setIsLoading(false);
      }
      
    } catch (error: any) {
      console.error("Failed to start interview:", error);
      console.error("Error details:", error.message || "Unknown error");
      toast.error("Failed to start interview");
      setIsLoading(false);
    }
  };

  const stopInterview = async () => {
    console.log("Stopping interview...");
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
        handleInterviewComplete();
      } catch (error) {
        console.error("Error stopping interview:", error);
        toast.error("Error stopping interview");
        handleInterviewComplete(); // Still proceed with completion
      }
    }
  };

  const toggleMute = () => {
    try {
      if (vapiRef.current && isStarted) {
        if (isMuted) {
          vapiRef.current.unmute();
          setIsMuted(false);
          toast.success("Microphone unmuted");
        } else {
          vapiRef.current.mute();
          setIsMuted(true);
          toast.success("Microphone muted");
        }
      }
    } catch (error) {
      console.error("Error toggling mute:", error);
      toast.error("Failed to toggle microphone");
    }
  };

  const addToTranscript = (speaker: string, message: string) => {
    setTranscript(prev => [...prev, `${speaker}: ${message}`]);
  };

  const handleInterviewComplete = async () => {
    console.log("Handling interview completion...");
    setIsStarted(false);
    
    try {
      // Notify API that the interview has ended
      await fetch('/api/vapi/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId,
          action: 'end'
        }),
      });
      
      // Format the transcript and pass it to the parent component
      const formattedTranscript = transcript.join('\n');
      onComplete(formattedTranscript);
      
    } catch (error) {
      console.error("Error completing interview:", error);
      toast.error("Error saving interview results");
      
      // Still call onComplete to move forward
      const formattedTranscript = transcript.join('\n');
      onComplete(formattedTranscript);
    }
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      console.log("Component unmounting - cleaning up Vapi instance");
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (error) {
          console.error("Error cleaning up Vapi instance:", error);
        }
      }
    };
  }, []);

  // If microphone permission is denied
  if (hasPermission === false) {
    return (
      <div className="flex w-full flex-col items-center gap-6 rounded-lg bg-gray-900 p-8">
        <div className="w-full text-center">
          <h2 className="mb-2 text-2xl font-bold text-red-500">
            Microphone Access Required
          </h2>
          <p className="mb-6 text-gray-400">
            This feature requires microphone access to work. Please allow microphone access in your browser and refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-6 rounded-lg bg-gray-900 p-8">
      <div className="w-full text-center">
        <h2 className="mb-2 text-2xl font-bold">
          {isStarted
            ? `${level} ${role} Interview in Progress`
            : `Ready for Your ${level} ${role} Interview?`}
        </h2>
        
        {!isStarted && (
          <p className="mb-6 text-gray-400">
            Our AI interviewer will ask you {questions.length} questions about your experience and skills.
            Speak naturally and clearly when answering.
          </p>
        )}
      </div>
      
      {isStarted && (
        <div className="w-full flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full bg-purple-800 flex items-center justify-center">
            <div className="absolute w-full h-full bg-purple-600 rounded-full animate-ping opacity-50 scale-100" 
                style={{ transform: `scale(${0.8 + (currentVolume * 0.5)})`, opacity: 0.2 + (currentVolume * 0.5) }}></div>
            <Image 
              src="/images/interviewer-avatar.png" 
              alt="AI Interviewer" 
              width={80} 
              height={80} 
              className="rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/default-avatar.png"; // Fallback image
              }}
            />
          </div>
        </div>
      )}
      
      <div className="w-full rounded-lg bg-gray-800 p-4 max-h-64 overflow-y-auto">
        <h3 className="text-lg font-medium mb-2 text-white">Transcript:</h3>
        <div className="space-y-2">
          {transcript.length === 0 ? (
            <p className="text-gray-400 italic">The interview transcript will appear here...</p>
          ) : (
            transcript.map((entry, index) => (
              <div 
                key={index}
                className={`p-2 rounded ${entry.startsWith('Interviewer:') ? 'bg-gray-700' : 'bg-purple-900/30'}`}
              >
                {entry}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="flex w-full gap-4">
        {!isStarted ? (
          <button
            onClick={startInterview}
            disabled={isLoading}
            className="w-full rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? "Starting Interview..." : "Start Interview"}
          </button>
        ) : (
          <div className="flex w-full gap-4">
            <button
              onClick={toggleMute}
              className={`flex-1 rounded-lg px-6 py-3 font-medium text-white border border-gray-700 ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>
            <button
              onClick={stopInterview}
              className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 font-medium text-white hover:bg-gray-700"
            >
              End Interview
            </button>
          </div>
        )}
      </div>
      
      <div className="rounded-lg bg-purple-900/20 p-4 text-sm">
        <p className="font-medium text-purple-400">Interview Tips:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-purple-300">
          <li>Speak clearly and at a normal pace</li>
          <li>Take a moment to think before answering complex questions</li>
          <li>Provide specific examples from your experience</li>
          <li>Be honest about your knowledge and skills</li>
          <li>You can ask the interviewer to repeat a question if needed</li>
        </ul>
      </div>
    </div>
  );
} 