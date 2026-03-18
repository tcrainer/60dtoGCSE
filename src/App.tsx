/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Flashcard } from "./components/Flashcard";
import { PaperlikeMode } from "./components/PaperlikeMode";
import { Word } from "./data/vocabulary";

export default function App() {
  const [session, setSession] = useState<{
    mode: "test" | "learn" | "revise" | "practice";
    words: Word[];
  } | null>(null);
  const [showPaperlike, setShowPaperlike] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight text-indigo-900">
            GCSE & B1 <span className="text-indigo-600">Vocab</span>
          </h1>
          <div className="flex items-center gap-4">
            {(session || showPaperlike) && (
              <button
                onClick={() => { setSession(null); setShowPaperlike(false); }}
                className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                End Session
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="py-8 px-4 sm:px-6">
        {session ? (
          <Flashcard
            words={session.words}
            mode={session.mode}
            onComplete={() => setSession(null)}
          />
        ) : showPaperlike ? (
          <PaperlikeMode onClose={() => setShowPaperlike(false)} />
        ) : (
          <Dashboard
            onStartSession={(mode, words) => setSession({ mode, words })}
            onOpenPaperlike={() => setShowPaperlike(true)}
          />
        )}
      </main>
    </div>
  );
}
