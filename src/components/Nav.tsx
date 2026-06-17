"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/curriculum",        label: "Subjects"    },
  { href: "/subjects",          label: "Courses"     },
  { href: "/grade-calculator",  label: "Calculator"  },
  { href: "/dashboard",         label: "Dashboard"   },
];

export function Nav() {
  const pathname = usePathname();
  const [user, setUser]         = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => l.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className="sticky top-0 z-50 transition-all duration-300" style={{
      background: scrolled ? "rgba(248,249,255,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(79,70,229,0.1)" : "1px solid transparent",
      boxShadow: scrolled ? "0 2px 24px rgba(79,70,229,0.08)" : "none",
    }}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="cursor-pointer">
          <span className="font-display text-[15px] font-bold text-gradient" style={{ letterSpacing: "-0.01em" }}>
            EHL Exam Prep
          </span>
        </Link>

        {user && (
          <nav className="flex items-center gap-7">
            {navLinks.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  className="cursor-pointer text-sm font-medium transition-colors duration-200"
                  style={{ color: active ? "#4F46E5" : "#6B7280" }}
                >
                  {label}
                  {active && <span style={{ display:"block", height:2, background:"linear-gradient(90deg,#4F46E5,#7C3AED)", borderRadius:2, marginTop:2 }} />}
                </Link>
              );
            })}
            <button onClick={() => supabase.auth.signOut()}
              className="cursor-pointer text-sm font-medium text-[#9CA3AF] transition-colors hover:text-[#6B7280]">
              Sign out
            </button>
          </nav>
        )}

        {!user && (
          <div className="flex items-center gap-3">
            <Link href="/login" className="cursor-pointer text-sm font-medium text-[#6B7280] transition-colors hover:text-[#4F46E5]">
              Sign in
            </Link>
            <Link href="/subjects" className="cursor-pointer rounded-full bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#4338CA] hover:scale-[1.03] active:scale-[0.97]"
              style={{ boxShadow: "0 2px 12px rgba(79,70,229,0.35)" }}>
              Get started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
