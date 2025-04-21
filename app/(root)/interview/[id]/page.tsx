import InterviewClient from "@/components/interview-client";
import { Metadata } from "next";

type InterviewPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { id } = await params;
  return <InterviewClient id={id} />;
} 