"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  Mic,
  FileText,
  Moon,
  Sun,
  ArrowRight,
  Heart,
  CheckCircle2,
  BrainCircuit,
  Users,
} from "lucide-react";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  /* ------------------------------
     APPLY THEME TO <html>
  -------------------------------- */
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-gray-200/40 dark:border-gray-800/40 bg-white/70 dark:bg-[#0e0e10]/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <Heart size={18} fill="currentColor" />
            </div>
            Autism Care <span className="text-blue-600">AI</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              {darkMode ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-blue-600" />
              )}
            </button>

            <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-blue-600">
              Login
            </Link>

            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <Sparkles size={16} />
            Compassionate AI for Autism Care
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Support for Every Step<br />of the Journey
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Evidence-based guidance for caregivers, parents, and educators —
            available 24/7.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center gap-2 justify-center hover:bg-blue-700 shadow-xl shadow-blue-500/30"
            >
              Start Chatting <ArrowRight size={20} />
            </Link>

            <a
              href="#features"
              className="px-8 py-4 rounded-full border border-gray-300 dark:border-gray-700 font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-transparent">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Available", value: "24/7", icon: <Clock size={16} /> },
            { label: "Guidance", value: "Evidence-Based", icon: <CheckCircle2 size={16} /> },
            { label: "Users", value: "10k+", icon: <Users size={16} /> },
            { label: "Privacy", value: "Secure", icon: <ShieldCheck size={16} /> },
          ].map((item, i) => (
            <div key={i}>
              <div className="text-blue-600 dark:text-blue-400 font-bold text-xl">
                {item.value}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 py-32 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Features that empower caregivers
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Designed for real-world autism support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Feature icon={<BrainCircuit size={28} />} title="Smart AI Guidance" />
          <Feature icon={<Mic size={28} />} title="Voice Input" />
          <Feature icon={<FileText size={28} />} title="Document Uploads" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Autism Care AI — Built with care ❤️
      </footer>
    </main>
  );
}

/* Feature Card */
function Feature({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700 text-center hover:border-blue-500 transition-all">
      <div className="mb-4 text-blue-600 dark:text-blue-400">{icon}</div>
      <h3 className="font-bold text-lg">{title}</h3>
    </div>
  );
}
