import { Metadata } from "next";
import InterviewClient from "@/components/interview-client";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InterviewPage({ params }: Props) {
  const { id } = await params;
  return <InterviewClient id={id} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Interview Session | MockPrep AI`,
    description: "Complete your mock interview with an AI interviewer",
  };
} 