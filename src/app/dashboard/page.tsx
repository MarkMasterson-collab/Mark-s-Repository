import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: attempts } = await supabase
    .from("test_attempts")
    .select("*, subjects(name)")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(50);

  const bySubject = new Map<
    string,
    { name: string; attempts: number; avgScore: number; lastScore: number }
  >();

  for (const a of attempts ?? []) {
    const subj = a.subjects as { name: string } | null;
    if (!subj) continue;
    const key = a.subject_id;
    const pct = Math.round((a.score / a.total_questions) * 100);
    if (!bySubject.has(key)) {
      bySubject.set(key, { name: subj.name, attempts: 0, avgScore: 0, lastScore: pct });
    }
    const entry = bySubject.get(key)!;
    entry.attempts += 1;
    entry.avgScore = Math.round(
      (entry.avgScore * (entry.attempts - 1) + pct) / entry.attempts
    );
    entry.lastScore = pct;
  }

  const stats = Array.from(bySubject.entries()).map(([id, v]) => ({ id, ...v }));
  const totalAttempts = attempts?.length ?? 0;
  const overallAvg =
    attempts && attempts.length > 0
      ? Math.round(
          attempts.reduce((s, a) => s + (a.score / a.total_questions) * 100, 0) /
            attempts.length
        )
      : null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-white/40">{user.email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Tests taken" value={totalAttempts} />
        <StatCard
          label="Average score"
          value={overallAvg !== null ? `${overallAvg}%` : "—"}
        />
        <StatCard label="Subjects studied" value={bySubject.size} />
      </div>

      {stats.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
            Progress by subject
          </h2>
          <ul className="space-y-2">
            {stats.map((s) => (
              <li
                key={s.id}
                className="glass flex items-center justify-between rounded-xl px-5 py-4 transition-all duration-200"
              >
                <div>
                  <Link
                    href={`/subjects/${s.id}`}
                    className="cursor-pointer text-sm font-medium text-white transition-colors duration-200 hover:text-[#22c55e]"
                  >
                    {s.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-white/30">
                    {s.attempts} attempt{s.attempts !== 1 ? "s" : ""} · avg{" "}
                    {s.avgScore}%
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <ScoreBadge score={s.lastScore} />
                  <Link
                    href={`/test?subject=${s.id}`}
                    className="cursor-pointer text-xs text-white/30 transition-colors duration-200 hover:text-white/70"
                  >
                    Retake →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.length === 0 && (
        <div
          className="mt-12 rounded-xl p-12 text-center"
          style={{ border: "1px dashed rgba(255,255,255,0.08)" }}
        >
          <p className="text-sm text-white/30">
            No tests taken yet.{" "}
            <Link href="/subjects" className="text-white/60 underline hover:text-white transition-colors">
              Browse courses to start practising.
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-xl p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
        {label}
      </p>
      <p className="font-mono mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const style =
    score >= 70
      ? { background: "rgba(74,222,128,0.12)", color: "rgb(134,239,172)", border: "1px solid rgba(74,222,128,0.2)" }
      : score >= 50
      ? { background: "rgba(250,204,21,0.12)", color: "rgb(253,224,71)", border: "1px solid rgba(250,204,21,0.2)" }
      : { background: "rgba(248,113,113,0.12)", color: "rgb(252,165,165)", border: "1px solid rgba(248,113,113,0.2)" };

  return (
    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={style}>
      {score}%
    </span>
  );
}
