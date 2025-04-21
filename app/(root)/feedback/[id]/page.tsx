import FeedbackClient from "@/components/feedback-client";
import { Metadata } from "next";

type FeedbackPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const { id } = await params;
  return <FeedbackClient id={id} />;
} 