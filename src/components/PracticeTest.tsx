"use client";

import { useState, useEffect, useCallback } from "react";
import type { Database } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

type Question = Database["public"]["Tables"]["questions"]["Row"];

const TIME_PER_QUESTION = 90;

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

      const {
        data: { user },
      } = await supabase.auth.getUser();
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
    if (currentIndex === questions.length - 1) finish(updated);
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
      <div className="glass rounded-2xl p-10 text-center">
        <p
          className="text-6xl font-bold"
          style={{
            color: pct >= 70 ? "rgb(134,239,172)" : pct >= 50 ? "rgb(253,224,71)" : "rgb(252,165,165)",
          }}
        >
          {pct}%
        </p>
        <p className="mt-2 text-sm text-white/40">
          {score} / {questions.length} correct
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div
        className="mb-2 h-0.5 w-full rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full bg-white/30 transition-all"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      <div className="mb-6 flex items-center justify-between text-xs text-white/40">
        <span>
          {currentIndex + 1} / {questions.length}
        </span>
        <span
          className="font-mono font-semibold"
          style={{ color: timeLeft < 60 ? "rgb(252,165,165)" : undefined }}
        >
          {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="glass rounded-2xl p-6">
        <p className="text-base font-medium leading-relaxed text-white">
          {current.question}
        </p>

        {current.type === "multiple_choice" && current.options && (
          <ul className="mt-5 flex flex-col gap-2">
            {current.options.map((opt) => {
              let style: React.CSSProperties = {};
              let cls = "w-full cursor-pointer rounded-xl px-4 py-3 text-left text-sm transition-all ";

              if (showFeedback) {
                if (opt === current.correct_answer) {
                  style = { background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", color: "rgb(134,239,172)" };
                } else if (opt === selected) {
                  style = { background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "rgb(252,165,165)" };
                } else {
                  style = { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" };
                }
              } else if (opt === selected) {
                style = { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", color: "white" };
              } else {
                style = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" };
                cls += "hover:bg-white/[0.06] hover:border-white/20 ";
              }

              return (
                <li key={opt}>
                  <button className={cls} style={style} onClick={() => handleSelect(opt)}>
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {showFeedback && current.explanation && (
          <p
            className="mt-4 rounded-xl px-4 py-3 text-sm leading-relaxed"
            style={{ background: "rgba(147,197,253,0.07)", border: "1px solid rgba(147,197,253,0.15)", color: "rgba(147,197,253,0.9)" }}
          >
            {current.explanation}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          {!showFeedback ? (
            <button
              onClick={handleConfirm}
              disabled={!selected}
              className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-25"
            >
              Confirm
            </button>
          ) : currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Next →
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
