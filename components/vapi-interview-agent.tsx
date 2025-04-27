"use client";

import React, { useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import clsx from "clsx";

interface VapiInterviewAgentProps {
  interviewId: string;
  questions: Array<{ question: string; type: string }>;
  onComplete: (responses: any[]) => void;
}

export default function VapiInterviewAgent({
  interviewId,
  questions,
  onComplete,
}: VapiInterviewAgentProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const vapiRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  // Update progress bar animation
  useEffect(() => {
    if (progressRef.current && isStarted) {
      gsap.to(progressRef.current, {
        width: `${((currentQuestion + 1) / questions.length) * 100}%`,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [currentQuestion, isStarted, questions.length]);

  // Check for microphone permissions upfront
  useEffect(() => {
    async function checkPermissions() {
      try {
        // Check if navigator.mediaDevices is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("MediaDevices API not supported in this browser");
          setHasPermission(false);
          return;
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // If we get here, permission was granted
        stream.getTracks().forEach(track => track.stop()); // Clean up
        setHasPermission(true);
      } catch (err) {
        console.error("Microphone permission denied:", err);
        setHasPermission(false);
      }
    }
    
    checkPermissions();
  }, []);

  const startInterview = async () => {
    try {
      setIsLoading(true);
      
      // Check permissions again
      if (hasPermission === false) {
        toast.error("Microphone permission is required. Please enable it in your browser settings.");
        setIsLoading(false);
        return;
      }
      
      // Create a Vapi instance if it doesn't exist
      if (!vapiRef.current) {
        const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY as string;
        console.log("Initializing Vapi with API key:", apiKey ? "API key exists" : "API key missing");
        
        vapiRef.current = new Vapi(apiKey);
        
        // Set up event listeners
        vapiRef.current.on('call-start', () => {
          console.log("Interview started");
          setIsStarted(true);
          setIsLoading(false);
        });
        
        vapiRef.current.on('call-end', () => {
          console.log("Interview ended");
          handleInterviewComplete();
        });
        
        vapiRef.current.on('message', (message: any) => {
          console.log("Message received:", message);
          if (message.role === "function" && message.content) {
            try {
              const functionData = JSON.parse(message.content);
              
              if (functionData.action === "nextQuestion") {
                setCurrentQuestion((prev) => prev + 1);
              } else if (functionData.action === "saveResponse") {
                const { questionIndex, response } = functionData;
                
                setResponses((prev) => {
                  const newResponses = [...prev];
                  newResponses[questionIndex] = {
                    question: questions[questionIndex].question,
                    answer: response,
                  };
                  return newResponses;
                });
              }
            } catch (error) {
              console.error("Error processing function call:", error);
            }
          }
        });
        
        vapiRef.current.on('error', (error: any) => {
          console.error("Vapi agent error event occurred. Error type:", typeof error, "Stringified:", JSON.stringify(error));
          console.error("Full error object from agent event:", error); // Log the raw object
          toast.error("Error during interview session. Please check console and network tab.");
          setIsLoading(false);
        });
      }
      
      // Format questions for the system prompt
      const formattedQuestions = questions.map((q, index) => 
        `${index + 1}. ${q.question} (${q.type})`
      ).join('\n');
      
      // Start the conversation with the assistant
      console.log(`Starting interview with ${questions.length} questions`);
      try {
        await vapiRef.current.start({
          name: "Interview Assistant",
          firstMessage: "Hello, I'll be conducting your interview today. Let's begin with the first question.",
          transcriber: {
            provider: "deepgram",
            model: "nova-2", 
            language: "en",
          },
          voice: {
            provider: "11labs",
            voiceId: "rachel",
          },
          model: {
            provider: "openai",
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `You are an AI interview assistant conducting a job interview.
                
Your task is to ask the following ${questions.length} questions one at a time:

${formattedQuestions}

Ask ONE question at a time and wait for the candidate to respond. Listen to their answer and only move to the next question after they have finished answering. Don't rush through the questions.

At the start, introduce yourself briefly and then ask the first question.

When you're ready to move to a new question, use the function "nextQuestion" to advance to the next question.

After each answer, use the function "saveResponse" to record their answer.

After all questions have been asked and answered, thank the candidate for their time and end the interview.`
              }
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "nextQuestion",
                  description: "Move to the next question in the interview",
                  parameters: {
                    type: "object",
                    properties: {},
                    required: []
                  }
                }
              },
              {
                type: "function",
                function: {
                  name: "saveResponse",
                  description: "Save the candidate's response to a question",
                  parameters: {
                    type: "object",
                    properties: {
                      questionIndex: {
                        type: "number",
                        description: "The index of the question that was answered"
                      },
                      response: {
                        type: "string",
                        description: "The candidate's response to the question"
                      }
                    },
                    required: ["questionIndex", "response"]
                  }
                }
              }
            ]
          },
          metadata: {
            interviewId: interviewId,
            questions: JSON.stringify(questions),
          }
        });
      } catch (error: any) {
        console.error("Failed to start Vapi agent. Error type:", typeof error, "Stringified:", JSON.stringify(error));
        console.error("Full error object from agent catch:", error); // Log the raw object
        console.error("Agent start error details (if available):", error?.message, "Stack:", error?.stack);

        if (error?.response) {
          console.error("Agent start response status:", error.response.status);
          console.error("Agent start response data:", error.response.data);
        }

        toast.error("Failed to connect to voice service for interview. Check console and network tab.");
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error("Failed to start interview:", error);
      toast.error("Failed to start interview");
      setIsLoading(false);
    }
  };

  const handleInterviewComplete = async () => {
    // Ensure responses state reflects the actual recorded data
    console.log("Handling interview completion with responses:", responses);
    
    try {
      // Send responses to the API to save
      const response = await fetch(`/api/interview/${interviewId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateResponse", // Ensure this matches your API endpoint logic
          responses,
        }),
      });

      if (!response.ok) {
        // Log detailed error from backend if possible
        let errorBody = "Could not read error body";
        try {
          errorBody = await response.text(); // Use text() first, might not be JSON
        } catch {}
        console.error(`Failed to save responses. Status: ${response.status}. Body: ${errorBody}`);
        throw new Error(`Failed to save responses: ${response.statusText} (${response.status})`);
      }
      
      console.log("Responses saved successfully via API.");
      onComplete(responses); // Call onComplete only after successful save

    } catch (error: any) {
      console.error("Error saving responses via API:", error);
      // Log the specific fetch error
      if (error.message === 'Failed to fetch') {
        console.error("Fetch failed: Could not connect to the API endpoint. Is the server running?");
      }
      toast.error("Failed to save your responses. Please check console.");
      // Decide if you still want to call onComplete even if saving failed
      // onComplete(responses); 
    }
  };

  const generateFeedback = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/interview/${interviewId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "generateFeedback",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate feedback");
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success("Feedback generated successfully");
        window.location.href = `/feedback/${interviewId}`;
      } else {
        throw new Error(data.message || "Failed to generate feedback");
      }
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast.error("Failed to generate feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const stopInterview = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      toast.info("Interview stopped");
    }
  };

  useEffect(() => {
    // Cleanup function
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  if (hasPermission === false) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full flex-col items-center gap-6 rounded-xl bg-gradient-to-br from-red-900/40 to-red-950 p-8 backdrop-blur-sm border border-red-800/30 shadow-xl"
      >
        <div className="w-full text-center">
          <h2 className="font-display mb-3 text-2xl font-bold text-red-400 text-glow">
            Microphone Access Required
          </h2>
          <p className="mb-6 text-gray-300 font-body">
            This feature requires microphone access to work. Please allow microphone access in your browser and refresh the page.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="btn-hover-effect rounded-lg bg-red-500 px-6 py-3 font-medium text-white shadow-lg hover:bg-red-600 transition-all duration-300"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      ref={containerRef}
      className="flex w-full flex-col items-center gap-8 rounded-xl bg-gradient-to-br from-gray-900/80 to-slate-950 p-10 backdrop-blur-sm border border-slate-800/30 shadow-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress bar */}
      {isStarted && (
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            ref={progressRef} 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
            style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
          ></div>
        </div>
      )}

      <div className="w-full text-center">
        <AnimatePresence mode="wait">
          <motion.h2 
            key={`title-${isStarted ? "started" : "not-started"}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="mb-4 font-display text-3xl font-bold text-white text-glow"
          >
            {isStarted
              ? `Question ${currentQuestion + 1} of ${questions.length}`
              : "Ready to Begin Your Interview?"}
          </motion.h2>
        </AnimatePresence>
        
        {!isStarted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="mb-6 text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              You'll be interviewed by our AI assistant. Please ensure your microphone is enabled for this interactive session.
            </p>
            
            <div className="flex flex-row gap-6 items-center justify-center mb-6">
              <div className="flex items-center bg-slate-800/50 rounded-lg p-4 max-w-md">
                <div className="mr-4 text-3xl text-blue-400">💬</div>
                <p className="text-gray-300 text-sm text-left">
                  Speak clearly and naturally as you would in a real interview.
                </p>
              </div>
              
              <div className="flex items-center bg-slate-800/50 rounded-lg p-4 max-w-md">
                <div className="mr-4 text-3xl text-indigo-400">🔊</div>
                <p className="text-gray-300 text-sm text-left">
                  Ensure your volume is turned up to hear the questions.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        <AnimatePresence mode="wait">
          {isStarted && (
            <motion.div 
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-8 rounded-xl glass bg-slate-800/40 p-6 text-left border border-slate-700/50 shadow-lg"
            >
              <p className="mb-3 font-semibold text-blue-300">Current Question:</p>
              <p className="text-white text-xl font-display leading-relaxed">
                {currentQuestion < questions.length
                  ? questions[currentQuestion].question
                  : "All questions completed!"}
              </p>
              
              {/* Audio visualization indicator */}
              {currentQuestion < questions.length && (
                <div className="flex justify-start gap-1 mt-4">
                  <div className="pulse h-2 w-2 rounded-full bg-blue-400"></div>
                  <div className="pulse h-2 w-2 rounded-full bg-blue-400" style={{ animationDelay: "0.2s" }}></div>
                  <div className="pulse h-2 w-2 rounded-full bg-blue-400" style={{ animationDelay: "0.4s" }}></div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex w-full gap-4">
        {!isStarted ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={startInterview}
            disabled={isLoading}
            className={clsx(
              "w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-4 font-display text-lg font-medium text-white shadow-lg hover:from-blue-500 hover:to-indigo-600 transition-all duration-300 border border-blue-500/30",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Starting Interview...</span>
              </div>
            ) : (
              "Begin Interview"
            )}
          </motion.button>
        ) : (
          <div className="flex w-full gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={stopInterview}
              className="flex-1 rounded-xl border border-slate-700/50 bg-slate-800/70 px-6 py-4 font-medium text-white shadow-md hover:bg-slate-700/80 transition-all duration-300"
            >
              Stop Interview
            </motion.button>
            
            {currentQuestion >= questions.length && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateFeedback}
                disabled={isLoading}
                className={clsx(
                  "flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 font-medium text-white shadow-lg hover:from-emerald-500 hover:to-teal-600 transition-all duration-300 border border-emerald-500/30",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Generating Feedback...</span>
                  </div>
                ) : (
                  "Get My Feedback"
                )}
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
} 