import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        EHL Exam Prep
      </h1>
      <p className="mt-4 max-w-xl text-lg text-gray-500">
        Prepare smarter with past papers, AI-generated practice tests, and
        progress tracking — built for EHL students.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/subjects"
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          Browse subjects
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
