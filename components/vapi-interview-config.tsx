"use client";

import React, { useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface VapiInterviewConfigProps {
  interviewId: string;
  onConfigComplete: (configData: {
    role: string;
    type: string;
    experience: string;
    technologies: string;
  }) => void;
}

// Animated background pattern component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{
              x: [
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
              ],
              y: [
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
              ],
              opacity: [
                Math.random() * 0.3 + 0.1,
                Math.random() * 0.3 + 0.1,
                Math.random() * 0.3 + 0.1,
              ],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: Math.random() * 300 + 50 + "px",
              height: Math.random() * 300 + 50 + "px",
              filter: "blur(40px)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Audio Visualization component
const AudioVisualizer = ({ isActive }: { isActive: boolean }) => {
  const barCount = 8;

  return (
    <div className="flex h-12 items-center justify-center gap-1">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-purple-400"
          initial={{ height: 5 }}
          animate={{
            height: isActive
              ? [
                  5,
                  Math.random() * 20 + 10,
                  5,
                  Math.random() * 30 + 20,
                  5,
                ]
              : 5,
          }}
          transition={{
            duration: isActive ? 1.2 : 0,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

export default function VapiInterviewConfig({
  interviewId,
  onConfigComplete,
}: VapiInterviewConfigProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [configProgress, setConfigProgress] = useState(0);
  const vapiRef = useRef<any>(null);

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
        console.log("Microphone permission granted");
      } catch (err) {
        console.error("Microphone permission denied:", err);
        setHasPermission(false);
      }
    }
    
    checkPermissions();
  }, []);

  // Simulate voice activity with pulse animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted) {
      interval = setInterval(() => {
        setPulseAnimation(prev => !prev);
      }, 2000);
      setIsListening(true);
      
      // Simulate configuration progress
      const progressInterval = setInterval(() => {
        setConfigProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return Math.min(prev + Math.random() * 5, 100);
        });
      }, 1500);
      
      return () => {
        clearInterval(interval);
        clearInterval(progressInterval);
      };
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStarted]);

  const validateApiKey = (key: string | undefined): boolean => {
    if (!key) {
      console.error("Missing Vapi API key - cannot initialize");
      toast.error("Missing API configuration. Please check your environment variables.");
      return false;
    }
    
    // Vapi API keys are UUIDs
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)) {
      console.warn("API key may be invalid - should be a UUID format");
      toast.error("Invalid API key format. Please check your Vapi API key.");
      return false;
    }
    
    return true;
  };

  const startVoiceConfig = async () => {
    try {
      setIsLoading(true);
      setConfigProgress(0);
      console.log("Starting voice configuration process...");
      
      // Check permissions again
      if (hasPermission === false) {
        console.error("Microphone permission denied - cannot start voice config");
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
      
      // Create a Vapi instance if it doesn't exist
      if (!vapiRef.current) {
        try {
          console.log("Initializing new Vapi instance...");
          vapiRef.current = new Vapi(apiKey);
          
          // Set up event listeners
          vapiRef.current.on('call-start', (data: any) => {
            console.log("Voice configuration started successfully", data);
            setIsStarted(true);
            setIsLoading(false);
          });
          
          vapiRef.current.on('call-end', (data: any) => {
            console.log("Voice configuration ended with data:", data);
            handleConfigComplete();
          });
          
          vapiRef.current.on('message', (message: any) => {
            console.log("Message received from Vapi:", message);
          });
          
          vapiRef.current.on('error', (error: any) => {
            console.error("Vapi error event occurred. Error type:", typeof error, "Stringified:", JSON.stringify(error));
            console.error("Full error object:", error); // Log the raw object too
            // Log additional details if available
            if (error?.response) {
              console.error("Response status:", error.response.status);
              console.error("Response data:", error.response.data);
            }
            toast.error("Error during voice configuration. Please check console and network tab.");
            setIsLoading(false);
          });
        } catch (error: any) {
          console.error("Failed to initialize Vapi instance:", error);
          toast.error("Failed to initialize voice service. Please try again.");
          setIsLoading(false);
          return;
        }
      }
      
      // Prepare configuration object for Vapi
      const vapiConfig = {
        name: "Interview Configuration Assistant",
        firstMessage: "Hello, I'll help you configure your interview. What job role and experience level are you interested in?",
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en"
        },
        voice: {
          provider: "11labs",
          voiceId: "rachel"
        },
        model: {
          provider: "google",
          model: "gemini-2.0-flash-lite",
          messages: [
            {
              role: "system",
              content: "You are an assistant that helps configure interview settings. Ask the user about their desired job role, experience level (junior, mid, senior), and technologies they'd like to focus on. Keep responses concise and natural."
            }
          ]
        },
        metadata: {
          interviewId: interviewId
        },
        silenceTimeoutSeconds: 30,
        maxDurationSeconds: 600,
        backgroundSound: "off",
        backgroundDenoisingEnabled: false
      };
      
      // Log the full configuration for debugging
      console.log("Starting Vapi with configuration:", JSON.stringify(vapiConfig, null, 2));
      
      // Start the conversation with the specific Vapi assistant
      try {
        await vapiRef.current.start(vapiConfig);
        console.log("Vapi started successfully");
      } catch (error: any) {
        console.error("Failed to start Vapi. Error type:", typeof error, "Stringified:", JSON.stringify(error));
        console.error("Full error object from catch:", error); // Log the raw object
        console.error("Error details (if available):", error?.message, "Stack:", error?.stack);
        
        if (error?.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        }
        
        // Specific error handling based on error codes or messages
        if (error?.message?.includes("400")) {
          toast.error("Invalid configuration format. Please check your Vapi settings.");
        } else if (error?.message?.includes("401")) {
          toast.error("Authentication failed. Please check your API key.");
        } else {
          toast.error("Failed to connect to voice service. Check console and network tab.");
        }
        
        setIsLoading(false);
      }
      
    } catch (error: any) {
      console.error("Failed to start voice configuration:", error);
      console.error("Error details:", error.message || "Unknown error");
      toast.error("Failed to start voice configuration");
      setIsLoading(false);
    }
  };

  const handleConfigComplete = async () => {
    console.log("Handling configuration completion...");
    // After the voice interaction is complete, fetch the generated data from the API
    try {
      const requestData = {
        interviewId,
        fromVoice: true
      };
      console.log("Sending request to /api/vapi/generate with data:", requestData);
      
      const response = await fetch('/api/vapi/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log("API response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to generate interview configuration: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response data:", data);
      
      if (!data.success) {
        throw new Error(data.message || 'API returned unsuccessful response');
      }
      
      // Get configuration data from API response
      const configData = {
        role: data.role || "General Interview",
        type: data.type || "mixed",
        experience: data.experience || "mid",
        technologies: data.technologies || "General Skills",
      };
      
      console.log("Configuration complete with data:", configData);
      
      // Pass the data back to the parent component
      onConfigComplete(configData);
      
    } catch (error: any) {
      console.error("Error completing configuration:", error);
      console.error("Error details:", error.message || "Unknown error");
      toast.error("Failed to complete configuration");
      
      // Use fallback data if API fails
      const fallbackData = {
        role: "General Interview",
        type: "mixed",
        experience: "mid",
        technologies: "General Skills",
      };
      
      console.log("Using fallback configuration data:", fallbackData);
      onConfigComplete(fallbackData);
    }
  };

  const stopVoiceConfig = () => {
    console.log("Stopping voice configuration...");
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
        handleConfigComplete();
      } catch (error) {
        console.error("Error stopping voice configuration:", error);
        toast.error("Error stopping voice configuration");
        handleConfigComplete(); // Still proceed with completion
      }
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

  if (hasPermission === false) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex w-full flex-col items-center gap-6 rounded-2xl bg-gradient-to-br from-red-950 to-gray-900 p-8 shadow-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="w-full text-center relative z-10">
          <motion.h2 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-2 text-2xl font-bold text-red-400 font-sans"
          >
            Microphone Access Required
          </motion.h2>
          <p className="mb-6 text-gray-300 font-medium">
            This feature requires microphone access to work. Please allow microphone access in your browser and refresh the page.
          </p>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg className="mx-auto h-20 w-20 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19v2m0 0a8 8 0 01-8-8m8 8a8 8 0 008-8m-8-5v4m0-9a5 5 0 015 5v6a5 5 0 01-10 0V7a5 5 0 015-5z"></path>
            </svg>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex w-full flex-col items-center gap-6 rounded-2xl bg-gradient-to-br from-indigo-950 to-gray-900 p-8 shadow-2xl border border-indigo-500/20 overflow-hidden"
    >
      {/* Dynamic background animation */}
      <AnimatedBackground />
      
      {/* Main content */}
      <div className="w-full text-center relative z-10">
        <AnimatePresence mode="wait">
          {!isStarted ? (
            <motion.h2 
              key="ready-title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300 font-sans tracking-tight"
            >
              Ready to Configure Your Interview?
            </motion.h2>
          ) : (
            <motion.h2 
              key="started-title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-2 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 font-sans tracking-tight"
            >
              Configuring Your Interview
            </motion.h2>
          )}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {!isStarted && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 text-gray-300 font-light text-lg max-w-2xl mx-auto"
            >
              Use your voice to tell us about the job role, skills, and experience level for your interview.
            </motion.p>
          )}
          
          {isStarted && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 rounded-xl bg-indigo-900/30 p-6 text-left backdrop-blur-sm border border-indigo-500/30 shadow-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-grid-white-pattern opacity-[0.03]" />
              
              <div className="flex items-center mb-3 relative">
                <div className="relative mr-3">
                  <motion.div
                    animate={{ 
                      scale: pulseAnimation ? [1, 1.2, 1] : 1,
                      opacity: pulseAnimation ? [0.7, 1, 0.7] : 0.7
                    }}
                    transition={{ duration: 1.5, repeat: isListening ? Infinity : 0 }}
                    className="absolute inset-0 rounded-full bg-purple-500/50 blur-md"
                  />
                  <svg className="relative h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                  </svg>
                </div>
                <p className="font-bold text-purple-300 text-xl">Voice Assistant is Listening</p>
              </div>
              
              <p className="text-gray-200 font-medium mb-4 relative">
                Tell me about the job role, experience level, and technologies you want to focus on.
              </p>
              
              {/* Audio visualizer */}
              <AudioVisualizer isActive={isListening} />
              
              {/* Progress bar */}
              <div className="mt-4 w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${configProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>Configuration progress</span>
                <span>{Math.round(configProgress)}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2 }}
            onClick={startVoiceConfig}
            disabled={isLoading}
            className="w-full max-w-md rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 font-medium text-white hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 shadow-lg shadow-purple-900/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
            whileHover={{ boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.5)" }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Button shine effect */}
            <motion.div 
              className="absolute inset-0 w-20 h-full bg-white/20 skew-x-12 transform -translate-x-40"
              animate={{ x: ["0%", "200%"] }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "mirror", 
                duration: 2,
                ease: "easeInOut",
                repeatDelay: 2
              }}
            />
            
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting Voice Configuration...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
                Start Voice Configuration
              </span>
            )}
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2 }}
            onClick={stopVoiceConfig}
            className="w-full max-w-md rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 px-6 py-4 font-medium text-white hover:bg-white/20 transition-all duration-300 shadow-lg transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
            whileHover={{ boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Complete Configuration
            </span>
          </motion.button>
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6 text-sm backdrop-blur-sm border border-purple-500/20 shadow-lg relative overflow-hidden w-full max-w-md"
      >
        <div className="absolute inset-0 bg-grid-white-pattern opacity-[0.03]" />
        
        <div className="relative">
          <p className="font-bold text-purple-300 text-lg mb-3">How to use:</p>
          <ul className="mt-2 space-y-3 pl-5 text-gray-300">
            {[
              "Click \"Start Voice Configuration\" and allow microphone access",
              "Tell the assistant about the job role you're interviewing for",
              "Specify your experience level (junior, mid, senior)",
              "Mention technologies and skills relevant to the position",
              "The assistant will configure your interview automatically"
            ].map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="flex items-start"
              >
                <svg className="mr-2 h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
      
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-10 right-10 w-20 h-20 rounded-full bg-purple-500/10 backdrop-blur-xl z-0"
        animate={{
          y: [0, 15, 0],
          x: [0, 5, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-indigo-500/10 backdrop-blur-xl z-0"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, -10, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
} 