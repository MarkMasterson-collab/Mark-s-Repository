import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UploadForm } from "@/components/UploadForm";

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: subject },
    { data: documents },
    {
      data: { user },
    },
  ] = await Promise.all([
    supabase.from("subjects").select("*").eq("id", id).single(),
    supabase
      .from("documents")
      .select("id, title, type, language, exam_year, key_topics")
      .eq("subject_id", id)
      .order("exam_year", { ascending: false }),
    supabase.auth.getUser(),
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
      {/* Hero heading */}
      <div className="pb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <Link
          href="/subjects"
          className="text-xs text-white/40 transition-colors hover:text-white/70"
        >
          ← Courses
        </Link>
        <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
          {subject.name}
        </h1>
        {subject.description && (
          <p className="mt-3 max-w-2xl text-base text-white/50">
            {subject.description}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/test?subject=${id}`}
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Practice test
          </Link>
          {user && <UploadForm subjectId={id} />}
        </div>
      </div>

      {/* Key topics */}
      {allTopics && allTopics.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
            Key topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-full px-3 py-1 text-xs text-white/60"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
            Past papers ({pastPapers.length})
          </h2>
          {pastPapers.length === 0 ? (
            <div
              className="rounded-xl p-6 text-center"
              style={{ border: "1px dashed rgba(255,255,255,0.08)" }}
            >
              <p className="text-sm text-white/30">No past papers uploaded yet.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {pastPapers.map((doc) => (
                <li
                  key={doc.id}
                  className="glass rounded-xl px-4 py-3"
                >
                  <p className="text-sm font-medium text-white">{doc.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-white/30">
                    {doc.exam_year && <span>{doc.exam_year}</span>}
                    {doc.exam_year && <span>·</span>}
                    <span className="uppercase">{doc.language}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
            Course notes ({notes.length})
          </h2>
          {notes.length === 0 ? (
            <div
              className="rounded-xl p-6 text-center"
              style={{ border: "1px dashed rgba(255,255,255,0.08)" }}
            >
              <p className="text-sm text-white/30">No notes uploaded yet.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {notes.map((doc) => (
                <li
                  key={doc.id}
                  className="glass rounded-xl px-4 py-3"
                >
                  <p className="text-sm font-medium text-white">{doc.title}</p>
                  <span className="text-xs uppercase text-white/30">{doc.language}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
