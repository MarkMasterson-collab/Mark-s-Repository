"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (error) setError(error.message);
    else setMagicSent(true);

    setLoading(false);
  }

  if (magicSent) {
    return (
      <div className="mx-auto mt-24 max-w-sm text-center">
        {/* SVG mail icon — no emoji */}
        <div
          className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#22c55e]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Check your email</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          We sent a magic link to{" "}
          <span className="text-white/80">{email}</span>.
          Click it to sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-20 max-w-sm">
      <h1 className="text-3xl font-bold text-white">Sign in</h1>
      <p className="mt-2 text-sm leading-relaxed text-white/50">
        Enter your EHL email to receive a magic link.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/40"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@ehl.ch"
            className="mt-2 block w-full rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all duration-200
              focus-visible:ring-2 focus-visible:ring-[#22c55e] focus-visible:ring-offset-0"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        </div>

        {error && (
          <p
            className="rounded-lg px-4 py-3 text-sm"
            role="alert"
            style={{
              background: "rgba(248,113,113,0.1)",
              color: "rgb(252,165,165)",
              border: "1px solid rgba(248,113,113,0.2)",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-lg bg-[#22c55e] py-3 text-sm font-semibold text-[#020617] transition-all duration-200
            hover:bg-[#16a34a] hover:scale-[1.01] active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Sending…
            </span>
          ) : (
            "Send magic link"
          )}
        </button>
      </form>
    </div>
  );
}
