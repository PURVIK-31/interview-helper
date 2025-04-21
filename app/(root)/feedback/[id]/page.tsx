import FeedbackClient from "@/components/feedback-client";

export default function FeedbackPage({ params }: { params: { id: string } }) {
  return <FeedbackClient id={params.id} />;
} 