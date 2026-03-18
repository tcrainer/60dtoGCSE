import React, { useState, useEffect, useRef, useMemo } from "react";
import { Word, vocabulary } from "../data/vocabulary";
import { checkWritingAnswer } from "../utils/grading";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  ListChecks,
  PenLine,
  RotateCcw,
  Trophy,
  CheckCircle,
  Circle,
  Sparkles,
} from "lucide-react";

type Phase = "pick" | "browse" | "test" | "results" | "done";
type Section = "S1" | "S2" | "S3";

const SECTION_META: Record<Section, { label: string; title: string; color: string; bg: string; border: string; accent: string }> = {
  S1: { label: "Schreiben 1", title: "Informal Letter / Email", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", accent: "rose" },
  S2: { label: "Schreiben 2", title: "Opinion Piece", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", accent: "amber" },
  S3: { label: "Schreiben 3", title: "Formal Letter / Email", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200", accent: "indigo" },
};

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Clean display text: strip [INFORMAL], [FORMAL], [OPINION] tags */
function cleanTag(text: string): string {
  return text.replace(/\s*\[(?:INFORMAL|FORMAL|OPINION)\]\s*/g, "").trim();
}

export function PaperlikeMode({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("pick");
  const [section, setSection] = useState<Section>("S1");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [testWords, setTestWords] = useState<Word[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [round, setRound] = useState(1);
  const [totalCorrectEver, setTotalCorrectEver] = useState(0);
  const inputRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const sectionWords = useMemo(
    () => vocabulary.filter((w) => w.topicId === section),
    [section],
  );

  // Reset selections when section changes
  useEffect(() => {
    setSelectedIds(new Set(sectionWords.map((w) => w.id)));
  }, [sectionWords]);

  const meta = SECTION_META[section];

  // ── Handlers ───────────────────────────────────────────────────────────
  const toggleWord = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(sectionWords.map((w) => w.id)));
  const selectNone = () => setSelectedIds(new Set());

  const startTest = () => {
    const selected = sectionWords.filter((w) => selectedIds.has(w.id));
    if (selected.length === 0) return;
    const shuffled = shuffleArray(selected);
    setTestWords(shuffled);
    setAnswers({});
    setResults({});
    setRound(1);
    setTotalCorrectEver(0);
    setPhase("test");
  };

  const startRetest = () => {
    const wrongWords = testWords.filter((w) => !results[w.id]);
    const shuffled = shuffleArray(wrongWords);
    setTestWords(shuffled);
    setAnswers({});
    setResults({});
    setRound((r) => r + 1);
    setPhase("test");
  };

  const checkAnswers = () => {
    const newResults: Record<string, boolean> = {};
    let correctThisRound = 0;
    for (const word of testWords) {
      const userAnswer = (answers[word.id] || "").trim();
      const result = checkWritingAnswer(userAnswer, word.german);
      newResults[word.id] = result.isCorrect;
      if (result.isCorrect) correctThisRound++;
    }
    setResults(newResults);
    setTotalCorrectEver((prev) => prev + correctThisRound);

    const allCorrect = testWords.every((w) => newResults[w.id]);
    setPhase(allCorrect ? "done" : "results");
  };

  const handleKeyDown = (e: React.KeyboardEvent, wordId: string) => {
    if (e.key === "Tab") {
      // Move to next input
      const idx = testWords.findIndex((w) => w.id === wordId);
      if (idx < testWords.length - 1) {
        e.preventDefault();
        const nextId = testWords[idx + 1].id;
        inputRefs.current[nextId]?.focus();
      }
    }
  };

  // ── PHASE: Pick section ────────────────────────────────────────────────
  if (phase === "pick") {
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={onClose} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <PenLine className="w-3.5 h-3.5" /> Paperlike Mode
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Writing Practice</h1>
          <p className="text-gray-500">Choose a section and test yourself the old-fashioned way — with a vocabulary list.</p>
        </div>

        <div className="grid gap-4">
          {(["S1", "S2", "S3"] as Section[]).map((s) => {
            const m = SECTION_META[s];
            const count = vocabulary.filter((w) => w.topicId === s).length;
            return (
              <button
                key={s}
                onClick={() => { setSection(s); setPhase("browse"); }}
                className={`${m.bg} ${m.border} border-2 rounded-2xl p-6 text-left hover:shadow-lg transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-lg font-bold ${m.color}`}>{m.label}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{m.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{count} phrases</p>
                  </div>
                  <ArrowRight className={`w-5 h-5 ${m.color} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── PHASE: Browse & select words ───────────────────────────────────────
  if (phase === "browse") {
    return (
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setPhase("pick")} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to sections
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className={`text-2xl font-black ${meta.color}`}>{meta.label}</h2>
            <p className="text-sm text-gray-500">{meta.title} — {sectionWords.length} phrases</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={selectAll} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">Select all</button>
            <button onClick={selectNone} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">Select none</button>
          </div>
        </div>

        {/* Word list */}
        <div className={`${meta.bg} ${meta.border} border rounded-2xl divide-y divide-gray-200/60 overflow-hidden mb-6`}>
          {sectionWords.map((word) => {
            const isSelected = selectedIds.has(word.id);
            return (
              <button
                key={word.id}
                onClick={() => toggleWord(word.id)}
                className={`w-full text-left px-5 py-4 flex gap-4 items-start transition-colors ${isSelected ? "bg-white/70" : "bg-gray-50/50 opacity-50"}`}
              >
                <div className="pt-0.5 shrink-0">
                  {isSelected ? (
                    <CheckCircle className={`w-5 h-5 text-${meta.accent}-500`} />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                  {/* English (left) */}
                  <div>
                    <p className="text-sm font-semibold text-blue-800 break-words">{cleanTag(word.english)}</p>
                    {word.englishSentence && (
                      <p className="text-xs text-blue-500/70 mt-0.5 break-words italic">{word.englishSentence}</p>
                    )}
                  </div>
                  {/* German (right) */}
                  <div>
                    <p className="text-sm font-semibold text-yellow-800 break-words">{word.german}</p>
                    {word.germanSentence && (
                      <p className="text-xs text-yellow-600/70 mt-0.5 break-words italic">{word.germanSentence}</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Start test button */}
        <div className="sticky bottom-4">
          <button
            onClick={startTest}
            disabled={selectedIds.size === 0}
            className={`w-full py-4 text-white text-lg font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
              selectedIds.size > 0
                ? "bg-violet-600 hover:bg-violet-700 shadow-violet-200"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <ListChecks className="w-5 h-5" /> Test Yourself — {selectedIds.size} phrase{selectedIds.size !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    );
  }

  // ── PHASE: Test (write German) ─────────────────────────────────────────
  if (phase === "test") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-xl font-black ${meta.color}`}>{meta.label} — Round {round}</h2>
            <p className="text-sm text-gray-500">{testWords.length} phrase{testWords.length !== 1 ? "s" : ""} to translate</p>
          </div>
          <button onClick={() => setPhase("browse")} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
            Cancel
          </button>
        </div>

        <div className={`${meta.bg} ${meta.border} border rounded-2xl overflow-hidden mb-6`}>
          {testWords.map((word, idx) => (
            <div key={word.id} className={`px-5 py-4 ${idx > 0 ? "border-t border-gray-200/60" : ""}`}>
              <div className="flex gap-4 items-start">
                <span className="text-xs font-bold text-gray-400 mt-1.5 w-6 text-right shrink-0">{idx + 1}.</span>
                <div className="flex-1 min-w-0">
                  {/* English prompt */}
                  <p className="text-sm font-semibold text-blue-800 mb-1.5">{cleanTag(word.english)}</p>
                  {word.englishSentence && word.englishSentence !== cleanTag(word.english) && (
                    <p className="text-xs text-blue-500/60 italic mb-2">{word.englishSentence}</p>
                  )}
                  {/* German input */}
                  <textarea
                    ref={(el) => { inputRefs.current[word.id] = el; }}
                    value={answers[word.id] || ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [word.id]: e.target.value }))}
                    onKeyDown={(e) => handleKeyDown(e, word.id)}
                    placeholder="Type German translation..."
                    rows={1}
                    className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all bg-white resize-none"
                    style={{ minHeight: "42px" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={checkAnswers}
          className="w-full py-4 bg-violet-600 text-white text-lg font-bold rounded-2xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" /> Check All Answers
        </button>
      </div>
    );
  }

  // ── PHASE: Results (show wrong ones) ───────────────────────────────────
  if (phase === "results") {
    const wrongWords = testWords.filter((w) => !results[w.id]);
    const correctCount = testWords.length - wrongWords.length;

    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-1">Round {round} Results</h2>
          <p className="text-gray-500">
            <span className="font-bold text-emerald-600">{correctCount}</span> correct,{" "}
            <span className="font-bold text-rose-600">{wrongWords.length}</span> to retry
          </p>
        </div>

        {/* Show correct ones briefly */}
        {correctCount > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Correct</p>
            <div className="flex flex-wrap gap-2">
              {testWords.filter((w) => results[w.id]).map((w) => (
                <span key={w.id} className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">{w.german}</span>
              ))}
            </div>
          </div>
        )}

        {/* Show wrong ones with corrections */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-rose-200">
            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1"><X className="w-3.5 h-3.5" /> Needs practice — {wrongWords.length} phrase{wrongWords.length !== 1 ? "s" : ""}</p>
          </div>
          {wrongWords.map((word, idx) => (
            <div key={word.id} className={`px-5 py-4 ${idx > 0 ? "border-t border-rose-200/50" : ""}`}>
              <p className="text-sm font-semibold text-blue-800 mb-1">{cleanTag(word.english)}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                <div className="bg-rose-100 rounded-lg px-3 py-2">
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-0.5">You typed</p>
                  <p className="text-sm text-rose-700 font-medium break-words">{answers[word.id] || <span className="italic opacity-50">nothing</span>}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Correct answer</p>
                  <p className="text-sm text-emerald-800 font-bold break-words">{word.german}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={startRetest}
          className="w-full py-4 bg-violet-600 text-white text-lg font-bold rounded-2xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Retest {wrongWords.length} phrase{wrongWords.length !== 1 ? "s" : ""}
        </button>
      </div>
    );
  }

  // ── PHASE: Done (all correct!) ─────────────────────────────────────────
  if (phase === "done") {
    const originalCount = sectionWords.filter((w) => selectedIds.has(w.id)).length;

    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Trophy className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">All correct!</h2>
          <p className="text-gray-500 mb-6">
            You got all <span className="font-bold text-emerald-600">{testWords.length}</span> phrase{testWords.length !== 1 ? "s" : ""} right
            {round > 1 && <> in <span className="font-bold text-violet-600">{round}</span> round{round !== 1 ? "s" : ""}</>}.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-emerald-600">{originalCount}</p>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Phrases tested</p>
            </div>
            <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-violet-600">{round}</p>
              <p className="text-[10px] font-bold text-violet-700 uppercase tracking-wider">Round{round !== 1 ? "s" : ""}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setPhase("browse"); }}
              className={`w-full py-3 ${meta.bg} ${meta.color} font-bold rounded-2xl border-2 ${meta.border} hover:shadow-md transition-all flex items-center justify-center gap-2`}
            >
              <RotateCcw className="w-4 h-4" /> Practice {meta.label} again
            </button>
            <button
              onClick={() => setPhase("pick")}
              className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Choose another section
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-400 font-medium rounded-2xl hover:text-gray-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
