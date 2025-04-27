import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      {/* Hero Section with enhanced styling and animations */}
      <section className="relative bg-gradient-to-b from-gray-950 to-gray-900 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white-pattern opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="container relative mx-auto px-4 text-center z-10">
          <div className="animate-fade-in">
            <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl tracking-tight">
              Get interview ready with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 blue-glow">
                AI-powered practice
              </span>
            </h1>
            <p
              className="mx-auto mb-10 max-w-2xl text-xl text-gray-300 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Practice on real interview questions and get instant feedback to
              improve your skills
            </p>
            <div
              className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Link href="/interview/create" className="btn-primary group">
                <span className="relative z-10">Start an interview</span>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link href="/sign-up" className="btn-secondary">
                Create account
              </Link>
            </div>
          </div>

          <div
            className="mt-20 relative animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 blur-md opacity-50"></div>
            <div className="relative rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl">
              <div className="h-80 bg-gray-800 flex items-center justify-center">
                <div className="p-8 glass rounded-lg max-w-lg">
                  <div className="flex mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-600 p-2 rounded-full mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-left relative">
                      <p className="text-white">
                        Tell me about a challenging project you worked on and
                        how you overcame obstacles.
                      </p>
                      <div className="absolute -bottom-2 left-4 transform rotate-45 w-4 h-4 bg-gray-700"></div>
                    </div>
                  </div>
                  <div className="flex items-start mb-4 justify-end">
                    <div className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 text-left relative">
                      <p className="text-gray-100">
                        In my last role, I led a team that had to migrate our
                        legacy system to...
                      </p>
                      <div className="absolute -bottom-2 right-4 transform rotate-45 w-4 h-4 bg-gray-700/50"></div>
                    </div>
                    <div className="bg-gray-600 p-2 rounded-full ml-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="pulse">
                    <div className="h-1 w-6 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Enhanced with cards and animations */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-24 relative">
        <div className="absolute inset-0 bg-dots-pattern opacity-10"></div>
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-4xl font-bold animate-slide-up">
            How it{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              works
            </span>
          </h2>
          <p
            className="text-center text-gray-400 mb-16 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Our AI-powered platform makes interview preparation simple,
            effective, and personalized
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div
              className="rounded-xl bg-gray-800/50 backdrop-blur-sm p-8 border border-gray-700/50 shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-900/20 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold shadow-lg shadow-blue-500/20">
                <span className="animate-bounce-in">1</span>
              </div>
              <h3 className="mb-4 text-2xl font-bold">Select your interview</h3>
              <p className="text-gray-400 mb-4">
                Choose the role, experience level, and question types that match
                your target job
              </p>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            </div>

            <div
              className="rounded-xl bg-gray-800/50 backdrop-blur-sm p-8 border border-gray-700/50 shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-900/20 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold shadow-lg shadow-blue-500/20">
                <span
                  className="animate-bounce-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  2
                </span>
              </div>
              <h3 className="mb-4 text-2xl font-bold">
                Practice with AI voice
              </h3>
              <p className="text-gray-400 mb-4">
                Have a realistic conversation with our AI interviewer that
                adapts to your responses
              </p>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            </div>

            <div
              className="rounded-xl bg-gray-800/50 backdrop-blur-sm p-8 border border-gray-700/50 shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-900/20 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold shadow-lg shadow-blue-500/20">
                <span
                  className="animate-bounce-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  3
                </span>
              </div>
              <h3 className="mb-4 text-2xl font-bold">Get detailed feedback</h3>
              <p className="text-gray-400 mb-4">
                Receive personalized feedback on your answers with actionable
                improvements
              </p>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Enhanced with modern card design */}
      <section className="py-24 bg-gradient-to-b from-gray-800 to-gray-900 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-4xl font-bold animate-slide-up">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Features
            </span>{" "}
            designed for success
          </h2>
          <p
            className="text-center text-gray-400 mb-16 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Everything you need to prepare for your next interview and stand out
            from other candidates
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div
              className="group rounded-xl bg-gray-900/80 backdrop-blur-sm p-6 border border-gray-700/30 hover:border-blue-500/30 shadow-lg transition-all duration-300 hover:shadow-blue-900/10 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="mb-6 text-blue-500 bg-blue-500/10 p-4 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold group-hover:text-blue-400 transition-colors duration-300">
                Realistic AI Voice
              </h3>
              <p className="text-gray-400">
                Practice with natural voice interactions that simulate real
                interviews
              </p>
            </div>

            <div
              className="group rounded-xl bg-gray-900/80 backdrop-blur-sm p-6 border border-gray-700/30 hover:border-blue-500/30 shadow-lg transition-all duration-300 hover:shadow-blue-900/10 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="mb-6 text-blue-500 bg-blue-500/10 p-4 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold group-hover:text-blue-400 transition-colors duration-300">
                Tailored Questions
              </h3>
              <p className="text-gray-400">
                Get interview questions specific to your role, experience level,
                and technology stack
              </p>
            </div>

            <div
              className="group rounded-xl bg-gray-900/80 backdrop-blur-sm p-6 border border-gray-700/30 hover:border-blue-500/30 shadow-lg transition-all duration-300 hover:shadow-blue-900/10 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="mb-6 text-blue-500 bg-blue-500/10 p-4 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold group-hover:text-blue-400 transition-colors duration-300">
                Detailed Analytics
              </h3>
              <p className="text-gray-400">
                Track your performance across multiple practice sessions with
                detailed metrics
              </p>
            </div>

            <div
              className="group rounded-xl bg-gray-900/80 backdrop-blur-sm p-6 border border-gray-700/30 hover:border-blue-500/30 shadow-lg transition-all duration-300 hover:shadow-blue-900/10 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="mb-6 text-blue-500 bg-blue-500/10 p-4 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold group-hover:text-blue-400 transition-colors duration-300">
                AI Feedback
              </h3>
              <p className="text-gray-400">
                Receive smart feedback and actionable suggestions to improve
                your interview skills
              </p>
            </div>
          </div>

          <div
            className="mt-16 grid md:grid-cols-2 gap-8 animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="rounded-xl bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-8 border border-blue-700/20 shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Technical Interviews</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Programming challenges with real-time feedback</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>System design discussions</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Algorithm optimization exercises</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Technology-specific questions</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-8 border border-blue-700/20 shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Behavioral Interviews</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>STAR method response training</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Leadership and teamwork scenarios</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Conflict resolution practice</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-5 w-5 text-blue-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Adaptability and growth mindset questions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Modernized with gradient and animations */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="container relative mx-auto px-4 text-center z-10">
          <div className="mx-auto max-w-3xl bg-gray-900/60 backdrop-blur-xl p-10 rounded-2xl border border-gray-800/50 shadow-2xl animate-fade-in">
            <h2 className="mb-6 text-3xl md:text-4xl font-bold">
              Ready to ace your next interview?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
              Start practicing with our AI interview platform today and build
              the confidence you need
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/sign-up" className="btn-primary group">
                <span className="relative z-10">Get started for free</span>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link href="/interview/create" className="btn-secondary">
                Try a sample interview
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-700/50 flex justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">1000+</div>
                <div className="text-sm text-gray-400">Interview Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">24/7</div>
                <div className="text-sm text-gray-400">Availability</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">98%</div>
                <div className="text-sm text-gray-400">User Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
