"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProtectedRoute from "@/components/protected-route";

interface Interview {
  id: string;
  role: string;
  type: string;
  experience: string;
  createdAt: string;
  status: string;
}

function DashboardContent() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchInterviews = async () => {
      try {
        const interviewsQuery = query(
          collection(db, "interviews"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(interviewsQuery);
        const interviewData: Interview[] = [];
        
        querySnapshot.forEach((doc) => {
          interviewData.push({
            id: doc.id,
            ...doc.data(),
          } as Interview);
        });
        
        setInterviews(interviewData);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInterviews();
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
        <div className="text-gray-400">Loading your interviews...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Interviews</h1>
        <Link
          href="/interview/create"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          New Interview
        </Link>
      </div>
      
      {interviews.length === 0 ? (
        <div className="rounded-lg bg-gray-900 p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">No interviews yet</h2>
          <p className="mb-6 text-gray-400">
            Get started by creating your first AI interview
          </p>
          <Link
            href="/interview/create"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Create Interview
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="flex flex-col justify-between rounded-lg bg-gray-900 p-6"
            >
              <div>
                <h2 className="mb-2 text-xl font-semibold">{interview.role}</h2>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded bg-gray-800 px-2 py-1 text-xs">
                    {interview.type}
                  </span>
                  <span className="rounded bg-gray-800 px-2 py-1 text-xs">
                    {interview.experience}
                  </span>
                  <span className={`rounded px-2 py-1 text-xs ${
                    interview.status === "completed" 
                      ? "bg-green-900 text-green-300" 
                      : "bg-yellow-900 text-yellow-300"
                  }`}>
                    {interview.status === "completed" ? "Completed" : "In Progress"}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Created: {new Date(interview.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href={`/interview/${interview.id}`}
                  className="text-blue-400 hover:text-blue-500"
                >
                  {interview.status === "completed" ? "View Results" : "Continue Interview"} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
} 