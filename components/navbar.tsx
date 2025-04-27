"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-800/50"
          : "bg-transparent border-b border-gray-800/0"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold flex items-center group">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mr-1">
            Interview
          </span>
          <span className="relative">
            AI
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/interview/create"
                    className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
                  >
                    New Interview
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
                  >
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
                  >
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/sign-in"
                    className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
                  >
                    Sign In
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link
                    href="/sign-up"
                    className="btn-primary text-sm px-4 py-2"
                  >
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full focus:outline-none group"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
            }`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-white mt-1 transition-opacity duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-white mt-1 transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col py-4 px-4 space-y-4 bg-gray-900/90 backdrop-blur-lg border-t border-gray-800/50">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/interview/create"
                    className="text-gray-300 hover:text-white transition-colors duration-300 w-full py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    New Interview
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:text-white transition-colors duration-300 w-full py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-secondary text-sm px-4 py-2 w-full"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors duration-300 w-full py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/sign-in"
                    className="text-gray-300 hover:text-white transition-colors duration-300 w-full py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="btn-primary text-sm px-4 py-2 w-full flex justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">Sign Up</span>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
