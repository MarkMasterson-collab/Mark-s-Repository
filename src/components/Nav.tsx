"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/curriculum", label: "Subjects"  },
  { href: "/subjects",   label: "Courses"   },
  { href: "/dashboard",  label: "Dashboard" },
];

export function Nav() {
  const pathname = usePathname();
  const [user, setUser]     = useState<User | null>(null);
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

  async function handleSignOut() { await supabase.auth.signOut(); }

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-400"
      style={{
        background: scrolled ? "rgba(7,7,14,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.1)" : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">

        {/* ── Logo ── */}
        <Link href="/" className="cursor-pointer" aria-label="EHL Exam Prep home">
          <span className="font-display text-gold-shimmer text-lg font-medium italic tracking-wide">
            EHL Exam Prep
          </span>
        </Link>

        {/* ── Authenticated nav ── */}
        {user && (
          <nav className="flex items-center gap-8">
            {navLinks.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  className="cursor-pointer text-sm font-light tracking-wide transition-all duration-200"
                  style={{
                    color: active ? "#C9A84C" : "rgba(237,232,216,0.5)",
                    letterSpacing: "0.06em",
                  }}
                  onMouseEnter={e => { if (!active) (e.target as HTMLElement).style.color = "#EDE8D8"; }}
                  onMouseLeave={e => { if (!active) (e.target as HTMLElement).style.color = "rgba(237,232,216,0.5)"; }}
                >
                  {label}
                  {active && (
                    <span aria-hidden="true" style={{
                      display: "block", height: 1,
                      background: "linear-gradient(90deg, transparent, #C9A84C, transparent)",
                      boxShadow: "0 0 6px rgba(201,168,76,0.6)",
                      marginTop: 3, borderRadius: 1,
                    }} />
                  )}
                </Link>
              );
            })}
            <button onClick={handleSignOut}
              className="cursor-pointer text-sm font-light tracking-wide transition-colors duration-200"
              style={{ color: "rgba(237,232,216,0.3)", letterSpacing: "0.06em" }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = "rgba(237,232,216,0.7)"}
              onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(237,232,216,0.3)"}
            >
              Sign out
            </button>
          </nav>
        )}

        {/* ── Unauthenticated CTA ── */}
        {!user && (
          <Link
            href="/login"
            className="cursor-pointer rounded-full border px-5 py-2 text-sm font-light tracking-wide transition-all duration-300 hover:border-[rgba(201,168,76,0.5)] hover:bg-[rgba(201,168,76,0.08)]"
            style={{ borderColor: "rgba(201,168,76,0.25)", color: "#C9A84C", letterSpacing: "0.08em" }}
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
