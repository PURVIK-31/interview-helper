export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-950 p-6">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-900 p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Interview AI</h1>
          <p className="text-gray-400">Practice interviews with AI voice agents</p>
        </div>
        {children}
      </div>
    </div>
  );
} 