"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/curriculum", label: "Subjects" },
  { href: "/subjects",   label: "Courses"  },
  { href: "/dashboard",  label: "Dashboard"},
];

export function Nav() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_e, session) => setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(2,6,23,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(22px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(22px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        {/* Logo — gradient shimmer */}
        <Link
          href="/"
          className="text-shimmer cursor-pointer text-[15px] font-bold tracking-tight"
        >
          EHL Exam Prep
        </Link>

        {/* Authenticated nav */}
        {user && (
          <nav className="flex items-center gap-7">
            {navLinks.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`cursor-pointer text-sm font-medium transition-colors duration-200 ${
                    active ? "text-white" : "text-white/50 hover:text-white"
                  }`}
                >
                  {label}
                  {active && (
                    <span
                      aria-hidden="true"
                      style={{
                        display: "block",
                        height: 2,
                        background: "#22c55e",
                        borderRadius: 2,
                        boxShadow: "0 0 8px rgba(34,197,94,0.7)",
                        marginTop: 2,
                      }}
                    />
                  )}
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="cursor-pointer text-sm text-white/35 transition-colors duration-200 hover:text-white/80"
            >
              Sign out
            </button>
          </nav>
        )}

        {/* Unauthenticated — green CTA */}
        {!user && (
          <Link
            href="/login"
            className="accent-glow cursor-pointer rounded-lg bg-[#22c55e] px-4 py-2 text-sm font-semibold text-[#020617] transition-all duration-200 hover:bg-[#16a34a] hover:scale-[1.04] active:scale-[0.97]"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
