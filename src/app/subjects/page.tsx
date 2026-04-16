import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function SubjectsPage() {
  const supabase = await createClient();
  const { data: subjects, error } = await supabase
    .from("subjects")
    .select("*")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
      <p className="mt-1 text-sm text-gray-500">
        Select a subject to view past papers and start a practice test.
      </p>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          Could not load subjects: {error.message}
        </p>
      )}

      {subjects && subjects.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-500">
          No subjects yet. Ask an admin to upload content.
        </p>
      )}

      {subjects && subjects.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <li key={subject.id}>
              <Link
                href={`/subjects/${subject.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="font-semibold text-gray-900">{subject.name}</h2>
                {subject.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {subject.description}
                  </p>
                )}
                {subject.year && (
                  <span className="mt-3 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                    Year {subject.year}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
