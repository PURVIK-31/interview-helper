import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold">
            Interview AI
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-white">
              Dashboard
            </Link>
            <Link href="/sign-in" className="text-gray-300 hover:text-white">
              Sign In
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-800 bg-gray-900 py-6 text-center text-sm text-gray-400">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} Interview AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 