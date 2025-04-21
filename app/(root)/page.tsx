import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold leading-tight md:text-6xl">
            Get interview ready with AI-powered practice and feedback
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-400">
            Practice on real interview questions and get instant feedback
          </p>
          <Link
            href="/interview/create"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white hover:bg-blue-700"
          >
            Start an interview
          </Link>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">
            How it works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-gray-800 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold">
                1
              </div>
              <h3 className="mb-2 text-xl font-bold">Select your interview</h3>
              <p className="text-gray-400">
                Choose the role, experience level, and question types
              </p>
            </div>
            <div className="rounded-lg bg-gray-800 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold">
                2
              </div>
              <h3 className="mb-2 text-xl font-bold">Practice with AI voice</h3>
              <p className="text-gray-400">
                Have a realistic conversation with our AI interviewer
              </p>
            </div>
            <div className="rounded-lg bg-gray-800 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold">
                3
              </div>
              <h3 className="mb-2 text-xl font-bold">Get detailed feedback</h3>
              <p className="text-gray-400">
                Receive personalized feedback to improve your responses
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 