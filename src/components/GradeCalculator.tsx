"use client";
import { useState, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */
interface Comp  { id: string; label: string; weight: number }
interface Course {
  id: string; code?: string; name: string;
  mtCoeff: number; finCoeff: number; weight: number;
  comps?: Comp[];          // special multi-component courses
  noMidterm?: boolean;     // hint only – derived from mtCoeff===0
}
interface Mod   { id: string; name: string; semW?: number; credits?: number; courses: Course[] }
interface Sem   {
  id: string; name: string; tag: string; threshold: number;
  mods: Mod[];
  semGrade(modGrades: (number|null)[]): number|null;
}

/* ═══════════════════════════════════════════════════════════
   DATA  (extracted from EHL Grade Calculator .xlsx)
═══════════════════════════════════════════════════════════ */
const SEMS: Sem[] = [
  /* ── BOSC 1 ─────────────────────────────────────────── */
  {
    id:"b1", name:"BOSC 1", tag:"Semester 1", threshold:4,
    mods:[
      { id:"b1m1", name:"Module 1 — Business Tools I", semW:0.45, credits:9, courses:[
        {id:"b1_math",  code:"9104BR", name:"Mathematics",                      mtCoeff:0.2, finCoeff:0.8, weight:0.3 },
        {id:"b1_micro", code:"9102BR", name:"Microeconomics",                   mtCoeff:0.3, finCoeff:0.7, weight:0.2 },
        {id:"b1_acc",   code:"9101BC", name:"Financial Accounting",             mtCoeff:0.4, finCoeff:0.6, weight:0.3 },
        {id:"b1_mis",   code:"9103BR", name:"MIS Tools / Spreadsheets",         mtCoeff:0.2, finCoeff:0.8, weight:0.2 },
      ]},
      { id:"b1m2", name:"Module 2 — Foundations of Hospitality Mgmt I", semW:0.45, credits:9, courses:[
        {id:"b1_mkt", code:"9113BC", name:"Foundations of Hospitality Marketing",   mtCoeff:0.4, finCoeff:0.6, weight:0.34},
        {id:"b1_fnb", code:"9110BC", name:"Financial Mgmt for F&B Operations",      mtCoeff:0.3, finCoeff:0.7, weight:0.33},
        {id:"b1_hb",  code:"9114BC", name:"Human Behaviour & Performance",          mtCoeff:0.3, finCoeff:0.7, weight:0.33},
      ]},
      { id:"b1m3", name:"Module 3 — Communication & Culture I", semW:0.1, credits:2, courses:[
        {id:"b1_fr", code:"9121-2BM", name:"French A2.1",           mtCoeff:0.4, finCoeff:0.6, weight:0.4},
        {id:"b1_bc", code:"9120BM",   name:"Business Communication", mtCoeff:0.5, finCoeff:0.5, weight:0.6},
      ]},
    ],
    semGrade(mg) {
      // Credits: M1=9, M2=9, M3=2 (proportional to 0.45/0.45/0.10 weights)
      const cr=[9,9,2]; let s=0,tw=0;
      mg.forEach((g,i)=>{ if(g!==null){s+=g*cr[i];tw+=cr[i];}});
      return tw>0?round1(s/tw):null;
    },
  },

  /* ── BOSC 2 ─────────────────────────────────────────── */
  {
    id:"b2", name:"BOSC 2", tag:"Semester 2", threshold:4,
    mods:[
      { id:"b2m1", name:"Module 1 — Business Tools II", credits:15, courses:[
        {id:"b2_tfa",  name:"Topics in Financial Analysis", mtCoeff:0.4, finCoeff:0.6, weight:0.23},
        {id:"b2_mac",  name:"Macroeconomics",               mtCoeff:0.3, finCoeff:0.7, weight:0.23},
        {id:"b2_stat", name:"Statistics",                   mtCoeff:0,   finCoeff:1,   weight:0.3 },
        {id:"b2_ct",   name:"Computational Thinking",       mtCoeff:0.3, finCoeff:0.7, weight:0.23},
      ]},
      { id:"b2m2", name:"Module 2 — Foundations of Hospitality Mgmt II", credits:10, courses:[
        {id:"b2_sqd", name:"Service Quality and Design",                       mtCoeff:0.3, finCoeff:0.7, weight:0.33},
        {id:"b2_cid", name:"Customer Info & Distribution Channel Mgmt",        mtCoeff:0.3, finCoeff:0.7, weight:0.33},
        {id:"b2_rdm", name:"Room Division Management",                         mtCoeff:0.4, finCoeff:0.6, weight:0.34},
      ]},
      { id:"b2m3", name:"Module 3 — Communication & Culture II", credits:5, courses:[
        {id:"b2_fr2", name:"French A2.2",      mtCoeff:0.4,  finCoeff:0.6,  weight:0.33},
        {id:"b2_aw",  name:"Academic Writing", mtCoeff:0.15, finCoeff:0.85, weight:0.67},
      ]},
    ],
    semGrade(mg){
      // Credits: 15 / 10 / 5 (matching BOSC 3 pattern from spreadsheet)
      const cr=[15,10,5]; let s=0,tw=0;
      mg.forEach((g,i)=>{ if(g!==null){s+=g*cr[i];tw+=cr[i];}});
      return tw>0?round1(s/tw):null;
    },
  },

  /* ── BOSC 3 ─────────────────────────────────────────── */
  {
    id:"b3", name:"BOSC 3", tag:"Semester 3", threshold:4,
    mods:[
      { id:"b3m1", name:"Module 1 — Business Analysis", credits:15, courses:[
        { id:"b3_rev", name:"Revenue Management", mtCoeff:0, finCoeff:1, weight:0.31,
          comps:[
            {id:"quizzes", label:"Quizzes",  weight:0.2},
            {id:"midterm", label:"Midterm",  weight:0.4},
            {id:"revsim",  label:"RevSIM",   weight:0.4},
          ]
        },
        {id:"b3_man",  name:"Managerial Accounting",        mtCoeff:0,    finCoeff:1,    weight:0.23},
        {id:"b3_econ", name:"Hospitality Economics",        mtCoeff:0.15, finCoeff:0.85, weight:0.23},
        {id:"b3_som",  name:"Service Operations Management",mtCoeff:0,    finCoeff:1,    weight:0.23},
      ]},
      { id:"b3m2", name:"Module 2 — Applied Management", credits:10, courses:[
        {id:"b3_ism", name:"International Services Marketing", mtCoeff:0.5,  finCoeff:0.5,  weight:0.39},
        {id:"b3_tms", name:"Talent Management Systems",        mtCoeff:0.65, finCoeff:0.35, weight:0.39},
        {id:"b3_cs",  name:"Corporate Sustainability",         mtCoeff:0.3,  finCoeff:0.7,  weight:0.22},
      ]},
      { id:"b3m3", name:"Module 3 — Communication & Culture III", credits:5, courses:[
        {id:"b3_leg", name:"Legal Challenges of the Hospitality Mgr", mtCoeff:0.25, finCoeff:0.75, weight:0.67},
        {id:"b3_fl",  name:"Foreign Language Course",                 mtCoeff:0.4,  finCoeff:0.6,  weight:0.33},
      ]},
    ],
    semGrade(mg){
      // Credits from spreadsheet: M1=15, M2=10, M3=5
      const cr=[15,10,5]; let s=0,tw=0;
      mg.forEach((g,i)=>{ if(g!==null){s+=g*cr[i];tw+=cr[i];}});
      return tw>0?round1(s/tw):null;
    },
  },

  /* ── BOSC 5 ─────────────────────────────────────────── */
  {
    id:"b5", name:"BOSC 5", tag:"Semester 5", threshold:4,
    mods:[
      { id:"b5m1", name:"Module 1 — Integrated Business Analysis", credits:15, courses:[
        {id:"b5_cf",     name:"Corporate Finance",       mtCoeff:0.4,  finCoeff:0.6,  weight:0.37  },
        {id:"b5_cstrat", name:"Corporate Strategy",      mtCoeff:0.45, finCoeff:0.55, weight:0.37  },
        {id:"b5_mr",     name:"Market Research (SBP)",   mtCoeff:0,    finCoeff:1,    weight:0.085 },
        {id:"b5_pm",     name:"Project Management (SBP)",mtCoeff:0.3,  finCoeff:0.7,  weight:0.175 },
      ]},
      { id:"b5m2", name:"Module 2 — Integrated Hospitality Management", credits:15, courses:[
        {id:"b5_ham", name:"Hotel Asset Management",            mtCoeff:0.4, finCoeff:0.6, weight:0.33},
        {id:"b5_lob", name:"Leadership & Organisational Behaviour", mtCoeff:0.4, finCoeff:0.6, weight:0.33},
        {id:"b5_ref", name:"Real Estate Finance",               mtCoeff:0.4, finCoeff:0.6, weight:0.34},
      ]},
    ],
    semGrade(mg){
      // BOSC 5 has 2 modules — equal credits (15 each)
      const cr=[15,15]; let s=0,tw=0;
      mg.forEach((g,i)=>{ if(g!==null){s+=g*cr[i];tw+=cr[i];}});
      return tw>0?round1(s/tw):null;
    },
  },
];

/* ═══════════════════════════════════════════════════════════
   CALCULATION HELPERS
═══════════════════════════════════════════════════════════ */
type GS = Record<string, Record<string, string>>;

/** Round to 1 decimal place — EHL rule: 3.95 → 4.0 (standard rounding) */
function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

function parseG(s?: string): number|null {
  if (!s?.trim()) return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function clamp(n:number){ return Math.max(1, Math.min(6, n)); }

function calcCourse(c: Course, g: Record<string,string>={}): number|null {
  if (c.comps) {
    let sum=0, tw=0;
    for (const comp of c.comps) {
      const v=parseG(g[comp.id]);
      if (v===null) return null;
      sum+=v*comp.weight; tw+=comp.weight;
    }
    return tw>0 ? sum/tw : null;
  }
  if (c.mtCoeff===0) return parseG(g.final);
  const mt=parseG(g.midterm), fin=parseG(g.final);
  if (mt===null || fin===null) return null;
  return mt*c.mtCoeff + fin*c.finCoeff;
}

function calcMod(mod: Mod, gs: GS): number|null {
  let sum=0, tw=0, hasAny=false;
  for (const c of mod.courses) {
    const g=calcCourse(c, gs[c.id]);
    if (g!==null){ sum+=g*c.weight; tw+=c.weight; hasAny=true; }
  }
  if (!hasAny) return null;
  const raw = tw>0 ? sum/tw : null;
  // EHL rounds module grades to 1 decimal — so 3.95 → 4.0 (pass)
  return raw !== null ? round1(raw) : null;
}

/** If midterm is entered and final is empty, return required final to hit target course grade */
function neededFinal(c: Course, g: Record<string,string>={}, target=4): number|null {
  if (c.comps || c.mtCoeff===0) return null;
  const mt=parseG(g.midterm);
  if (mt===null || parseG(g.final)!==null) return null;
  return clamp((target - mt*c.mtCoeff) / c.finCoeff);
}

function gradeColor(g: number|null, threshold=4): string {
  if (g===null) return "#9CA3AF";
  if (g >= 5)          return "#10B981";
  if (g >= threshold)  return "#4F46E5";
  return "#EF4444";
}
function gradeTextColor(g: number|null, threshold=4): string {
  if (g===null) return "text-[#9CA3AF]";
  if (g >= 5)          return "text-[#10B981]";
  if (g >= threshold)  return "text-[#4F46E5]";
  return "text-[#EF4444]";
}

function fmt(g: number|null, decimals=1): string {
  if (g===null) return "—";
  return g.toFixed(decimals);
}

/* ═══════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════ */
function GradeInput({
  value, onChange, disabled=false,
}: { value:string; onChange:(v:string)=>void; disabled?:boolean }) {
  return (
    <input
      type="number" min={1} max={6} step={0.1}
      value={value}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      placeholder="1–6"
      className="w-[4.5rem] rounded-lg border border-[rgba(79,70,229,0.18)] bg-white/90 px-2 py-1.5 text-center text-sm font-semibold text-[#0F0E2A] outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-[rgba(79,70,229,0.12)] disabled:opacity-40 disabled:cursor-not-allowed"
    />
  );
}

function GradeBadge({ value, threshold=4, decimals=1 }: { value:number|null; threshold?:number; decimals?:number }) {
  const color = gradeColor(value, threshold);
  return (
    <span className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums"
      style={{ background:`${color}14`, color, border:`1.5px solid ${color}30` }}>
      {fmt(value, decimals)}
    </span>
  );
}

function PassBadge({ grade, threshold }: { grade:number|null; threshold:number }) {
  if (grade===null) return <span className="text-xs text-[#9CA3AF]">—</span>;
  const pass = grade >= threshold;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${pass?"bg-[#10B981]/10 text-[#10B981]":"bg-[#EF4444]/10 text-[#EF4444]"}`}>
      {pass ? "✓ Pass" : "✗ Fail"}
    </span>
  );
}

/* ─── Single course row ─────────────────────────────────── */
function CourseRow({
  course, gs, setGs, threshold,
}: {
  course: Course;
  gs: GS;
  setGs: React.Dispatch<React.SetStateAction<GS>>;
  threshold: number;
}) {
  const g = gs[course.id] ?? {};
  const grade = calcCourse(course, g);
  const needed = neededFinal(course, g, threshold);

  function set(field: string, val: string) {
    setGs(prev => ({
      ...prev,
      [course.id]: { ...prev[course.id], [field]: val },
    }));
  }

  return (
    <div className="group">
      {/* Main row */}
      <div className="grid items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-[rgba(79,70,229,0.03)]"
        style={{ gridTemplateColumns: course.comps ? "1fr auto" : "1fr auto auto auto" }}>

        {/* Course name */}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#0F0E2A]">{course.name}</p>
          {course.code && <p className="text-[10px] text-[#9CA3AF]">{course.code}</p>}
        </div>

        {course.comps ? (
          /* Multi-component (e.g. Revenue Management) */
          <div className="flex flex-wrap items-center gap-2">
            {course.comps.map(comp => (
              <label key={comp.id} className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  {comp.label} ({Math.round(comp.weight*100)}%)
                </span>
                <GradeInput value={g[comp.id]??""} onChange={v=>set(comp.id,v)} />
              </label>
            ))}
            <GradeBadge value={grade} threshold={threshold} decimals={2} />
          </div>
        ) : (
          <>
            {/* Midterm input */}
            {course.mtCoeff > 0 ? (
              <label className="flex flex-col items-center gap-0.5">
                <span className="text-[9px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  MT {Math.round(course.mtCoeff*100)}%
                </span>
                <GradeInput value={g.midterm??""} onChange={v=>set("midterm",v)} />
              </label>
            ) : (
              <div className="w-[4.5rem] text-center text-xs text-[#D1D5DB]">—</div>
            )}

            {/* Final input */}
            <label className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                Final {Math.round(course.finCoeff*100)}%
              </span>
              <GradeInput value={g.final??""} onChange={v=>set("final",v)} />
            </label>

            {/* Grade result */}
            <GradeBadge value={grade} threshold={threshold} />
          </>
        )}
      </div>

      {/* Needed-final hint */}
      {needed !== null && (
        <p className="mb-1 px-3 text-[11px] text-[#F97316]">
          📌 You need <strong>{needed.toFixed(2)}</strong> on the final to pass this course
        </p>
      )}
    </div>
  );
}

/* ─── Module card ───────────────────────────────────────── */
function ModuleCard({
  mod, gs, setGs, threshold,
}: {
  mod: Mod; gs: GS;
  setGs: React.Dispatch<React.SetStateAction<GS>>;
  threshold: number;
}) {
  const [open, setOpen] = useState(true);
  const grade = calcMod(mod, gs);

  // Check if ALL courses are fully entered (no partial)
  const allFilled = mod.courses.every(c => calcCourse(c, gs[c.id]) !== null);
  const isPartial = grade !== null && !allFilled;

  const modColor = gradeColor(grade, threshold);

  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(79,70,229,0.1)] bg-white/60 shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left"
        style={{ borderBottom: open ? "1px solid rgba(79,70,229,0.08)" : "none" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-display text-sm font-bold text-[#0F0E2A] leading-tight">{mod.name}</span>
          {mod.credits && (
            <span className="shrink-0 rounded-full bg-[rgba(79,70,229,0.08)] px-2 py-0.5 text-[10px] font-semibold text-[#4F46E5]">
              {mod.credits} cr
            </span>
          )}
          {isPartial && (
            <span className="shrink-0 rounded-full bg-[#F97316]/10 px-2 py-0.5 text-[10px] font-semibold text-[#F97316]">
              partial
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <PassBadge grade={allFilled ? grade : null} threshold={threshold} />
          <GradeBadge value={grade} threshold={threshold} />
          <svg className={`h-4 w-4 text-[#9CA3AF] transition-transform ${open?"rotate-180":""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </button>

      {/* Courses */}
      {open && (
        <div className="divide-y divide-[rgba(79,70,229,0.05)] px-1 py-1">
          {mod.courses.map(c => (
            <CourseRow key={c.id} course={c} gs={gs} setGs={setGs} threshold={threshold} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Semester summary card ─────────────────────────────── */
function SemesterSummary({
  sem, modGrades, semGrade,
}: {
  sem: Sem; modGrades: (number|null)[]; semGrade: number|null;
}) {
  const color = gradeColor(semGrade, sem.threshold);
  const totalPasses = modGrades.filter(g => g !== null && g >= sem.threshold).length;
  const totalMods   = sem.mods.length;

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-[rgba(79,70,229,0.12)] bg-white/80 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        {/* Big grade */}
        <div className="flex items-baseline gap-2">
          <span className="font-display text-5xl font-bold tabular-nums" style={{ color }}>
            {fmt(semGrade, 1)}
          </span>
          <span className="text-sm font-medium text-[#9CA3AF]">/ 6.0</span>
        </div>

        {/* Divider */}
        <div className="hidden h-12 w-px bg-[rgba(79,70,229,0.08)] sm:block" />

        {/* Module badges */}
        <div className="flex flex-wrap gap-2">
          {sem.mods.map((mod, i) => {
            const mg = modGrades[i];
            const c  = gradeColor(mg, sem.threshold);
            return (
              <div key={mod.id} className="flex flex-col gap-0.5 rounded-xl px-3 py-2"
                style={{ background:`${c}0d`, border:`1px solid ${c}28` }}>
                <span className="text-[10px] font-semibold uppercase tracking-wide" style={{color:c}}>
                  Module {i+1}{mod.credits ? ` · ${mod.credits}cr` : ""}
                </span>
                <span className="font-display text-lg font-bold tabular-nums" style={{color:c}}>
                  {fmt(mg, 1)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="hidden h-12 w-px bg-[rgba(79,70,229,0.08)] sm:block" />

        {/* Status */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Status</span>
          {modGrades.some(g=>g!==null) ? (
            <div className="flex items-center gap-1.5">
              {modGrades.map((g,i) => {
                const pass = g!==null && g>=sem.threshold;
                const entered = g!==null;
                return (
                  <div key={i} className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold
                    ${!entered ? "bg-[#F3F4F6] text-[#9CA3AF]" :
                      pass ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#EF4444]/15 text-[#EF4444]"}`}>
                    {!entered ? "?" : pass ? "✓" : "✗"}
                  </div>
                );
              })}
              <span className="text-xs text-[#6B7280]">{totalPasses}/{totalMods} modules passing</span>
            </div>
          ) : (
            <span className="text-xs text-[#9CA3AF]">Enter grades to begin</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export function GradeCalculator() {
  const [activeTab, setActiveTab] = useState(0);
  const [allGrades, setAllGrades] = useState<Record<string, GS>>({});

  const sem = SEMS[activeTab];

  const gs: GS = allGrades[sem.id] ?? {};
  const setGs: React.Dispatch<React.SetStateAction<GS>> = (updater) => {
    setAllGrades(prev => ({
      ...prev,
      [sem.id]: typeof updater === "function" ? updater(prev[sem.id] ?? {}) : updater,
    }));
  };

  const modGrades = useMemo(() => sem.mods.map(m => calcMod(m, gs)), [sem, gs]);
  const semGrade  = useMemo(() => sem.semGrade(modGrades), [sem, modGrades]);

  function resetSem() {
    setAllGrades(prev => ({ ...prev, [sem.id]: {} }));
  }

  return (
    <div>
      {/* ── Tab bar ── */}
      <div className="mb-6 flex gap-1.5 rounded-2xl bg-white/60 p-1.5 shadow-sm" style={{ border:"1px solid rgba(79,70,229,0.08)" }}>
        {SEMS.map((s, i) => {
          const active = i === activeTab;
          return (
            <button key={s.id} onClick={() => setActiveTab(i)}
              className={`flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-[#4F46E5] text-white shadow-sm"
                  : "text-[#6B7280] hover:bg-[rgba(79,70,229,0.05)] hover:text-[#4F46E5]"
              }`}>
              <span className="block">{s.name}</span>
              <span className={`block text-[10px] font-medium ${active?"text-white/70":"text-[#9CA3AF]"}`}>{s.tag}</span>
            </button>
          );
        })}
      </div>

      {/* ── Semester summary ── */}
      <SemesterSummary sem={sem} modGrades={modGrades} semGrade={semGrade} />

      {/* ── Passing note ── */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-[#9CA3AF]">
          Pass threshold: <strong className="text-[#6B7280]">{sem.threshold}.0</strong> per module · Swiss grading (1–6)
        </p>
        <button onClick={resetSem}
          className="cursor-pointer rounded-lg px-3 py-1 text-xs font-medium text-[#9CA3AF] transition hover:bg-[rgba(239,68,68,0.06)] hover:text-[#EF4444]">
          Reset
        </button>
      </div>

      {/* ── Module cards ── */}
      <div className="flex flex-col gap-3">
        {sem.mods.map(mod => (
          <ModuleCard key={mod.id} mod={mod} gs={gs} setGs={setGs} threshold={sem.threshold} />
        ))}
      </div>

      {/* ── Footer note ── */}
      <div className="mt-6 rounded-xl border border-[rgba(79,70,229,0.08)] bg-white/40 px-4 py-3 text-center">
        <p className="text-[11px] text-[#6B7280]">
          <strong className="text-[#4F46E5]">Rounding:</strong> Module grades are rounded to 1 decimal (e.g. 3.95 → 4.0 = ✓ pass) ·
          <strong className="text-[#4F46E5]"> GPA:</strong> Semester grade is credit-weighted (credits shown on each module) ·
          Pass/Fail shows only when all courses in a module are filled in
        </p>
      </div>
    </div>
  );
}
