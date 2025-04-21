import InterviewClient from "@/components/interview-client";

export default function InterviewPage({ params }: { params: { id: string } }) {
  return <InterviewClient id={params.id} />;
} 