import { Metadata } from "next";
import FeedbackClient from "@/components/feedback-client";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FeedbackPage({ params }: Props) {
  const { id } = await params;
  return <FeedbackClient id={id} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Interview Feedback | MockPrep AI`,
    description: "Review your interview feedback and performance analysis",
  };
} 