import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: attempts } = await supabase
    .from("test_attempts")
    .select("*, subjects(name)")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(50);

  // Aggregate per subject
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
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">{user.email}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Tests taken" value={totalAttempts} />
        <StatCard label="Average score" value={overallAvg !== null ? `${overallAvg}%` : "—"} />
        <StatCard label="Subjects studied" value={bySubject.size} />
      </div>

      {stats.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-gray-900">Progress by subject</h2>
          <ul className="mt-3 divide-y divide-gray-100">
            {stats.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3">
                <div>
                  <Link
                    href={`/subjects/${s.id}`}
                    className="text-sm font-medium text-gray-800 hover:underline"
                  >
                    {s.name}
                  </Link>
                  <p className="text-xs text-gray-400">
                    {s.attempts} attempt{s.attempts !== 1 ? "s" : ""} · avg {s.avgScore}%
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <ScoreBadge score={s.lastScore} />
                  <Link
                    href={`/test?subject=${s.id}`}
                    className="text-xs text-gray-500 underline hover:text-gray-900"
                  >
                    Retake
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.length === 0 && (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-sm text-gray-500">
            No tests taken yet.{" "}
            <Link href="/subjects" className="underline hover:text-gray-900">
              Browse subjects to start practising.
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-green-100 text-green-700"
      : score >= 50
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {score}%
    </span>
  );
}
