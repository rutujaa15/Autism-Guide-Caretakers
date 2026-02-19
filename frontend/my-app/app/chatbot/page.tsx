"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquarePlus,
  Settings,
  HelpCircle,
  Send,
  User,
  Sparkles,
  Mic,
  Paperclip,
  Sun,
  Moon,
} from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I’m here to help caregivers. Ask me anything about autism care.",
    },
  ]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  /* ---------- Theme persistence ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDarkMode(saved === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ---------- Scroll ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------- Send message ---------- */
  async function sendMessage() {
    if (!input.trim()) return;

    const question = input;
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Unable to connect to the server.",
        },
      ]);
    }
  }

  return (
    /* 🔥 THE ONLY PLACE WE TOGGLE DARK MODE */
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)]">
        {/* Sidebar */}
        <aside className="hidden md:flex w-[280px] flex-col p-4 bg-[var(--panel)] border-r border-[var(--panel-border)]">
          <button className="flex items-center gap-3 mb-8 rounded-2xl px-4 py-4 text-sm font-medium bg-[var(--input)] border border-[var(--input-border)] hover:opacity-90">
            <MessageSquarePlus size={20} />
            New chat
          </button>

          <div className="flex-1">
            <p className="px-3 text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-4">
              Recent
            </p>
            <div className="px-4 py-2 rounded-full bg-[var(--input)] border border-[var(--input-border)] text-sm font-medium">
              Caretaking Assistance
            </div>
          </div>

          <div className="mt-auto space-y-1 border-t border-[var(--panel-border)] pt-4">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--input)]">
              <HelpCircle size={18} /> Help
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--input)]">
              <Settings size={18} /> Settings
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col relative">
          {/* Header */}
          <header className="p-4 flex justify-between items-center bg-[var(--background)] border-b border-[var(--panel-border)]">
            <h1 className="text-xl font-semibold text-[var(--accent)]">
              Autism Care AI
            </h1>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-full bg-[var(--input)] border border-[var(--input-border)] hover:opacity-80"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-[800px] mx-auto px-6 py-10 space-y-10">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-6 ${
                    m.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--input)] border border-[var(--input-border)]">
                    {m.role === "user" ? (
                      <User size={20} />
                    ) : (
                      <Sparkles size={20} className="text-[var(--accent)]" />
                    )}
                  </div>

                  <div
                    className={`max-w-[80%] p-4 rounded-2xl border border-[var(--input-border)] ${
                      m.role === "user"
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--panel)]"
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} className="h-32" />
            </div>
          </div>

          {/* Input */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--background)] to-transparent pt-8 pb-6">
            <div className="max-w-[800px] mx-auto px-4">
              <div className="flex items-center gap-2 rounded-[32px] bg-[var(--panel)] border border-[var(--input-border)] px-5 py-3 shadow-lg">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask a question..."
                  className="flex-1 bg-transparent outline-none text-base"
                />

                <button className="p-2 rounded-full hover:bg-[var(--input)]">
                  <Paperclip size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-[var(--input)]">
                  <Mic size={20} />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className={`p-2.5 rounded-full ${
                    input.trim()
                      ? "bg-[var(--accent)] text-white"
                      : "opacity-40"
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-[var(--muted)]">
                Caregiver AI may generate inaccurate information.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
