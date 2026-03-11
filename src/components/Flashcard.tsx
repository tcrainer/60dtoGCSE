import React, { useState, useEffect, useRef, useCallback } from "react";
import { Word } from "../data/vocabulary";
import { checkAnswer, checkWritingAnswer, stripArticle, removeParentheses } from "../utils/grading";
import { useStore } from "../store/useStore";
import { ArrowRight, Check, X, HelpCircle } from "lucide-react";

interface FlashcardProps {
  words: Word[];
  mode: "test" | "learn" | "revise" | "practice";
  onComplete: () => void;
}

export function Flashcard({ words, mode, onComplete }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [verbInputs, setVerbInputs] = useState({
    germanInf: "",
    german3rd: "",
    germanImp: "",
    germanPerf: "",
    englishInf: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [gradingMessage, setGradingMessage] = useState<string | undefined>();
  const [askGerman, setAskGerman] = useState(true);
  const [sessionResults, setSessionResults] = useState<{ wordId: string; correct: boolean }[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [wrongAnswer, setWrongAnswer] = useState<{ typed: string; correct: string } | null>(null);

  const lastActivityRef = useRef(Date.now());
  const activeTimeRef = useRef(0);

  const { addPoints, addTime, updateWord, stats } = useStore();

  const lastSubmitTimeRef = useRef(0);
  const justAdvancedRef = useRef(false);

  const currentWord = words[currentIndex];

  useEffect(() => {
    setAskGerman(true);
    setHint(null);
  }, [currentIndex]);

  useEffect(() => {
    if (currentWord?.isVerb) {
      setVerbInputs({
        germanInf: "",
        german3rd: currentWord.german3rdPerson === "—" ? "—" : "",
        germanImp: currentWord.germanImperfekt === "—" ? "—" : "",
        germanPerf: currentWord.germanPerfekt === "—" ? "—" : "",
        englishInf: "",
      });
    } else {
      setInput("");
    }
  }, [currentIndex, currentWord]);

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current < 15000) {
        activeTimeRef.current += 1;
      }
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      clearInterval(interval);
      if (activeTimeRef.current > 0) {
        addTime(activeTimeRef.current, mode);
      }
    };
  }, [addTime, mode]);

  const handleNext = useCallback(() => {
    if (!showResult) return;
    setShowResult(false);
    setInput("");
    const nextWord = words[currentIndex + 1];
    if (nextWord?.isVerb) {
      setVerbInputs({
        germanInf: "",
        german3rd: nextWord.german3rdPerson === "—" ? "—" : "",
        germanImp: nextWord.germanImperfekt === "—" ? "—" : "",
        germanPerf: nextWord.germanPerfekt === "—" ? "—" : "",
        englishInf: "",
      });
    } else {
      setVerbInputs({
        germanInf: "",
        german3rd: "",
        germanImp: "",
        germanPerf: "",
        englishInf: "",
      });
    }
    setAskGerman(true);
    setHint(null);
    setWrongAnswer(null);
    justAdvancedRef.current = true;
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, words, showResult]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 400) return;
    lastSubmitTimeRef.current = now;

    if (showResult) {
      handleNext();
      return;
    }

    if (justAdvancedRef.current) {
      justAdvancedRef.current = false;
      return;
    }

    let correct = false;
    let points = 0;
    let message: string | undefined;

    if (currentWord.isVerb) {
      if (askGerman) {
        const infRes = checkAnswer(verbInputs.germanInf, currentWord.german, true);
        
        // 3rd person check
        let thirdRes = { isCorrect: true, points: 0 };
        if (currentWord.german3rdPerson && currentWord.german3rdPerson !== "—") {
          thirdRes = checkAnswer(verbInputs.german3rd, currentWord.german3rdPerson, true);
        }

        // Imperfekt check
        let impRes = { isCorrect: true, points: 0 };
        if (currentWord.germanImperfekt && currentWord.germanImperfekt !== "—") {
          impRes = checkAnswer(verbInputs.germanImp, currentWord.germanImperfekt, true);
        }

        // Perfekt check
        let perfRes = { isCorrect: true, points: 0 };
        if (currentWord.germanPerfekt && currentWord.germanPerfekt !== "—") {
          perfRes = checkAnswer(verbInputs.germanPerf, currentWord.germanPerfekt, true);
        }

        correct = infRes.isCorrect && thirdRes.isCorrect && impRes.isCorrect && perfRes.isCorrect;
        points = infRes.points + thirdRes.points + impRes.points + perfRes.points;
        if (!correct) {
          const errors = [];
          if (!infRes.isCorrect) errors.push("Infinitive");
          if (!thirdRes.isCorrect) errors.push("3rd Person");
          if (!impRes.isCorrect) errors.push("Imperfekt");
          if (!perfRes.isCorrect) errors.push("Perfekt");
          message = `Check: ${errors.join(", ")}`;
        }
      } else {
        const res = checkAnswer(verbInputs.englishInf, currentWord.english, false);
        correct = res.isCorrect;
        points = res.points;
        message = res.message;
      }
    } else {
      const isWritingTopic = currentWord.topicId.startsWith("S");
      const target = askGerman ? currentWord.german : currentWord.english;
      const result = isWritingTopic
        ? checkWritingAnswer(input, target)
        : checkAnswer(input, target, askGerman);
      correct = result.isCorrect;
      points = result.points;
      message = result.message;
    }

    setIsCorrect(correct);
    setPointsEarned(points);
    setGradingMessage(message);
    setShowResult(true);

    if (!correct) {
      // Build a human-readable "what you typed" for the comparison panel
      let typed = "";
      let correctAnswer = "";
      if (currentWord.isVerb && askGerman) {
        typed = [verbInputs.germanInf, verbInputs.german3rd, verbInputs.germanImp, verbInputs.germanPerf]
          .filter(v => v && v !== "—").join(" / ");
        correctAnswer = [currentWord.german, currentWord.german3rdPerson, currentWord.germanImperfekt, currentWord.germanPerfekt]
          .filter(v => v && v !== "—").join(" / ");
      } else if (currentWord.isVerb && !askGerman) {
        typed = verbInputs.englishInf;
        correctAnswer = currentWord.english;
      } else {
        typed = input;
        correctAnswer = (askGerman ? currentWord.german : currentWord.english)
          .replace(/\s*\[(?:INFORMAL|FORMAL|OPINION)\]/g, "");
      }
      setWrongAnswer({ typed, correct: correctAnswer });
    }

    if (correct) {
      addPoints(points);
    }

    updateWord(currentWord.id, correct, mode);
    setSessionResults(prev => [...prev, { wordId: currentWord.id, correct }]);

    addTime(activeTimeRef.current, mode);
    activeTimeRef.current = 0;
  }, [currentWord, askGerman, verbInputs, input, mode, addPoints, updateWord, addTime, showResult, handleNext]);

  const handleHint = useCallback(() => {
    if (showResult || hint) return;
    const target = (askGerman ? currentWord.german : currentWord.english).replace(/\s*\[(?:INFORMAL|FORMAL|OPINION)\]/g, "");
    const mainWord = stripArticle(removeParentheses(target.split(/[/,]/)[0].trim()));
    if (mainWord.length > 0) {
      setHint(mainWord[0]);
    }
  }, [currentWord, askGerman, showResult, hint]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (!currentWord) {
          onComplete();
        }
      } else if (e.key === "?") {
        e.preventDefault();
        handleHint();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [currentWord, onComplete, handleHint]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field?: keyof typeof verbInputs) => {
    if (e.key >= "1" && e.key <= "7") {
      e.preventDefault();
      const charMap: Record<string, string> = {
        "1": "ä",
        "2": "ö",
        "3": "ü",
        "4": "ß",
        "5": "Ä",
        "6": "Ö",
        "7": "Ü",
      };
      const char = charMap[e.key];
      if (char) {
        if (field) {
          setVerbInputs(prev => ({ ...prev, [field]: prev[field] + char }));
        } else {
          setInput((prev) => prev + char);
        }
      }
    }
  };

  const insertChar = (char: string, field?: keyof typeof verbInputs) => {
    if (field) {
      setVerbInputs(prev => ({ ...prev, [field]: prev[field] + char }));
    } else {
      setInput((prev) => prev + char);
    }
  };

  const renderShortcuts = (field?: keyof typeof verbInputs) => (
    <div className="flex gap-2 justify-center mt-4">
      {[
        { key: "1", char: "ä" },
        { key: "2", char: "ö" },
        { key: "3", char: "ü" },
        { key: "4", char: "ß" },
        { key: "5", char: "Ä" },
        { key: "6", char: "Ö" },
        { key: "7", char: "Ü" },
      ].map(({ key, char }) => (
        <button
          key={key}
          type="button"
          onClick={() => insertChar(char, field)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 font-medium text-sm flex flex-col items-center gap-1 transition-colors"
        >
          <span className="text-xs text-gray-400">{key}</span>
          <span className="text-lg leading-none">{char}</span>
        </button>
      ))}
    </div>
  );

  const progress = (currentIndex / words.length) * 100;

  const renderVerbInputs = () => {
    if (askGerman) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest ml-1">Infinitive</label>
            <input
              type="text"
              value={verbInputs.germanInf}
              onChange={(e) => {
                setVerbInputs(prev => ({ ...prev, germanInf: e.target.value }));
                justAdvancedRef.current = false;
              }}
              onKeyDown={(e) => handleKeyDown(e, "germanInf")}
              placeholder="Infinitive..."
              className="w-full px-4 py-3 text-base border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all bg-white"
              autoFocus
              autoComplete="off"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest ml-1">3rd person (er, sie, es)</label>
            <input
              type="text"
              value={verbInputs.german3rd}
              onChange={(e) => {
                setVerbInputs(prev => ({ ...prev, german3rd: e.target.value }));
                justAdvancedRef.current = false;
              }}
              onKeyDown={(e) => handleKeyDown(e, "german3rd")}
              placeholder={currentWord.german3rdPerson === "—" ? "—" : "3rd Person..."}
              disabled={currentWord.german3rdPerson === "—"}
              className={`w-full px-4 py-3 text-base border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all ${currentWord.german3rdPerson === "—" ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-white"}`}
              autoComplete="off"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest ml-1">Imperfekt (ich)</label>
            <input
              type="text"
              value={verbInputs.germanImp}
              onChange={(e) => {
                setVerbInputs(prev => ({ ...prev, germanImp: e.target.value }));
                justAdvancedRef.current = false;
              }}
              onKeyDown={(e) => handleKeyDown(e, "germanImp")}
              placeholder={currentWord.germanImperfekt === "—" ? "—" : "Imperfekt..."}
              disabled={currentWord.germanImperfekt === "—"}
              className={`w-full px-4 py-3 text-base border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all ${currentWord.germanImperfekt === "—" ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-white"}`}
              autoComplete="off"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest ml-1">Perfekt (ich)</label>
            <input
              type="text"
              value={verbInputs.germanPerf}
              onChange={(e) => {
                setVerbInputs(prev => ({ ...prev, germanPerf: e.target.value }));
                justAdvancedRef.current = false;
              }}
              onKeyDown={(e) => handleKeyDown(e, "germanPerf")}
              placeholder={currentWord.germanPerfekt === "—" ? "—" : "Perfekt..."}
              disabled={currentWord.germanPerfekt === "—"}
              className={`w-full px-4 py-3 text-base border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all ${currentWord.germanPerfekt === "—" ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-white"}`}
              autoComplete="off"
            />
          </div>
          {hint && (
            <div className="sm:col-span-2 text-center text-sm font-bold text-yellow-600 animate-pulse">
              Hint: Starts with "{hint}"
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="w-full max-w-md space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest ml-1">Infinitive</label>
            <input
              type="text"
              value={verbInputs.englishInf}
              onChange={(e) => {
                setVerbInputs(prev => ({ ...prev, englishInf: e.target.value }));
                justAdvancedRef.current = false;
              }}
              placeholder="English translation..."
              className="w-full px-6 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white"
              autoFocus
              autoComplete="off"
            />
          </div>
          {hint && (
            <div className="text-center text-sm font-bold text-blue-500 animate-pulse">
              Hint: Starts with "{hint}"
            </div>
          )}
        </div>
      );
    }
  };

  if (!currentWord) {
    return <SessionSummary results={sessionResults} mode={mode} onComplete={onComplete} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-medium text-gray-500">
          {currentIndex + 1} / {words.length}
        </div>
        <div className="text-lg font-bold text-indigo-600">
          {stats.points} pts
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Top Half - Light Blue - English */}
        <div className="flex-1 bg-blue-50 p-8 flex flex-col justify-center items-center min-h-[220px] border-b border-blue-100 relative">
          <span className="absolute top-4 left-4 text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
            English
            {currentWord.topicId === "S1" && (
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold normal-case">✉ Informal letter</span>
            )}
            {currentWord.topicId === "S2" && (
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-bold normal-case">💬 Opinion piece</span>
            )}
            {currentWord.topicId === "S3" && (
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold normal-case">📋 Formal letter</span>
            )}
          </span>
          {!askGerman && !showResult ? (
            <div className="w-full">
              {currentWord.isVerb ? renderVerbInputs() : (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    justAdvancedRef.current = false;
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type English translation..."
                  className="w-full px-6 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white"
                  autoFocus
                  autoComplete="off"
                />
              )}
              {hint && (
                <div className="mt-2 text-sm font-bold text-blue-500 animate-pulse">
                  Hint: Starts with "{hint}"
                </div>
              )}
              {renderShortcuts()}
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
                {currentWord.english.replace(/\s*\[(?:INFORMAL|FORMAL|OPINION)\]/g, "")}
                {!showResult && (
                  <button
                    type="button"
                    onClick={handleHint}
                    className="p-1 hover:bg-blue-100 rounded-full transition-colors text-blue-400"
                    title="Hint"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                )}
              </h2>
              {currentWord.topicId.startsWith("S") && !showResult && (() => {
                // Show underscores for each word in the expected German answer
                const firstOption = currentWord.german.split("/")[0].trim();
                const wordCount = firstOption.replace(/\(.*?\)/g, "").trim().split(/\s+/).filter(Boolean).length;
                return (
                  <p className="mt-2 text-blue-300 tracking-widest text-lg font-bold select-none">
                    {Array.from({ length: wordCount }).map((_, i) => (
                      <span key={i} className="inline-block border-b-2 border-blue-300 w-8 mx-1">&nbsp;</span>
                    ))}
                    <span className="text-xs font-normal text-blue-400 ml-2 tracking-normal">{wordCount} word{wordCount !== 1 ? "s" : ""}</span>
                  </p>
                );
              })()}
              {currentWord.isVerb && (
                <div className="mt-2 flex gap-4 justify-center text-sm font-medium text-blue-600">
                  <span>{currentWord.englishImperfekt}</span>
                  <span>•</span>
                  <span>{currentWord.englishPerfekt}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Half - Light Red - German */}
        <div className="flex-1 bg-yellow-50 p-8 flex flex-col justify-center items-center min-h-[220px] relative">
          <span className="absolute top-4 left-4 text-xs font-bold text-yellow-600 uppercase tracking-wider">
            Deutsch
          </span>
          {askGerman && !showResult ? (
            <div className="w-full">
              {currentWord.isVerb ? renderVerbInputs() : (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    justAdvancedRef.current = false;
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type German translation..."
                  className="w-full px-6 py-4 text-lg border-2 border-yellow-200 rounded-2xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 outline-none transition-all bg-white"
                  autoFocus
                  autoComplete="off"
                />
              )}
              {hint && (
                <div className="mt-2 text-sm font-bold text-yellow-600 animate-pulse">
                  Hint: Starts with "{hint}"
                </div>
              )}
              {renderShortcuts()}
            </div>
          ) : (
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold text-yellow-900 flex items-center gap-2">
                {currentWord.german}
                {!showResult && (
                  <button
                    type="button"
                    onClick={handleHint}
                    className="p-1 hover:bg-yellow-100 rounded-full transition-colors text-yellow-600"
                    title="Hint"
                  >
                    <HelpCircle className="w-6 h-6" />
                  </button>
                )}
              </h2>
              {currentWord.isVerb && (
                <div className="flex flex-wrap gap-3 justify-center">
                  {currentWord.german3rdPerson && currentWord.german3rdPerson !== "—" && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
                      {currentWord.german3rdPerson}
                    </span>
                  )}
                  {currentWord.germanImperfekt && currentWord.germanImperfekt !== "—" && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
                      {currentWord.germanImperfekt}
                    </span>
                  )}
                  {currentWord.germanPerfekt && currentWord.germanPerfekt !== "—" && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
                      {currentWord.germanPerfekt}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="p-6 bg-white border-t border-gray-100 flex gap-4">
          {!showResult ? (
            <>
              <button
                type="button"
                onClick={handleHint}
                disabled={!!hint}
                className="px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                title="Hint (Shortcut: ?)"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-2xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                Check Answer <ArrowRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              <div
                className={`p-4 rounded-2xl flex items-center justify-between ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}
                  >
                    {isCorrect ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <X className="w-6 h-6" />
                    )}
                  </div>
                  <h3
                    className={`text-lg font-bold ${isCorrect ? "text-emerald-800" : "text-rose-800"}`}
                  >
                    {isCorrect ? (isCorrect && !gradingMessage ? "Correct! 😊" : "Correct!") : "Incorrect"}
                  </h3>
                </div>
                <div className="text-right">
                  {gradingMessage && (
                    <p className="text-sm font-medium text-amber-600 mb-1">
                      {gradingMessage}
                    </p>
                  )}
                  {isCorrect && pointsEarned > 0 && (
                    <span className="text-emerald-600 font-bold text-lg">
                      +{pointsEarned} pts
                    </span>
                  )}
                </div>
              </div>
              {!isCorrect && wrongAnswer && (
                <div className="flex flex-col gap-2 text-sm w-full">
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 w-full">
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">You typed</p>
                    <p className="font-bold text-rose-700 break-words">
                      {wrongAnswer.typed || <span className="italic opacity-50">nothing</span>}
                    </p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 w-full">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Correct answer</p>
                    <p className="font-bold text-emerald-700 break-words">{wrongAnswer.correct}</p>
                  </div>
                </div>
              )}
              <button
                type="submit"
                autoFocus
                className="w-full py-4 bg-gray-900 text-white text-lg font-semibold rounded-2xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Next Word <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function SessionSummary({ results, mode, onComplete }: { results: { wordId: string; correct: boolean }[]; mode: string; onComplete: () => void }) {
  const correctCount = results.filter(r => r.correct).length;
  const incorrectCount = results.length - correctCount;
  const { stats, awardBonus } = useStore();
  const streak = stats.streak;
  const jokers = stats.jokers ?? 0;
  const correctCount2 = results.filter(r => r.correct).length;
  const isRevise = mode === "revise";
  const reviseBonus = isRevise ? Math.min(correctCount2 * 3, 50) : 0;
  // Award revise bonus once per session (use timestamp as unique key)
  const sessionKey = `revise_bonus_${results.map(r=>r.wordId).join("").slice(0,20)}`;
  React.useEffect(() => {
    if (isRevise && reviseBonus > 0) awardBonus(sessionKey, reviseBonus);
  }, []);

  // Import helpers inline to avoid circular import issues
  const getStreakFlamesLocal = (s: number) => "🔥".repeat(Math.min(s, 5));
  const getStreakBonusLocal = (s: number) => {
    if (s <= 0)  return 0;
    if (s === 1) return 20;
    if (s === 2) return 40;
    if (s === 3) return 60;
    if (s === 4) return 80;
    if (s <= 9)  return 100;
    if (s <= 19) return 150;
    if (s <= 29) return 200;
    if (s <= 39) return 250;
    if (s <= 49) return 300;
    return 400;
  };
  const newJokerEarned = streak > 0 && streak % 7 === 0;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
      <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
        <Check className="w-10 h-10 text-indigo-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Session Complete!
      </h2>
      <p className="text-gray-500 mb-6 text-center">
        Great job! You've finished all the words in this session.
        <br />
        <span className="font-bold text-indigo-600 mt-2 block">Go to Box 1 to learn words you did not know.</span>
      </p>

      <div className="grid grid-cols-2 gap-4 w-full mb-4">
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
          <p className="text-emerald-600 font-bold text-2xl">{correctCount}</p>
          <p className="text-emerald-800 text-xs font-medium uppercase tracking-wider">Correct</p>
        </div>
        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-center">
          <p className="text-rose-600 font-bold text-2xl">{incorrectCount}</p>
          <p className="text-rose-800 text-xs font-medium uppercase tracking-wider">Incorrect</p>
        </div>
      </div>

      {/* Revise session bonus */}
      {isRevise && reviseBonus > 0 && (
        <div className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 mb-4 text-center">
          <p className="text-2xl mb-1">✅</p>
          <p className="text-sm font-bold text-emerald-700">Revise session bonus!</p>
          <p className="text-xs text-emerald-600">+{reviseBonus} pts for {correctCount2} correct answers</p>
        </div>
      )}

      {/* Streak bonus panel */}
      {streak > 0 && (
        <div className="w-full bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 mb-4 text-center">
          <p className="text-2xl mb-1">{getStreakFlamesLocal(streak)}</p>
          <p className="text-sm font-bold text-orange-700">{streak}-day streak!</p>
          <p className="text-xs text-orange-600">Complete today's GCSE day to earn <span className="font-bold">+{getStreakBonusLocal(streak)} bonus pts</span></p>
          {newJokerEarned && (
            <p className="text-xs text-purple-600 font-bold mt-1">🃏 You earned a joker! ({jokers} total)</p>
          )}
          {jokers > 0 && !newJokerEarned && (
            <p className="text-xs text-blue-500 mt-1">🃏 {jokers} joker{jokers > 1 ? "s" : ""} saved — miss a day without losing your streak!</p>
          )}
        </div>
      )}

      <button
        onClick={onComplete}
        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
      >
        Return to Dashboard
      </button>
    </div>
  );
}
