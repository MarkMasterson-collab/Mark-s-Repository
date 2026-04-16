import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: subject }, { data: documents }] = await Promise.all([
    supabase.from("subjects").select("*").eq("id", id).single(),
    supabase
      .from("documents")
      .select("*")
      .eq("subject_id", id)
      .order("exam_year", { ascending: false }),
  ]);

  if (!subject) notFound();

  const pastPapers = documents?.filter((d) => d.type === "past_paper") ?? [];
  const notes = documents?.filter((d) => d.type === "notes") ?? [];

  const allTopics = documents
    ?.flatMap((d) => d.key_topics ?? [])
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 12);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <Link href="/subjects" className="text-sm text-gray-500 hover:text-gray-900">
            ← Subjects
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">{subject.name}</h1>
          {subject.description && (
            <p className="mt-1 text-sm text-gray-500">{subject.description}</p>
          )}
        </div>
        <Link
          href={`/test?subject=${id}`}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          Practice test
        </Link>
      </div>

      {allTopics && allTopics.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Key topics
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {allTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="font-semibold text-gray-900">
            Past papers ({pastPapers.length})
          </h2>
          {pastPapers.length === 0 ? (
            <p className="mt-2 text-sm text-gray-400">No past papers uploaded yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100">
              {pastPapers.map((doc) => (
                <li key={doc.id} className="py-3">
                  <p className="text-sm font-medium text-gray-800">{doc.title}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                    {doc.exam_year && <span>{doc.exam_year}</span>}
                    <span className="uppercase">{doc.language}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-semibold text-gray-900">
            Course notes ({notes.length})
          </h2>
          {notes.length === 0 ? (
            <p className="mt-2 text-sm text-gray-400">No notes uploaded yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100">
              {notes.map((doc) => (
                <li key={doc.id} className="py-3">
                  <p className="text-sm font-medium text-gray-800">{doc.title}</p>
                  <span className="text-xs uppercase text-gray-400">{doc.language}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
