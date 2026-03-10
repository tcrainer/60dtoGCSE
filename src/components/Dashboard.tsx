import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { getLevel, getStreakBonus, getStreakFlames } from "../store/useStore";
import { vocabulary, topics } from "../data/vocabulary";
import { differenceInDays, isBefore, startOfDay } from "date-fns";
import {
  Calendar,
  CheckCircle,
  Clock,
  Star,
  Target,
  BookOpen,
  Brain,
  RefreshCw,
  Play,
  X,
  Check,
  HelpCircle,
  Info,
  ChevronRight,
  Zap,
  Plus,
  Flame,
  Trophy,
} from "lucide-react";

interface DashboardProps {
  onStartSession: (
    mode: "test" | "learn" | "revise" | "practice",
    words: any[],
  ) => void;
}

export function Dashboard({ onStartSession }: DashboardProps) {
  const { userWords, stats, dailyStats, awardBonus } = useStore();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPointsInfo, setShowPointsInfo] = useState(false);
  const [showLevelInfo, setShowLevelInfo] = useState(false);
  const [showStreakInfo, setShowStreakInfo] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [selectedWordsToRevise, setSelectedWordsToRevise] = useState<
    Set<string>
  >(new Set());
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [selectedTopicDays, setSelectedTopicDays] = useState<
    { topicId: string; day: number | string }[]
  >([]);

  const compareDays = (d1: number | string, d2: number | string) => {
    if (typeof d1 === 'number' && typeof d2 === 'number') return d1 === d2;
    return d1.toString() === d2.toString();
  };

  const sortDays = (a: number | string, b: number | string) => {
    const aStr = a.toString();
    const bStr = b.toString();
    const aNum = parseInt(aStr, 10);
    const bNum = parseInt(bStr, 10);
    if (aNum !== bNum) return aNum - bNum;
    return aStr.localeCompare(bStr);
  };

  const today = new Date();
  const startDate = new Date("2026-03-09");
  const examDateB1 = new Date("2026-03-25");
  const examDateGCSE = new Date("2026-05-07");

  const daysLeftB1 = differenceInDays(examDateB1, today);
  const daysLeftGCSE = differenceInDays(examDateGCSE, today);
  const totalDaysGCSE = differenceInDays(examDateGCSE, startDate);
  const currentDay = differenceInDays(today, startDate) + 1;

  const getDaysUntilReview = (nextReviewDate: string | null) => {
    if (!nextReviewDate) return "Mastered";
    const days = differenceInDays(startOfDay(new Date(nextReviewDate)), startOfDay(today));
    if (days < 0) return "Overdue";
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `Due in ${days} days`;
  };

  // Calculate box counts
  const boxCounts = [0, 0, 0, 0, 0, 0, 0];
  let toReviseCount = 0;

  Object.values(userWords).forEach((uw) => {
    boxCounts[uw.box]++;
    if (uw.nextReviewDate && isBefore(new Date(uw.nextReviewDate), today)) {
      toReviseCount++;
    }
  });

  const gcseTopics = topics.filter(t => !t.id.startsWith('B1') && !t.id.startsWith('S'));
  const verbTopics = topics.filter(t => t.id === 'H');
  const b1Topics = topics.filter(t => t.id.startsWith('B1') || t.id.startsWith('S'));

  const gcseWords = vocabulary.filter(w => !w.topicId.startsWith('B1') && !w.topicId.startsWith('S'));
  const verbWords = vocabulary.filter(w => w.topicId === 'H');
  const b1Words = vocabulary.filter(w => w.topicId.startsWith('B1') || w.topicId.startsWith('S'));

  useEffect(() => {
    // Check for GCSE bonus
    const gcseTodayWords = gcseWords.filter(w => compareDays(w.day, currentDay));
    if (gcseTodayWords.length > 0) {
      const learnedCount = gcseTodayWords.filter(w => userWords[w.id] && userWords[w.id].box > 0).length;
      if (learnedCount === gcseTodayWords.length) {
        awardBonus(`GCSE_Day${currentDay}`, 50);
      }
    }

    // Check for B1 bonus
    if (currentDay <= 15) {
      const b1TodayWords = b1Words.filter(w => w.day.toString().startsWith(currentDay.toString()));
      if (b1TodayWords.length > 0) {
        const learnedCount = b1TodayWords.filter(w => userWords[w.id] && userWords[w.id].box > 0).length;
        if (learnedCount === b1TodayWords.length) {
          awardBonus(`B1_Day${currentDay}`, 100);
        }
      }
    }
  }, [currentDay, userWords, awardBonus, gcseWords, b1Words]);

  const unlearnedGcseWords = gcseWords.filter((w) => !userWords[w.id]);
  const unlearnedB1Words = b1Words.filter((w) => !userWords[w.id]);
  const unlearnedWords = vocabulary.filter((w) => !userWords[w.id]);
  
  const untestedGcseCount = unlearnedGcseWords.length;
  const untestedB1Count = unlearnedB1Words.length;
  boxCounts[0] = untestedGcseCount + untestedB1Count;

  const handleTestGcse = () => {
    const topicOrder = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const nextWords = unlearnedGcseWords
      .sort((a, b) => {
        if (a.day !== b.day) return sortDays(a.day, b.day);
        return topicOrder.indexOf(a.topicId) - topicOrder.indexOf(b.topicId);
      })
      .slice(0, 20);
    if (nextWords.length > 0) {
      onStartSession("test", nextWords);
    } else {
      alert("No more new GCSE words to test!");
    }
  };

  const handleTestB1 = () => {
    const nextWords = unlearnedB1Words.sort((a, b) => sortDays(a.day, b.day)).slice(0, 20);
    if (nextWords.length > 0) {
      onStartSession("test", nextWords);
    } else {
      alert("No more new B1 words to test!");
    }
  };

  const handleLearn = () => {
    // Learn: words in Box 1
    const learnWords = vocabulary
      .filter((w) => userWords[w.id]?.box === 1)
      .slice(0, 20);
    if (learnWords.length > 0) {
      onStartSession("learn", learnWords);
    } else {
      alert("Well done! Box 1 is empty. You've learned all your daily words well!");
    }
  };

  const handleRevise = () => {
    // Revise: words whose time is up
    const reviseWords = vocabulary
      .filter((w) => {
        const uw = userWords[w.id];
        return (
          uw &&
          uw.nextReviewDate &&
          isBefore(new Date(uw.nextReviewDate), today) &&
          uw.box > 1 &&
          uw.box < 6
        );
      });

    if (reviseWords.length > 0) {
      onStartSession("revise", reviseWords.slice(0, 20));
    } else {
      alert("No words to revise right now!");
    }
  };

  const handleReviseRandomly = () => {
    const reviseWords = vocabulary
      .filter((w) => {
        const uw = userWords[w.id];
        return (
          uw &&
          uw.nextReviewDate &&
          isBefore(new Date(uw.nextReviewDate), today) &&
          uw.box > 1 &&
          uw.box < 6
        );
      })
      .sort(() => Math.random() - 0.5);

    if (reviseWords.length > 0) {
      onStartSession("revise", reviseWords.slice(0, 20));
    } else {
      alert("No words to revise right now!");
    }
  };

  const handleChooseOwn = () => {
    setShowTopicSelector(true);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header & Stats */}
      {(() => {
        const level = getLevel(stats.points);
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-medium text-gray-500 truncate">Points</p>
                  <button onClick={() => setShowPointsInfo(true)} className="text-gray-400 hover:text-indigo-600 transition-colors shrink-0">
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xl font-bold text-gray-900">{stats.points}</p>
              </div>
            </div>

            {/* Level card */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-5 rounded-3xl shadow-sm flex items-center gap-3 col-span-1">
              <div className="p-3 bg-white/20 text-white rounded-2xl shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-amber-100 uppercase tracking-wider">Level {level.level}</p>
                  <button
                    onClick={() => setShowLevelInfo(true)}
                    className="p-0.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors shrink-0"
                    title="Level info"
                  >
                    <HelpCircle className="w-3 h-3 text-white" />
                  </button>
                </div>
                <p className="text-sm font-black text-white truncate">{level.name}</p>
                <div className="mt-1 w-full bg-white/30 rounded-full h-1">
                  <div className="h-1 rounded-full bg-white transition-all" style={{ width: `${level.progress}%` }} />
                </div>
                {level.nextLevel ? (
                  <p className="text-[10px] text-amber-100 mt-0.5">{level.nextLevel.minPoints - stats.points} pts → <span className="font-bold">{level.nextLevel.name}</span></p>
                ) : (
                  <p className="text-[10px] text-amber-100 mt-0.5 font-bold">Max level! 🏆</p>
                )}
              </div>
            </div>

            {/* Streak card */}
            <div className={`p-5 rounded-3xl shadow-sm border flex items-center gap-3 ${stats.streak >= 3 ? "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200" : "bg-white border-gray-100"}`}>
              <div className={`p-3 rounded-2xl shrink-0 ${stats.streak >= 3 ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"}`}>
                <Flame className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-medium text-gray-500">Streak</p>
                  <button
                    onClick={() => setShowStreakInfo(true)}
                    className="p-0.5 text-gray-400 hover:text-orange-500 transition-colors shrink-0"
                    title="Streak bonus info"
                  >
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xl font-bold text-gray-900">{stats.streak} {stats.streak === 1 ? "day" : "days"} {getStreakFlames(stats.streak)}</p>
                <p className="text-[10px] font-bold text-amber-600">+{getStreakBonus(stats.streak)} pts bonus today</p>
                {/* Next tier hint */}
                {(() => {
                  const s = stats.streak;
                  let nextTierAt = 0;
                  let nextBonus = 0;
                  if (s < 1)       { nextTierAt = 1;  nextBonus = 20; }
                  else if (s < 2)  { nextTierAt = 2;  nextBonus = 40; }
                  else if (s < 3)  { nextTierAt = 3;  nextBonus = 60; }
                  else if (s < 4)  { nextTierAt = 4;  nextBonus = 80; }
                  else if (s < 5)  { nextTierAt = 5;  nextBonus = 100; }
                  else if (s < 10) { nextTierAt = 10; nextBonus = 150; }
                  else if (s < 20) { nextTierAt = 20; nextBonus = 200; }
                  else if (s < 30) { nextTierAt = 30; nextBonus = 250; }
                  else if (s < 40) { nextTierAt = 40; nextBonus = 300; }
                  else if (s < 50) { nextTierAt = 50; nextBonus = 400; }
                  if (nextTierAt === 0) return null;
                  const daysLeft = nextTierAt - s;
                  return <p className="text-[10px] text-gray-400 mt-0.5">{daysLeft} more day{daysLeft > 1 ? "s" : ""} → +{nextBonus} pts/day</p>;
                })()}
                {(stats.jokers ?? 0) > 0 && (
                  <p className="text-[10px] text-blue-500 font-bold mt-0.5">🃏 {stats.jokers} joker{stats.jokers > 1 ? "s" : ""} saved</p>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Time Spent</p>
                <p className="text-xl font-bold text-gray-900">{formatTime(stats.timeSpent)}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Mastered</p>
                <p className="text-xl font-bold text-gray-900">{boxCounts[6]}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">To Revise</p>
                <p className="text-xl font-bold text-gray-900">{toReviseCount}</p>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leitner Boxes */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Leitner Boxes
            </h2>
            <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 snap-x">
              <div
                onClick={() => {
                  setSelectedBox(0);
                  setSelectedWordsToRevise(new Set(unlearnedGcseWords.map(w => w.id)));
                }}
                className="min-w-[120px] shrink-0 p-4 rounded-2xl border text-center cursor-pointer transition-colors snap-start bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              >
                <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                  Untested GCSE
                </p>
                <p className="text-2xl font-bold">
                  {untestedGcseCount}
                </p>
                <p className="text-[10px] font-bold opacity-80 mt-1">
                  {gcseWords.length - untestedGcseCount} tested
                </p>
              </div>

              <div
                onClick={() => {
                  setSelectedBox(0);
                  setSelectedWordsToRevise(new Set(unlearnedB1Words.map(w => w.id)));
                }}
                className="min-w-[120px] shrink-0 p-4 rounded-2xl border text-center cursor-pointer transition-colors snap-start bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              >
                <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                  Untested B1
                </p>
                <p className="text-2xl font-bold">
                  {untestedB1Count}
                </p>
                <p className="text-[10px] font-bold opacity-80 mt-1">
                  {b1Words.length - untestedB1Count} tested
                </p>
              </div>

              {[1, 2, 3, 4, 5, 6].map((box) => {
                const boxNames = [
                  "",
                  "Box 1 - revise me every day",
                  "Box 2 - see you tomorrow!",
                  "Box 3 - see you in a few days",
                  "Box 4 - see you in a week!",
                  "Box 5 - see you in a fortnight!",
                  "Box 6 - Mastered"
                ];
                const colors = [
                  "", // 0: Untested (Gray) - handled above
                  "bg-red-100 text-red-600 border-red-200 hover:bg-red-200", // 1: Box 1 (Red)
                  "bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200", // 2: Box 2 (Orange)
                  "bg-amber-100 text-amber-600 border-amber-200 hover:bg-amber-200", // 3: Box 3 (Yellow/Amber)
                  "bg-green-100 text-green-600 border-green-200 hover:bg-green-200", // 4: Box 4 (Green)
                  "bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200", // 5: Box 5 (Blue)
                  "bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200", // 6: Mastered (Purple)
                ];
                
                const [name, phrase] = boxNames[box].split(" - ");

                return (
                  <div
                    key={box}
                    onClick={() => {
                      setSelectedBox(box);
                      const wordsInBox = vocabulary.filter((w) => {
                        return userWords[w.id]?.box === box;
                      });
                      setSelectedWordsToRevise(new Set(wordsInBox.map(w => w.id)));
                    }}
                    className={`min-w-[140px] shrink-0 p-4 rounded-2xl border text-center cursor-pointer transition-all snap-start ${
                      selectedBox === box ? "ring-2 ring-indigo-500 ring-offset-2 scale-105" : ""
                    } ${colors[box]}`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90">
                      {name}
                    </p>
                    {phrase && (
                      <p className="text-[10px] font-medium lowercase opacity-70 mb-2 leading-tight block">
                        {phrase}
                      </p>
                    )}
                    <p className="text-2xl font-bold">
                      {box === 1 && boxCounts[box] === 0 ? "😊" : boxCounts[box]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Learning Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleTestGcse}
                className="group relative overflow-hidden bg-indigo-600 p-6 rounded-2xl text-left hover:bg-indigo-700 transition-colors"
              >
                <div className="relative z-10">
                  <Play className="w-8 h-8 text-indigo-200 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-1">
                    Test New Words GCSE
                  </h3>
                  <p className="text-indigo-200 text-sm">
                    Learn priority words for today
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
                  <Play className="w-32 h-32 text-white" />
                </div>
              </button>

              <button
                onClick={handleTestB1}
                className="group relative overflow-hidden bg-blue-600 p-6 rounded-2xl text-left hover:bg-blue-700 transition-colors"
              >
                <div className="relative z-10">
                  <Play className="w-8 h-8 text-blue-200 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-1">
                    Test New Words B1
                  </h3>
                  <p className="text-blue-200 text-sm">
                    Learn priority words for today
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
                  <Play className="w-32 h-32 text-white" />
                </div>
              </button>

              <button
                onClick={handleLearn}
                className="group relative overflow-hidden bg-rose-500 p-6 rounded-2xl text-left hover:bg-rose-600 transition-colors"
              >
                <div className="relative z-10">
                  <Brain className="w-8 h-8 text-rose-200 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-1">
                    Keep Learn Mistakes
                  </h3>
                  <p className="text-rose-200 text-sm">
                    {boxCounts[1]} words need attention
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
                  <Brain className="w-32 h-32 text-white" />
                </div>
              </button>

              <button
                onClick={handleRevise}
                className="group relative overflow-hidden bg-emerald-500 p-6 rounded-2xl text-left hover:bg-emerald-600 transition-colors"
              >
                <div className="relative z-10">
                  <RefreshCw className="w-8 h-8 text-emerald-200 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-1">
                    Revise Due
                  </h3>
                  <p className="text-emerald-200 text-sm">
                    {toReviseCount} words ready for review
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-32 h-32 text-white" />
                </div>
              </button>

              <button
                onClick={handleReviseRandomly}
                className="group relative overflow-hidden bg-teal-600 p-6 rounded-2xl text-left hover:bg-teal-700 transition-colors"
              >
                <div className="relative z-10">
                  <RefreshCw className="w-8 h-8 text-teal-200 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-1">
                    Revise Randomly
                  </h3>
                  <p className="text-teal-200 text-sm">
                    Shuffle all due words
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-32 h-32 text-white" />
                </div>
              </button>

              <button
                onClick={handleChooseOwn}
                className="group relative overflow-hidden bg-slate-800 p-6 rounded-2xl text-left hover:bg-slate-900 transition-colors sm:col-span-2"
              >
                <div className="relative z-10">
                  <BookOpen className="w-8 h-8 text-slate-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-1">
                    Choose Topic
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Focus on specific areas
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-32 h-32 text-white" />
                </div>
              </button>
            </div>
          </div>

          {/* Leitner Boxes was here */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Snapshot Widget */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Snapshot</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Time Spent</span>
                <span className="font-bold text-gray-900">
                  {formatTime(stats.timeSpent)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Words Learnt</span>
                <span className="font-bold text-gray-900">
                  {stats.wordsLearnt}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Words Revised</span>
                <span className="font-bold text-gray-900">
                  {stats.wordsRevised}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Words Finished</span>
                <span className="font-bold text-gray-900">
                  {stats.wordsFinished}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Points Earnt</span>
                <span className="font-bold text-gray-900">{stats.points}</span>
              </div>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Box 1 (New)</span>
                  <span className="font-bold text-red-600">{boxCounts[1]}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Box 6 (Mastered)</span>
                  <span className="font-bold text-purple-600">{boxCounts[6]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Progress Widget */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Progress</h2>
            <div className="space-y-6">
              {Object.entries(dailyStats)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .slice(0, 7)
                .map(([date, dayStat]) => (
                  <div key={date} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">{date}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-sm font-bold text-indigo-600">{dayStat.wordsTested}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Tested</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-emerald-600">{dayStat.wordsRevised}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Revised</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-amber-600">{dayStat.points}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Points</p>
                      </div>
                    </div>
                  </div>
                ))}
              {Object.keys(dailyStats).length === 0 && (
                <p className="text-sm text-gray-400 text-center italic">No activity recorded yet.</p>
              )}
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Exam Countdown
              </h2>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              >
                <Calendar className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {showCalendar ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 mb-2">
                    <div>M</div>
                    <div>T</div>
                    <div>W</div>
                    <div>T</div>
                    <div>F</div>
                    <div>S</div>
                    <div>S</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {Array.from({ length: 60 }).map((_, i) => {
                      const day = i + 1;
                      const isPast = day < currentDay;
                      const isToday = day === currentDay;
                      
                      const dayWords = vocabulary.filter(w => compareDays(w.day, day));
                      const hasWords = dayWords.length > 0;
                      const allTested = hasWords && dayWords.every(w => userWords[w.id] && userWords[w.id].box > 0);
                      const allMastered = hasWords && dayWords.every(w => userWords[w.id] && userWords[w.id].box === 6);

                      let bgColor = isPast
                        ? "bg-indigo-100 text-indigo-400"
                        : "bg-white border border-slate-200 text-slate-400";

                      if (day === 60) {
                        bgColor = isPast 
                          ? "bg-red-100 text-red-500 font-bold" 
                          : "bg-red-50 border border-red-200 text-red-600 font-bold";
                      }

                      if (allMastered) {
                        bgColor = "bg-amber-400 text-white font-bold border-amber-500";
                      } else if (allTested) {
                        bgColor = "bg-emerald-500 text-white font-bold border-emerald-600";
                      }

                      if (isToday) {
                        if (!allMastered && !allTested) {
                          bgColor = "bg-indigo-600 text-white font-bold";
                        } else {
                          bgColor += " ring-2 ring-indigo-600 ring-offset-1";
                        }
                      }

                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs relative ${bgColor}`}
                        >
                          <span>{day}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-center text-xs text-slate-500 mt-4">
                    60 Days to Paper 2
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-500">
                        B1 Exam (Mar 25)
                      </span>
                      <span className="font-bold text-indigo-600">
                        {daysLeftB1} days
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-500">
                        GCSE Exam (May 7)
                      </span>
                      <span className="font-bold text-indigo-600">
                        {daysLeftGCSE} days
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${Math.max(0, Math.min(100, (currentDay / totalDaysGCSE) * 100))}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </>
              )}

              {boxCounts[0] === 0 &&
              boxCounts[1] === 0 &&
              boxCounts[2] === 0 &&
              boxCounts[3] === 0 &&
              boxCounts[4] === 0 &&
              boxCounts[5] === 0 &&
              boxCounts[6] > 0 ? (
                <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                  <Star className="w-6 h-6 fill-current" />
                  <span className="font-bold">All topics mastered!</span>
                </div>
              ) : (
                <div className="text-sm text-gray-600 text-center p-4 bg-slate-50 rounded-xl">
                  You have{" "}
                  <span className="font-bold text-gray-900">
                    {toReviseCount + boxCounts[1]}
                  </span>{" "}
                  words to test yourself on and{" "}
                  <span className="font-bold text-gray-900">
                    {unlearnedGcseWords.filter((w) => Number(w.day) <= currentDay).length}
                  </span>{" "}
                  words to cover today's priority words.
                </div>
              )}
            </div>
          </div>

          {/* Topics Overview removed from sidebar */}
        </div>
      </div>

      {/* 5-Day Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GCSE Preview */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500" />
              GCSE 5-Day Preview
            </h2>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => {
              const dayNum = currentDay + i;
              const dayWords = gcseWords.filter(w => compareDays(w.day, dayNum));
              if (dayWords.length === 0) return null;
              
              const learnedCount = dayWords.filter(w => userWords[w.id] && userWords[w.id].box > 0).length;
              const isCompleted = learnedCount === dayWords.length;
              const isToday = i === 0;

              return (
                <div
                  key={dayNum}
                  onClick={() => {
                    const unlearnedDayWords = dayWords.filter(w => !userWords[w.id] || userWords[w.id].box === 0);
                    if (unlearnedDayWords.length > 0) {
                      onStartSession("learn", unlearnedDayWords);
                    } else if (!isCompleted) {
                      onStartSession("practice", dayWords);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${isToday ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 hover:bg-indigo-100" : "bg-slate-50 border-slate-100 hover:bg-slate-100"} ${isCompleted ? "opacity-70" : ""}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-bold flex items-center gap-1 ${isToday ? "text-indigo-600" : "text-gray-500"}`}>
                      {isToday ? "⭐ Today" : `Day ${dayNum}`}
                      {!isCompleted && <span className="text-[10px] font-normal opacity-60 group-hover:opacity-100 transition-opacity">(tap to start)</span>}
                    </span>
                    {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{learnedCount} / {dayWords.length}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Words Learnt</p>
                    </div>
                    {isToday && !isCompleted && (
                      <div className="text-right">
                        <p className="text-xs font-bold text-amber-600">+50 Bonus pts</p>
                        <p className="text-[10px] text-gray-400">if finished today</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${isCompleted ? "bg-emerald-500" : "bg-indigo-500"}`}
                      style={{ width: `${(learnedCount / dayWords.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* B1 Preview */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-500" />
              B1 5-Day Preview
            </h2>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => {
              const dayNum = currentDay + i;
              if (dayNum > 15) return null; // B1 stops in 15 days
              const dayWords = b1Words.filter(w => w.day.toString().startsWith(dayNum.toString()));
              if (dayWords.length === 0) return null;
              
              const learnedCount = dayWords.filter(w => userWords[w.id] && userWords[w.id].box > 0).length;
              const isCompleted = learnedCount === dayWords.length;
              const isToday = i === 0;

              return (
                <div
                  key={dayNum}
                  onClick={() => {
                    const unlearnedDayWords = dayWords.filter(w => !userWords[w.id] || userWords[w.id].box === 0);
                    if (unlearnedDayWords.length > 0) {
                      onStartSession("learn", unlearnedDayWords);
                    } else if (!isCompleted) {
                      onStartSession("practice", dayWords);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${isToday ? "bg-blue-50 border-blue-200 ring-1 ring-blue-200 hover:bg-blue-100" : "bg-slate-50 border-slate-100 hover:bg-slate-100"} ${isCompleted ? "opacity-70" : ""}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-bold flex items-center gap-1 ${isToday ? "text-blue-600" : "text-gray-500"}`}>
                      {isToday ? "⭐ Today" : `Day ${dayNum}`}
                      {!isCompleted && <span className="text-[10px] font-normal opacity-60 group-hover:opacity-100 transition-opacity">(tap to start)</span>}
                    </span>
                    {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{learnedCount} / {dayWords.length}</p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Words Learnt</p>
                    </div>
                    {isToday && !isCompleted && (
                      <div className="text-right">
                        <p className="text-xs font-bold text-blue-600">+100 Bonus pts</p>
                        <p className="text-[10px] text-gray-400">if finished today</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${isCompleted ? "bg-emerald-500" : "bg-blue-500"}`}
                      style={{ width: `${(learnedCount / dayWords.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">GCSE Topics & Priority Group</h2>
          {selectedTopicDays.some(td => !td.topicId.startsWith('B1')) && (() => {
            const wordsToTest = vocabulary.filter(w => 
              !w.topicId.startsWith('B1') && selectedTopicDays.some(td => td.topicId === w.topicId && compareDays(td.day, w.day)) && !userWords[w.id]
            );
            const uniqueDays = new Set(selectedTopicDays.filter(td => !td.topicId.startsWith('B1')).map(td => td.day)).size;
            return (
              <button
                onClick={() => {
                  if (wordsToTest.length === 0) {
                    alert("All selected words have already been tested!");
                    return;
                  }
                  onStartSession("test", wordsToTest);
                  setSelectedTopicDays(prev => prev.filter(td => td.topicId.startsWith('B1')));
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Test these chosen ones ({uniqueDays} day{uniqueDays === 1 ? '' : 's'}, {wordsToTest.length} word{wordsToTest.length === 1 ? '' : 's'})
              </button>
            );
          })()}
        </div>
        <div className="flex overflow-x-auto pb-4 gap-6 snap-x">
          {gcseTopics.map((topic) => {
            const topicWords = vocabulary.filter((w) => w.topicId === topic.id);
            const uniqueDays = Array.from(new Set(topicWords.map((w) => w.day))).sort(sortDays);
            
            return (
              <div key={topic.id} className="flex flex-col gap-3 min-w-[180px] shrink-0 snap-start">
                <div 
                  className="font-bold text-sm text-gray-900 cursor-pointer hover:text-indigo-600 line-clamp-2 h-10"
                  onClick={() => setSelectedTopic(topic.id)}
                  title={topic.name}
                >
                  {topic.name}
                </div>
                <div className="grid grid-cols-5 gap-1.5 w-fit">
                  {uniqueDays.map(day => {
                    const dayWords = topicWords.filter(w => compareDays(w.day, day));
                    const isLearned = dayWords.length > 0 && dayWords.every(w => userWords[w.id] && userWords[w.id].box > 0);
                    const isSelected = selectedTopicDays.some(td => td.topicId === topic.id && compareDays(td.day, day));
                    
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          setSelectedTopicDays(prev => {
                            const exists = prev.some(td => td.topicId === topic.id && compareDays(td.day, day));
                            if (exists) return prev.filter(td => !(td.topicId === topic.id && compareDays(td.day, day)));
                            return [...prev, { topicId: topic.id, day }];
                          });
                        }}
                        className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all ${
                          isSelected 
                            ? "bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-1 scale-110" 
                            : isLearned
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={`Day ${day}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* B1 Topics & Priority Group Grid */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">B1 Priority Group</h2>
          {selectedTopicDays.some(td => b1Topics.some(t => t.id === td.topicId)) && (() => {
            const wordsToTest = b1Words.filter(w => 
              selectedTopicDays.some(td => td.topicId === w.topicId && compareDays(td.day, w.day)) && !userWords[w.id]
            );
            const uniqueDays = new Set(selectedTopicDays.filter(td => b1Topics.some(t => t.id === td.topicId)).map(td => `${td.topicId}-${td.day}`)).size;
            return (
              <button
                onClick={() => {
                  if (wordsToTest.length === 0) {
                    alert("All selected words have already been tested!");
                    return;
                  }
                  onStartSession("test", wordsToTest);
                  setSelectedTopicDays(prev => prev.filter(td => !b1Topics.some(t => t.id === td.topicId)));
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Test these chosen ones ({uniqueDays} day{uniqueDays === 1 ? '' : 's'}, {wordsToTest.length} word{wordsToTest.length === 1 ? '' : 's'})
              </button>
            );
          })()}
        </div>
        <div className="flex flex-col gap-8 pb-4">
          {b1Topics.map(topic => {
            const topicWords = vocabulary.filter((w) => w.topicId === topic.id);
            const uniqueDays = Array.from(new Set(topicWords.map((w) => w.day))).sort(sortDays);
            
            return (
              <div key={topic.id} className="flex flex-col gap-3">
                <div 
                  className="font-bold text-sm text-gray-900 cursor-pointer hover:text-indigo-600"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  {topic.name}
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 w-fit">
                  {uniqueDays.map(day => {
                    const dayWords = topicWords.filter(w => compareDays(w.day, day));
                    const isLearned = dayWords.length > 0 && dayWords.every(w => userWords[w.id] && userWords[w.id].box > 0);
                    const isSelected = selectedTopicDays.some(td => td.topicId === topic.id && compareDays(td.day, day));
                    
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          setSelectedTopicDays(prev => {
                            const exists = prev.some(td => td.topicId === topic.id && compareDays(td.day, day));
                            if (exists) return prev.filter(td => !(td.topicId === topic.id && compareDays(td.day, day)));
                            return [...prev, { topicId: topic.id, day }];
                          });
                        }}
                        className={`w-10 h-10 rounded flex items-center justify-center text-sm font-bold transition-all ${
                          isSelected 
                            ? "bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-1 scale-110" 
                            : isLearned
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={`Day ${day}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {topics.find((t) => t.id === selectedTopic)?.name} Words
              </h2>
              <button
                onClick={() => setSelectedTopic(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-2 pr-2">
              {vocabulary
                .filter((w) => w.topicId === selectedTopic)
                .map((w) => {
                  const uw = userWords[w.id];
                  const isLearnt = uw && uw.box > 0;
                  return (
                    <div
                      key={w.id}
                      className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div>
                        <p className="font-bold text-gray-900">{w.german}</p>
                        <p className="text-sm text-gray-600">{w.english}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${isLearnt ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}
                        >
                          {isLearnt ? `Box ${uw.box}` : "Untested"}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Level Info Modal */}
      {showLevelInfo && (() => {
        const level = getLevel(stats.points);
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🏆 All Levels</h2>
                <button onClick={() => setShowLevelInfo(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { level: 1,  name: "Rookie",            minPoints: 0     },
                  { level: 2,  name: "Schüler",           minPoints: 100   },
                  { level: 3,  name: "Lernender",         minPoints: 300   },
                  { level: 4,  name: "Fortgeschrittener", minPoints: 700   },
                  { level: 5,  name: "Sprachprofi",       minPoints: 1500  },
                  { level: 6,  name: "Wortmeister",       minPoints: 3000  },
                  { level: 7,  name: "Deutschheld",       minPoints: 6000  },
                  { level: 8,  name: "Sprachgenie",       minPoints: 12000 },
                  { level: 9,  name: "Deutschmeister",    minPoints: 25000 },
                  { level: 10, name: "Sprachlegende",     minPoints: 50000 },
                ].map(l => {
                  const isCurrent = l.level === level.level;
                  const isNext = !!(level.nextLevel && l.level === level.level + 1);
                  const isPast = l.level < level.level;
                  return (
                    <div key={l.level} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${isCurrent ? "bg-amber-50 border-amber-300 ring-1 ring-amber-300" : isNext ? "bg-indigo-50 border-indigo-200" : isPast ? "bg-gray-50 border-gray-100 opacity-60" : "bg-white border-gray-100"}`}>
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-black w-7 text-center ${isCurrent ? "text-amber-500" : isPast ? "text-gray-400" : "text-gray-300"}`}>
                          {isPast ? "✓" : isCurrent ? "★" : String(l.level)}
                        </span>
                        <div>
                          <p className={`text-sm font-bold ${isCurrent ? "text-amber-700" : isNext ? "text-indigo-700" : "text-gray-600"}`}>{l.name}</p>
                          {isNext && <p className="text-[10px] text-indigo-500 font-medium">{l.minPoints - stats.points} pts to go!</p>}
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${isCurrent ? "text-amber-600" : "text-gray-400"}`}>{l.minPoints.toLocaleString()} pts</span>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setShowLevelInfo(false)} className="w-full mt-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors">
                Got it!
              </button>
            </div>
          </div>
        );
      })()}

      {/* Streak Info Modal */}
      {showStreakInfo && (() => {
        const streakTiers = [
          { days: "1",    bonus: 20  },
          { days: "2",    bonus: 40  },
          { days: "3",    bonus: 60  },
          { days: "4",    bonus: 80  },
          { days: "5–9",  bonus: 100 },
          { days: "10–19",bonus: 150 },
          { days: "20–29",bonus: 200 },
          { days: "30–39",bonus: 250 },
          { days: "40–49",bonus: 300 },
          { days: "50+",  bonus: 400 },
        ];
        const s = stats.streak;
        const currentTierIndex = s === 0 ? -1 : s === 1 ? 0 : s === 2 ? 1 : s === 3 ? 2 : s === 4 ? 3 : s <= 9 ? 4 : s <= 19 ? 5 : s <= 29 ? 6 : s <= 39 ? 7 : s <= 49 ? 8 : 9;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-900">🔥 Streak Bonuses</h2>
                <button onClick={() => setShowStreakInfo(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-5">Complete a GCSE learning session every day to earn streak bonus points.</p>
              <div className="space-y-2">
                {streakTiers.map((tier, i) => {
                  const isCurrent = i === currentTierIndex;
                  const flames = "🔥".repeat(Math.min(i + 1, 5));
                  return (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${isCurrent ? "bg-orange-50 border-orange-300 ring-1 ring-orange-300" : "bg-gray-50 border-gray-100"}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-base">{flames}</span>
                        <p className={`text-sm font-bold ${isCurrent ? "text-orange-700" : "text-gray-600"}`}>Day {tier.days}</p>
                        {isCurrent && <span className="text-[10px] bg-orange-200 text-orange-700 font-bold px-2 py-0.5 rounded-full">YOU</span>}
                      </div>
                      <span className={`text-sm font-black ${isCurrent ? "text-orange-600" : "text-gray-400"}`}>+{tier.bonus} pts</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-700">🃏 Joker System</p>
                <p className="text-xs text-blue-600 mt-1">Every 7 days in a row earns a Joker. Miss a day? It is used automatically to save your streak.</p>
              </div>
              <button onClick={() => setShowStreakInfo(false)} className="w-full mt-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors">
                Got it!
              </button>
            </div>
          </div>
        );
      })()}

      {/* Points Info Modal */}
      {showPointsInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">How to earn points</h2>
              <button onClick={() => setShowPointsInfo(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-emerald-900">Correct Answer</p>
                  <p className="text-sm text-emerald-700">Get 10 points for every word you get fully correct.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-amber-900">Article Mistake</p>
                  <p className="text-sm text-amber-700">Get 7 points if the word is correct but the article (der/die/das) is wrong.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-blue-900">Optional Content</p>
                  <p className="text-sm text-blue-700">Get +5 bonus points for including words in parentheses ().</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-indigo-900">Daily Completion</p>
                  <p className="text-sm text-indigo-700">Finish all words for the day to get +50 (GCSE) or +100 (B1) bonus points!</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowPointsInfo(false)}
              className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      {selectedBox !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedBox === 0
                    ? "Untested"
                    : selectedBox === 6
                      ? "Mastered"
                      : `Box ${selectedBox}`}{" "}
                  Words
                </h2>
                {boxCounts[selectedBox] > 0 && (
                  <button
                    onClick={() => {
                      const wordsInBox = vocabulary.filter((w) => {
                        if (selectedBox === 0) return !userWords[w.id];
                        return userWords[w.id]?.box === selectedBox;
                      });
                      if (selectedWordsToRevise.size === wordsInBox.length) {
                        setSelectedWordsToRevise(new Set());
                      } else {
                        setSelectedWordsToRevise(new Set(wordsInBox.map(w => w.id)));
                      }
                    }}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full transition-colors"
                  >
                    {selectedWordsToRevise.size === boxCounts[selectedBox] ? "Deselect All" : "Select All"}
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedBox(null);
                  setSelectedWordsToRevise(new Set());
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-2 mb-6 pr-2">
              {vocabulary
                .filter((w) => {
                  if (selectedBox === 0) return !userWords[w.id];
                  return userWords[w.id]?.box === selectedBox;
                })
                .map((w) => {
                  const isSelected = selectedWordsToRevise.has(w.id);
                  return (
                    <div
                      key={w.id}
                      className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer border-2 transition-colors ${isSelected ? "border-indigo-500 bg-indigo-50" : "border-transparent bg-slate-50 hover:bg-slate-100"}`}
                      onClick={() => {
                        const next = new Set(selectedWordsToRevise);
                        if (next.has(w.id)) next.delete(w.id);
                        else next.add(w.id);
                        setSelectedWordsToRevise(next);
                      }}
                    >
                      <div
                        className={`w-6 h-6 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-indigo-500 border-indigo-500 text-white" : "border-gray-300 bg-white"}`}
                      >
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{w.german}</p>
                        <p className="text-sm text-gray-600">{w.english}</p>
                      </div>
                      {selectedBox > 0 && selectedBox < 6 && (
                        <div className="ml-auto text-right">
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                            !userWords[w.id]?.nextReviewDate 
                              ? "bg-gray-100 text-gray-600"
                              : differenceInDays(startOfDay(new Date(userWords[w.id].nextReviewDate || "")), startOfDay(today)) <= 0
                                ? "bg-rose-100 text-rose-700"
                                : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {getDaysUntilReview(userWords[w.id]?.nextReviewDate || null)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              {boxCounts[selectedBox] === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No words in this box.
                </p>
              )}
            </div>
            <button
              disabled={selectedWordsToRevise.size === 0}
              onClick={() => {
                const wordsToRevise = vocabulary.filter((w) =>
                  selectedWordsToRevise.has(w.id),
                );
                let mode: "test" | "learn" | "revise" | "practice" = "practice";
                if (selectedBox === 1) mode = "learn";
                else if (selectedBox > 1 && selectedBox < 6) mode = "revise";
                
                onStartSession(mode, wordsToRevise);
                setSelectedBox(null);
                setSelectedWordsToRevise(new Set());
              }}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
            >
              {selectedBox === 1 || (selectedBox > 1 && selectedBox < 6) ? "Test yourself" : "Practice Selected"} ({selectedWordsToRevise.size})
            </button>
          </div>
        </div>
      )}
      {/* Choose Topic Modal */}
      {showTopicSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Choose Topic to Test</h2>
              <button
                onClick={() => setShowTopicSelector(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-2 pr-2">
              {topics.map(topic => {
                const unlearnedCount = vocabulary.filter(w => w.topicId === topic.id && !userWords[w.id]).length;
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      const topicWords = vocabulary.filter(w => w.topicId === topic.id && !userWords[w.id]);
                      if (topicWords.length > 0) {
                        onStartSession("test", topicWords.slice(0, 20));
                        setShowTopicSelector(false);
                      } else {
                        alert("You have already learned all words in this topic!");
                      }
                    }}
                    className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
                  >
                    <div className="font-bold text-gray-900">{topic.name}</div>
                    <div className="text-sm text-gray-500">
                      {unlearnedCount} untested words
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
