import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <footer className="border-t border-gray-800 bg-gray-900 py-8 text-center text-sm text-gray-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mr-1">
                  Interview
                </span>
                <span>AI</span>
              </div>
              <p className="text-gray-500 text-sm">
                Ace your interviews with AI-powered practice
              </p>
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Contact
              </a>
            </div>
            <div>
              &copy; {new Date().getFullYear()} Interview AI. All rights
              reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
