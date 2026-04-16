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
      <div className="text-center py-16">
        <p className="text-gray-500">No subject selected.</p>
        <Link href="/subjects" className="mt-4 inline-block text-sm underline text-gray-700">
          Browse subjects
        </Link>
      </div>
    );
  }

  const [{ data: subject }, { data: questions }] = await Promise.all([
    supabase.from("subjects").select("name").eq("id", subjectId).single(),
    supabase
      .from("questions")
      .select("*")
      .eq("subject_id", subjectId)
      .limit(20),
  ]);

  if (!subject) {
    return <p className="text-sm text-red-600">Subject not found.</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/subjects/${subjectId}`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← {subject.name}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Practice test — {subject.name}
        </h1>
      </div>

      {!questions || questions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-sm text-gray-500">
            No questions available yet. Upload a past paper to generate questions.
          </p>
        </div>
      ) : (
        <PracticeTest questions={questions} subjectId={subjectId} />
      )}
    </div>
  );
}
