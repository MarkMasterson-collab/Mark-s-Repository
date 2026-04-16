"use client";

import { useState, useEffect, useCallback } from "react";
import type { Database } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

type Question = Database["public"]["Tables"]["questions"]["Row"];

const TIME_PER_QUESTION = 90; // seconds

export function PracticeTest({
  questions,
  subjectId,
}: {
  questions: Question[];
  subjectId: string;
}) {
  const supabase = createClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION * questions.length);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const finish = useCallback(
    async (finalAnswers: Record<string, string>) => {
      setFinished(true);
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      const score = questions.filter(
        (q) => finalAnswers[q.id] === q.correct_answer
      ).length;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("test_attempts").insert({
          user_id: user.id,
          subject_id: subjectId,
          score,
          total_questions: questions.length,
          time_taken_seconds: timeTaken,
          answers: finalAnswers,
        });
      }
    },
    [questions, startTime, supabase, subjectId]
  );

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          finish(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [finished, answers, finish]);

  function handleSelect(option: string) {
    if (showFeedback) return;
    setSelected(option);
  }

  function handleConfirm() {
    if (!selected) return;
    const updated = { ...answers, [questions[currentIndex].id]: selected };
    setAnswers(updated);
    setShowFeedback(true);
    if (currentIndex === questions.length - 1) {
      finish(updated);
    }
  }

  function handleNext() {
    setSelected(null);
    setShowFeedback(false);
    setCurrentIndex((i) => i + 1);
  }

  const current = questions[currentIndex];
  const score = questions.filter((q) => answers[q.id] === q.correct_answer).length;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-4xl font-bold text-gray-900">{pct}%</p>
        <p className="mt-1 text-sm text-gray-500">
          {score} / {questions.length} correct
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>
          Question {currentIndex + 1} / {questions.length}
        </span>
        <span className={timeLeft < 60 ? "text-red-600 font-semibold" : ""}>
          {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-base font-medium text-gray-900">{current.question}</p>

        {current.type === "multiple_choice" && current.options && (
          <ul className="mt-4 flex flex-col gap-2">
            {current.options.map((opt) => {
              let cls =
                "cursor-pointer rounded-lg border px-4 py-3 text-sm transition-colors ";
              if (showFeedback) {
                if (opt === current.correct_answer)
                  cls += "border-green-500 bg-green-50 text-green-800";
                else if (opt === selected)
                  cls += "border-red-400 bg-red-50 text-red-700";
                else cls += "border-gray-200 text-gray-500";
              } else {
                cls +=
                  opt === selected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 hover:border-gray-400";
              }
              return (
                <li key={opt}>
                  <button className={cls} onClick={() => handleSelect(opt)}>
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {showFeedback && current.explanation && (
          <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {current.explanation}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          {!showFeedback ? (
            <button
              onClick={handleConfirm}
              disabled={!selected}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
            >
              Confirm
            </button>
          ) : currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
            >
              Next question →
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
