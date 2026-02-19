"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Chrome,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  User,
  Mail,
  Lock,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync dark mode
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // SIGNUP HANDLER (CONNECTED TO DB)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccessMsg("Account created successfully! Redirecting...");
      setLoading(false);

      setTimeout(() => {
        router.push("/login");
      }, 1000);

    } catch (err) {
      setLoading(false);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-[#0e0e10] text-gray-900 dark:text-gray-100 transition-colors duration-500 overflow-hidden relative">

      {/* Background Effects */}
      <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-blue-600/10 dark:bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-indigo-600/10 dark:bg-indigo-600/5 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-[440px] z-10 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/20 mb-6 mx-auto">
            <Heart size={28} fill="currentColor" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Join the community of empowered caregivers
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-gray-50/50 dark:bg-[#1e1f20]/40 border border-gray-100 dark:border-gray-800 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl shadow-black/5">
          <form className="space-y-4" onSubmit={handleSignup}>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0e0e10]/50 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0e0e10]/50 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 text-sm"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0e0e10]/50 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 text-sm"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold shadow-xl shadow-blue-500/25"
            >
              {loading ? "Creating account..." : "Get Started Free"}
            </button>

            {successMsg && (
              <p className="text-green-500 font-semibold text-sm text-center mt-2">
                {successMsg}
              </p>
            )}
          </form>

          {/* Footer */}
          <p className="text-sm mt-8 text-center text-gray-500 dark:text-gray-400 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          <Sparkles size={12} className="text-blue-500" />
          AI-Powered Caregiving Support
        </div>
      </div>
    </main>
  );
}
