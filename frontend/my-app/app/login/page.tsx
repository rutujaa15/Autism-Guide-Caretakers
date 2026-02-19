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
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Theme sync
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // LOGIN HANDLER (CONNECTED TO DB)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Optional: store logged-in user
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccessMsg("Login successful! Redirecting...");
      setLoading(false);

      setTimeout(() => {
        router.push("/chatbot");
      }, 1000);

    } catch (err) {
      setLoading(false);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-[#0e0e10] text-gray-900 dark:text-gray-100 transition-colors duration-500 overflow-hidden relative">

      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-600/5 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-[420px] z-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-6 mx-auto">
            <Heart size={28} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Continue your caregiving journey
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-50/50 dark:bg-[#1e1f20]/40 border border-gray-100 dark:border-gray-800 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-black/5">
          <form className="space-y-4" onSubmit={handleLogin}>

            {/* Google Login (future) */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium text-sm mb-6"
            >
              <Chrome size={18} />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800"></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                or
              </span>
              <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800"></div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">
                Email Address
              </label>
              <input
                className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0e0e10]/50 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">
                  Password
                </label>
                <Link href="#" className="text-[11px] font-bold text-blue-600 uppercase hover:underline">
                  Forgot?
                </Link>
              </div>

              <div className="relative">
                <input
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0e0e10]/50 outline-none focus:ring-2 ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              {loading ? "Logging in..." : "Login to Assistant"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Success */}
            {successMsg && (
              <p className="mt-2 text-green-500 font-semibold text-sm text-center">
                {successMsg}
              </p>
            )}
          </form>

          {/* Footer */}
          <p className="text-sm mt-8 text-center text-gray-500 dark:text-gray-400 font-medium">
            New to Autism Care?{" "}
            <Link href="/signup" className="text-blue-600 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        {/* Feature Hint */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
          <Sparkles size={12} className="text-blue-500" />
          End-to-End Encrypted Support
        </div>
      </div>
    </main>
  );
}
