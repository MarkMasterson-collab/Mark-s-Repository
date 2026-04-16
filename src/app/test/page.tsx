import { createClient } from "@/lib/supabase/server";
import { PracticeTest } from "@/components/PracticeTest";
import Link from "next/link";

export default async function TestPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject: subjectId } = await searchParams;
  const supabase = await createClient();

  if (!subjectId) {
    return (
      <div className="py-20 text-center">
        <p className="text-white/40">No subject selected.</p>
        <Link
          href="/subjects"
          className="mt-4 inline-block text-sm text-white/60 underline hover:text-white transition-colors"
        >
          Browse courses
        </Link>
      </div>
    );
  }

  const [{ data: subject }, { data: questions }] = await Promise.all([
    supabase.from("subjects").select("name").eq("id", subjectId).single(),
    supabase.from("questions").select("*").eq("subject_id", subjectId).limit(20),
  ]);

  if (!subject) {
    return <p className="text-sm text-red-400">Subject not found.</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/subjects/${subjectId}`}
          className="text-xs text-white/40 transition-colors hover:text-white/70"
        >
          ← {subject.name}
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-white">
          Practice test
        </h1>
        <p className="mt-1 text-sm text-white/50">{subject.name}</p>
      </div>

      {!questions || questions.length === 0 ? (
        <div
          className="rounded-xl p-14 text-center"
          style={{ border: "1px dashed rgba(255,255,255,0.08)" }}
        >
          <p className="text-sm text-white/30">
            No questions available yet. Upload a past paper to generate questions.
          </p>
        </div>
      ) : (
        <PracticeTest questions={questions} subjectId={subjectId} />
      )}
    </div>
  );
}
