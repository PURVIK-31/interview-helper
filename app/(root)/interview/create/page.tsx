"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { generateInterviewQuestions } from "@/lib/gemini";
import { toast } from "sonner";
import ProtectedRoute from "@/components/protected-route";

const interviewSchema = z.object({
  role: z.string().min(3, "Job role must be at least 3 characters"),
  type: z.enum(["technical", "behavioral", "mixed"], {
    errorMap: () => ({ message: "Please select an interview type" }),
  }),
  experience: z.enum(["junior", "mid", "senior"], {
    errorMap: () => ({ message: "Please select an experience level" }),
  }),
  questions: z.number().min(1).max(10),
  technologies: z.string().min(3, "Please specify at least one technology"),
});

type InterviewFormValues = z.infer<typeof interviewSchema>;

function CreateInterviewForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  
  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      role: "",
      type: "technical",
      experience: "mid",
      questions: 5,
      technologies: "",
    },
  });
  
  const onSubmit = async (values: InterviewFormValues) => {
    try {
      setIsLoading(true);
      
      if (!auth.currentUser) {
        toast.error("You must be signed in to create an interview");
        router.push("/sign-in");
        return;
      }
      
      // Generate questions using Gemini AI
      const questions = await generateInterviewQuestions(
        values.role,
        values.type,
        values.experience,
        values.technologies,
        values.questions
      );
      
      // Save to Firestore
      const interviewRef = await addDoc(collection(db, "interviews"), {
        userId: auth.currentUser.uid,
        role: values.role,
        type: values.type,
        experience: values.experience,
        technologies: values.technologies,
        questions,
        createdAt: new Date().toISOString(),
        status: "pending",
      });
      
      toast.success("Interview created successfully");
      router.push(`/interview/${interviewRef.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create interview");
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceInterview = async () => {
    try {
      setIsVoiceLoading(true);
      
      if (!auth.currentUser) {
        toast.error("You must be signed in to create an interview");
        router.push("/sign-in");
        return;
      }

      // Default questions for voice interviews
      const defaultQuestions = [
        {
          question: "Tell me about your experience and background.",
          type: "behavioral"
        },
        {
          question: "What are your primary technical skills?",
          type: "technical"
        },
        {
          question: "What kind of role are you looking for?",
          type: "behavioral"
        },
        {
          question: "What level of experience do you have?",
          type: "behavioral"
        },
        {
          question: "What technologies are you most interested in discussing?",
          type: "technical"
        }
      ];
      
      // Save to Firestore with placeholder data that will be updated by Vapi
      const interviewRef = await addDoc(collection(db, "interviews"), {
        userId: auth.currentUser.uid,
        role: "Voice Generated",
        type: "mixed",
        experience: "determined by voice",
        technologies: "determined by voice",
        questions: defaultQuestions,
        createdAt: new Date().toISOString(),
        status: "pending",
        isVoiceGenerated: true  // Flag to indicate this was created via voice
      });
      
      toast.success("Voice interview created");
      router.push(`/interview/${interviewRef.id}?mode=voice`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create voice interview");
    } finally {
      setIsVoiceLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-2xl py-12">
      <div className="mb-8 text-center">
        <button
          onClick={startVoiceInterview}
          disabled={isVoiceLoading}
          className="rounded-md bg-purple-600 px-6 py-4 font-medium text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {isVoiceLoading ? "Starting Voice Interview..." : "🎤 Quick Start with Voice"}
        </button>
        <p className="mt-2 text-gray-400">Use voice to describe your interview needs - no form needed!</p>
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-950 px-4 text-sm text-gray-400">Or fill out the form below</span>
        </div>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-900 p-8">
        <div>
          <h1 className="text-3xl font-bold">Create an Interview</h1>
          <p className="text-gray-400">Set up your AI interview session</p>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="role">
              Job Role
            </label>
            <input
              id="role"
              placeholder="e.g. Frontend Developer"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 focus:border-blue-500 focus:outline-none"
              {...form.register("role")}
            />
            {form.formState.errors.role && (
              <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>
            )}
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="type">
                Interview Type
              </label>
              <select
                id="type"
                className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 focus:border-blue-500 focus:outline-none"
                {...form.register("type")}
              >
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="mixed">Mixed</option>
              </select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="experience">
                Experience Level
              </label>
              <select
                id="experience"
                className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 focus:border-blue-500 focus:outline-none"
                {...form.register("experience")}
              >
                <option value="junior">Junior</option>
                <option value="mid">Mid-Level</option>
                <option value="senior">Senior</option>
              </select>
              {form.formState.errors.experience && (
                <p className="text-sm text-red-500">{form.formState.errors.experience.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="technologies">
              Technologies/Skills
            </label>
            <input
              id="technologies"
              placeholder="e.g. React, TypeScript, Next.js"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 focus:border-blue-500 focus:outline-none"
              {...form.register("technologies")}
            />
            {form.formState.errors.technologies && (
              <p className="text-sm text-red-500">{form.formState.errors.technologies.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="questions">
              Number of Questions
            </label>
            <input
              id="questions"
              type="number"
              min="1"
              max="10"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 focus:border-blue-500 focus:outline-none"
              {...form.register("questions", { valueAsNumber: true })}
            />
            {form.formState.errors.questions && (
              <p className="text-sm text-red-500">{form.formState.errors.questions.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Creating Interview..." : "Create Interview"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CreateInterviewPage() {
  return (
    <ProtectedRoute>
      <CreateInterviewForm />
    </ProtectedRoute>
  );
} 