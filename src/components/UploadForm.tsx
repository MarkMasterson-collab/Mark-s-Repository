"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: string }
  | { status: "success"; title: string; textExtracted: boolean }
  | { status: "error"; message: string };

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
};

const inputCls =
  "mt-1 block w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors placeholder:text-white/20";

export function UploadForm({ subjectId }: { subjectId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<UploadState>({ status: "idle" });

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"past_paper" | "notes" | "other">("past_paper");
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [examYear, setExamYear] = useState("");

  function reset() {
    setTitle("");
    setType("past_paper");
    setLanguage("en");
    setExamYear("");
    setState({ status: "idle" });
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleClose() {
    setOpen(false);
    reset();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setState({ status: "uploading", progress: "Uploading PDF…" });

    const fd = new FormData();
    fd.append("file", file);
    fd.append("subjectId", subjectId);
    fd.append("title", title);
    fd.append("type", type);
    fd.append("language", language);
    if (examYear) fd.append("examYear", examYear);

    const res = await fetch("/api/documents/upload", {
      method: "POST",
      body: fd,
    });

    const json = await res.json();

    if (!res.ok) {
      setState({ status: "error", message: json.error ?? "Upload failed" });
      return;
    }

    setState({
      status: "success",
      title: json.document.title,
      textExtracted: json.textExtracted,
    });

    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
        style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)" }}
      >
        Upload PDF
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: "rgba(15,15,15,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Upload PDF</h2>
              <button
                onClick={handleClose}
                className="text-white/30 hover:text-white/70 transition-colors text-lg leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {state.status === "success" ? (
              <div className="mt-6 text-center">
                <p className="text-3xl">✓</p>
                <p className="mt-3 font-medium text-white">{state.title}</p>
                <p className="mt-1 text-sm text-white/40">
                  {state.textExtracted
                    ? "Uploaded and text extracted."
                    : "Uploaded. Text extraction skipped."}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={reset}
                    className="rounded-lg px-4 py-2 text-sm text-white/60 transition-colors hover:text-white"
                    style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    Upload another
                  </button>
                  <button
                    onClick={handleClose}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Final Exam 2023"
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
                      Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as typeof type)}
                      className={inputCls}
                      style={{ ...inputStyle, colorScheme: "dark" }}
                    >
                      <option value="past_paper">Past paper</option>
                      <option value="notes">Course notes</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as typeof language)}
                      className={inputCls}
                      style={{ ...inputStyle, colorScheme: "dark" }}
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
                    Exam year{" "}
                    <span className="text-white/20 normal-case font-normal tracking-normal">(optional)</span>
                  </label>
                  <input
                    type="number"
                    value={examYear}
                    onChange={(e) => setExamYear(e.target.value)}
                    placeholder="e.g. 2023"
                    min={1990}
                    max={2100}
                    className={inputCls}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
                    PDF file <span className="text-red-400">*</span>
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/pdf"
                    required
                    className="mt-1 block w-full text-sm text-white/50 file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white file:transition-colors file:hover:opacity-80"
                    style={{ ...inputStyle, padding: "0.375rem" } as React.CSSProperties}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    {...({ "file:background": "rgba(255,255,255,0.08)" } as any)}
                  />
                  <p className="mt-1 text-xs text-white/25">Max 20 MB · PDF only</p>
                </div>

                {state.status === "error" && (
                  <p
                    className="rounded-lg px-3 py-2.5 text-sm"
                    style={{ background: "rgba(248,113,113,0.1)", color: "rgb(252,165,165)", border: "1px solid rgba(248,113,113,0.2)" }}
                  >
                    {state.message}
                  </p>
                )}

                <div className="mt-1 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg px-4 py-2 text-sm text-white/50 transition-colors hover:text-white/80"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={state.status === "uploading"}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {state.status === "uploading" ? state.progress : "Upload"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
