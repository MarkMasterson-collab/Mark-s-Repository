import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type CourseEntry = { name: string };
type Module = { label: string; courses: CourseEntry[] };
type Semester = { label: string; year: number; modules: Module[] };

const SEMESTERS: Semester[] = [
  {
    label: "BOSC 1",
    year: 1,
    modules: [
      {
        label: "Business Tools I",
        courses: [
          { name: "Financial Accounting" },
          { name: "Micro-economics" },
          { name: "Management Information Systems" },
          { name: "Mathematics" },
        ],
      },
      {
        label: "Communication & Culture I",
        courses: [
          { name: "Business Communication" },
          { name: "German beginner A1.1" },
        ],
      },
      {
        label: "Foundations of Hospitality Management I",
        courses: [
          { name: "Financial Management for F&B" },
          { name: "Foundations of Hospitality Marketing" },
          { name: "Human Behaviour and Performance in the Workplace" },
        ],
      },
    ],
  },
  {
    label: "BOSC 2",
    year: 1,
    modules: [
      {
        label: "Business Tools II",
        courses: [
          { name: "Topics in Financial Analysis" },
          { name: "Macroeconomics" },
          { name: "Statistics" },
          { name: "Computational Thinking" },
        ],
      },
      {
        label: "Communication & Culture II",
        courses: [
          { name: "Academic Writing" },
          { name: "German beginner A1.2" },
        ],
      },
      {
        label: "Foundations of Hospitality Management II",
        courses: [
          { name: "Service Quality and Design" },
          { name: "Customer Information and Distribution Channel Management" },
          { name: "Rooms Division Management" },
        ],
      },
    ],
  },
  {
    label: "BOSC 3",
    year: 2,
    modules: [
      {
        label: "Business Analysis",
        courses: [
          { name: "Revenue Management" },
          { name: "Managerial Accounting" },
          { name: "Services Operations Management" },
          { name: "Hospitality Economics" },
        ],
      },
      {
        label: "Communication & Culture III",
        courses: [
          { name: "Japanese beginner A1.1" },
          { name: "Legal Challenges of the Hospitality Manager" },
        ],
      },
      {
        label: "Applied Hospitality Management",
        courses: [
          { name: "Talent Management Systems" },
          { name: "International Services Marketing" },
          { name: "Corporate Sustainability" },
        ],
      },
    ],
  },
];

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, description");

  type SubjectRow = { id: string; description: string | null };
  const subjectMap = new Map<string, SubjectRow>();
  for (const s of subjects ?? []) {
    subjectMap.set(s.name.toLowerCase().trim(), {
      id: s.id,
      description: s.description,
    });
  }

  function lookup(name: string): SubjectRow | null {
    return subjectMap.get(name.toLowerCase().trim()) ?? null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Courses</h1>
      <p className="mt-2 text-sm text-white/50">
        All EHL undergraduate courses. Click any course to view materials and start a practice test.
      </p>

      <div className="mt-8 space-y-3">
        {SEMESTERS.map((semester, semIndex) => (
          <details key={semester.label} {...(semIndex === 0 ? { open: true } : {})}>
            <summary className="glass flex cursor-pointer select-none items-center justify-between rounded-xl px-5 py-4 transition-all duration-200 hover:bg-white/[0.06]">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white">{semester.label}</span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs text-white/50"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Year {semester.year}
                </span>
              </div>
              <svg
                className="chevron h-4 w-4 text-white/30 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>

            <div className="mt-2 space-y-6 pb-2 pl-1 pr-1">
              {semester.modules.map((mod) => (
                <div key={mod.label}>
                  <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                    {mod.label}
                  </h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {mod.courses.map((course) => {
                      const subject = lookup(course.name);
                      return (
                        <li key={course.name}>
                          {subject ? (
                            <Link
                              href={`/subjects/${subject.id}`}
                              className="group glass flex cursor-pointer flex-col rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(34,197,94,0.2)] hover:bg-white/[0.07]"
                            >
                              <span className="text-sm font-medium text-white">
                                {course.name}
                              </span>
                              {subject.description && (
                                <span className="mt-1.5 text-xs leading-relaxed text-white/40 line-clamp-2">
                                  {subject.description}
                                </span>
                              )}
                            </Link>
                          ) : (
                            <div
                              className="flex flex-col rounded-xl p-4"
                              style={{
                                background: "rgba(255,255,255,0.01)",
                                border: "1px dashed rgba(255,255,255,0.07)",
                              }}
                            >
                              <span className="text-sm text-white/30">{course.name}</span>
                              <span className="mt-1 text-xs text-white/20">Coming soon</span>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
