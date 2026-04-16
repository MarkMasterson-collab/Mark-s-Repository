import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type Course = { name: string };
type Semester = { label: string; courses: Course[] };
type Year = { label: string; semesters: Semester[] };

const CURRICULUM: Year[] = [
  {
    label: "Year 1",
    semesters: [
      {
        label: "BOSC 1",
        courses: [
          { name: "Financial Accounting" },
          { name: "Micro-economics" },
          { name: "Management Information Systems" },
          { name: "Mathematics" },
          { name: "Business Communication" },
          { name: "German beginner A1.1" },
          { name: "Financial Management for F&B" },
          { name: "Foundations of Hospitality Marketing" },
          { name: "Human Behaviour and Performance in the Workplace" },
        ],
      },
      {
        label: "BOSC 2",
        courses: [
          { name: "Topics in Financial Analysis" },
          { name: "Macroeconomics" },
          { name: "Statistics" },
          { name: "Computational Thinking" },
          { name: "Academic Writing" },
          { name: "German beginner A1.2" },
          { name: "Service Quality and Design" },
          { name: "Customer Information and Distribution Channel Management" },
          { name: "Rooms Division Management" },
        ],
      },
    ],
  },
  {
    label: "Year 2",
    semesters: [
      {
        label: "BOSC 3",
        courses: [
          { name: "Revenue Management" },
          { name: "Managerial Accounting" },
          { name: "Services Operations Management" },
          { name: "Hospitality Economics" },
          { name: "Japanese beginner A1.1" },
          { name: "Legal Challenges of the Hospitality Manager" },
          { name: "Talent Management Systems" },
          { name: "International Services Marketing" },
          { name: "Corporate Sustainability" },
        ],
      },
      { label: "BOSC 4", courses: [{ name: "placeholder" }] },
    ],
  },
  {
    label: "Year 3",
    semesters: [
      { label: "BOSC 5", courses: [{ name: "placeholder" }] },
      { label: "BOSC 6", courses: [{ name: "placeholder" }] },
    ],
  },
];

const REAL_COURSE_COUNT = 27;

export default async function CurriculumPage() {
  const supabase = await createClient();
  const { data: subjects } = await supabase.from("subjects").select("id, name");

  const subjectMap = new Map<string, string>();
  for (const s of subjects ?? []) {
    subjectMap.set(s.name.toLowerCase().trim(), s.id);
  }

  function matchSubject(name: string): string | null {
    return subjectMap.get(name.toLowerCase().trim()) ?? null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Subjects</h1>
      <p className="mt-2 text-sm text-white/50">
        EHL Bachelor in International Hospitality Management. Highlighted courses have study materials.
      </p>

      <div className="mt-8 space-y-12">
        {CURRICULUM.map((year) => (
          <section key={year.label}>
            <h2 className="mb-5 text-lg font-semibold text-white">{year.label}</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {year.semesters.map((sem) => {
                const isPlaceholder = sem.courses[0]?.name === "placeholder";
                return (
                  <div key={sem.label} className="glass rounded-xl p-5">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                      {sem.label}
                    </h3>

                    {isPlaceholder ? (
                      <p className="text-sm text-white/20">Courses not yet added</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {sem.courses.map((course) => {
                          const subjectId = matchSubject(course.name);
                          return (
                            <li key={course.name}>
                              {subjectId ? (
                                <Link
                                  href={`/subjects/${subjectId}`}
                                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/[0.07]"
                                  style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
                                >
                                  <span>{course.name}</span>
                                  <span className="text-xs text-white/30">→</span>
                                </Link>
                              ) : (
                                <div
                                  className="flex items-center justify-between rounded-lg px-3 py-2"
                                  style={{ border: "1px dashed rgba(255,255,255,0.06)" }}
                                >
                                  <span className="text-sm text-white/30">{course.name}</span>
                                  <span className="text-xs text-white/20">Soon</span>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 text-xs text-white/20">
        {subjectMap.size} of {REAL_COURSE_COUNT} courses have study materials available.
      </p>
    </div>
  );
}
