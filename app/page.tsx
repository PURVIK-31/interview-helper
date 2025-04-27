"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Theme toggle hook
const useThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(true);
  
  useEffect(() => {
    setDarkMode(true);
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
  }, []);
  
  const toggleTheme = () => {
    setDarkMode(true);
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
  };
  
  return [darkMode, toggleTheme] as const;
};

// Hero section with GSAP animations
const Hero = () => {
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaRef = useRef(null);
  const heroImageRef = useRef(null);
  
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.from(headingRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
    })
      .from(
        descriptionRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.6"
      )
      .from(
        ctaRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.4"
      )
      .from(
        heroImageRef.current,
        {
          scale: 0.9,
          opacity: 0,
          duration: 1.2,
        },
        "-=0.8"
      );
  }, []);
  
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1
              ref={headingRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              <span className="block">Simplify Your</span>
              <span className="block text-blue-500">Interview Process</span>
            </h1>
            <p
              ref={descriptionRef}
              className="mt-6 text-xl leading-relaxed text-gray-700 dark:text-gray-300"
            >
              Automate candidate assessment, prepare with intelligent AI, and elevate
              your technical interviews with our cutting-edge platform.
            </p>
            <div ref={ctaRef} className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
              >
                Get Started
              </Link>
              <Link
                href="/demo"
                className="inline-block px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg text-center"
              >
                Watch Demo
              </Link>
            </div>
          </div>
          <div
            ref={heroImageRef}
            className="relative h-[400px] md:h-[500px] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-500/10 rounded-3xl blur-3xl"></div>
            <div className="relative z-10 w-full h-full">
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Interview Session
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">AI</div>
                        <div className="ml-3 font-medium text-gray-900 dark:text-white">AI Assistant</div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">Tell me about your experience with React hooks and state management.</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-400 flex items-center justify-center text-white dark:text-gray-900 font-bold">C</div>
                        <div className="ml-3 font-medium text-gray-900 dark:text-white">Candidate</div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">I've worked extensively with React hooks, particularly useState and useEffect for state management in my projects...</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature section component
const Features = () => {
  const featuresRef = useRef(null);
  
  useEffect(() => {
    const features = gsap.utils.toArray(".feature-item");
    
    gsap.from(features, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 80%",
      },
    });
  }, []);
  
  const features = [
    {
      title: "AI-Powered Interviews",
      description:
        "Conduct realistic interviews with our advanced voice AI that adapts to candidates in real-time.",
      icon: "🎙️",
    },
    {
      title: "In-depth Analytics",
      description:
        "Gain valuable insights with detailed performance metrics and candidate comparisons.",
      icon: "📊",
    },
    {
      title: "Customizable Assessments",
      description:
        "Create tailored interview flows for different roles, experience levels, and technologies.",
      icon: "⚙️",
    },
    {
      title: "Seamless Integration",
      description:
        "Connect with your existing HR tools and ATS systems for a unified workflow.",
      icon: "🔄",
    },
  ];
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-20" ref={featuresRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Powerful Features for Better Hiring
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with thoughtful design to
            transform your technical interview process.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-item bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CTA section component
const CTASection = () => {
  const ctaSectionRef = useRef(null);
  
  useEffect(() => {
    gsap.from(ctaSectionRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: ctaSectionRef.current,
        start: "top 80%",
      },
    });
  }, []);
  
  return (
    <div
      ref={ctaSectionRef}
      className="bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-blue-900 dark:to-indigo-950 text-white py-16 rounded-xl mx-4 my-8 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-glow">
          Ready to Transform Your Interview Process?
        </h2>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
          Join thousands of companies already using our platform to find the best
          talent faster and more efficiently.
        </p>
        <Link
          href="/dashboard"
          className="px-10 py-4 bg-white text-blue-600 hover:bg-gray-100 font-medium rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-white/20"
        >
          Get Started Now
        </Link>
      </div>
    </div>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              TechInterviews.AI
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Making technical interviews smarter, fairer, and more efficient.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {["Documentation", "Blog", "Community", "Help Center"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {["About", "Careers", "Privacy", "Terms"].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} TechInterviews.AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// NavBar component with theme toggle
const NavBar = ({ darkMode, toggleTheme }: { darkMode: boolean; toggleTheme: () => void }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navbarRef = useRef(null);
  
  useEffect(() => {
    gsap.from(navbarRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);
  
  useEffect(() => {
    if (menuOpen) {
      gsap.to(menuRef.current, {
        height: "auto",
        duration: 0.3,
        ease: "power3.out",
      });
    } else {
      gsap.to(menuRef.current, {
        height: 0,
        duration: 0.3,
        ease: "power3.out",
      });
    }
  }, [menuOpen]);
  
  return (
    <nav
      ref={navbarRef}
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Tech</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Interviews.AI</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/features"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/about"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Blog
            </Link>
            
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Sign In
            </Link>
          </div>
          
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div
        ref={menuRef}
        className="md:hidden overflow-hidden h-0"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900">
          <Link
            href="/features"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Features
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Blog
          </Link>
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default function LandingPage() {
  const [darkMode, toggleTheme] = useThemeToggle();
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <NavBar darkMode={darkMode} toggleTheme={toggleTheme} />
      <Hero />
      <Features />
      <CTASection />
      <Footer />
    </div>
  );
}
