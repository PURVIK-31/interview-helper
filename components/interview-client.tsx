"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import InterviewAgent from "@/components/interview-agent";

interface InterviewClientProps {
  id: string;
}

export default function InterviewClient({ id }: InterviewClientProps) {
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const interviewDoc = await getDoc(doc(db, "interviews", id));
        
        if (!interviewDoc.exists()) {
          notFound();
          return;
        }
        
        setInterview({ id, ...interviewDoc.data() });
      } catch (err) {
        console.error(err);
        setError("Failed to load interview");
      } finally {
        setLoading(false);
      }
    };
    
    fetchInterview();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4">Loading interview...</p>
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
  
  if (!interview) {
    return notFound();
  }
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-3xl font-bold">{interview.role} Interview</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg bg-gray-900 p-6">
            <h2 className="mb-4 text-xl font-bold">Interview Details</h2>
            <dl className="space-y-3">
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-400">Role:</dt>
                <dd className="col-span-2">{interview.role}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-400">Type:</dt>
                <dd className="col-span-2 capitalize">{interview.type}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-400">Experience:</dt>
                <dd className="col-span-2 capitalize">{interview.experience}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-400">Technologies:</dt>
                <dd className="col-span-2">{interview.technologies}</dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium text-gray-400">Questions:</dt>
                <dd className="col-span-2">{interview.questions.length}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div>
          <InterviewAgent interviewId={id} questions={interview.questions} />
        </div>
      </div>
    </div>
  );
} 