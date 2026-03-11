import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays, startOfDay } from "date-fns";

export interface UserWord {
  wordId: string;
  box: number;
  nextReviewDate: string | null;
  lastTestedDate: string | null;
  consecutiveWrong: number; // count of consecutive wrong answers
}

export interface UserStats {
  points: number;
  timeSpent: number;
  testTimeSpent: number;   // seconds spent in test/learn mode
  reviseTimeSpent: number; // seconds spent in revise mode
  wordsLearnt: number;
  wordsRevised: number;
  groupsLearnt: number;
  wordsFinished: number;
  streak: number;
  lastActiveDate: string | null;
  jokers: number;
  timedBests: { duration: number; words: number; date: string }[];
}

export interface DayStats {
  wordsTested: number;
  wordsRevised: number;
  points: number;
  bonusesAwarded: string[];
}

// ── Level system ──────────────────────────────────────────────────────────────
export const LEVELS = [
  { level: 1,  name: "Rookie",             minPoints: 0     },
  { level: 2,  name: "Schüler",            minPoints: 100   },
  { level: 3,  name: "Lernender",          minPoints: 300   },
  { level: 4,  name: "Fortgeschrittener",  minPoints: 700   },
  { level: 5,  name: "Sprachprofi",        minPoints: 1500  },
  { level: 6,  name: "Wortmeister",        minPoints: 3000  },
  { level: 7,  name: "Deutschheld",        minPoints: 6000  },
  { level: 8,  name: "Sprachgenie",        minPoints: 12000 },
  { level: 9,  name: "Deutschmeister",     minPoints: 25000 },
  { level: 10, name: "Sprachlegende",      minPoints: 50000 },
];

export function getLevel(points: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (points >= l.minPoints) current = l;
  }
  const nextLevel = LEVELS.find(l => l.minPoints > points);
  const progress = nextLevel
    ? ((points - current.minPoints) / (nextLevel.minPoints - current.minPoints)) * 100
    : 100;
  return { ...current, nextLevel, progress };
}

// ── Streak bonus per daily GCSE session ───────────────────────────────────────
// Returns how many points a completed GCSE day earns based on current streak
export function getStreakBonus(streak: number): number {
  if (streak <= 0)  return 0;
  if (streak === 1) return 20;
  if (streak === 2) return 40;
  if (streak === 3) return 60;
  if (streak === 4) return 80;
  if (streak <= 9)  return 100;   // 5–9 flames
  if (streak <= 19) return 150;   // 10–19 flames
  if (streak <= 29) return 200;   // 20–29 flames
  if (streak <= 39) return 250;   // 30–39 flames
  if (streak <= 49) return 300;   // 40–49 flames
  return 400;                      // 50+ flames
}

// Returns the flame emoji string for display, e.g. "🔥🔥🔥"
export function getStreakFlames(streak: number): string {
  const count = Math.min(streak, 5);
  return "🔥".repeat(count);
}

// ── Date helpers ──────────────────────────────────────────────────────────────
const getTodayKey = () => new Date().toISOString().split("T")[0];

const getDayBeforeYesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  return d.toISOString().split("T")[0];
};

const getYesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

// ── Streak computation ────────────────────────────────────────────────────────
// Returns updated streak, lastActiveDate, jokersLeft, and whether a new joker
// was just earned (streak hit a new multiple of 7)
function computeStreak(
  currentStreak: number,
  lastActiveDate: string | null,
  currentJokers: number,
): { streak: number; lastActiveDate: string; jokers: number; newJokerEarned: boolean } {
  const today = getTodayKey();
  const yesterday = getYesterdayKey();
  const dayBeforeYesterday = getDayBeforeYesterdayKey();

  // Already active today — no change
  if (lastActiveDate === today) {
    return { streak: currentStreak, lastActiveDate: today, jokers: currentJokers, newJokerEarned: false };
  }

  // Active yesterday — extend streak
  if (lastActiveDate === yesterday) {
    const newStreak = currentStreak + 1;
    // Award a joker every 7 days in a row
    const newJokerEarned = newStreak % 7 === 0;
    return {
      streak: newStreak,
      lastActiveDate: today,
      jokers: newJokerEarned ? currentJokers + 1 : currentJokers,
      newJokerEarned,
    };
  }

  // Missed exactly one day AND has a joker — use it to save the streak
  if (lastActiveDate === dayBeforeYesterday && currentJokers > 0) {
    const newStreak = currentStreak + 1;
    const newJokerEarned = newStreak % 7 === 0;
    return {
      streak: newStreak,
      lastActiveDate: today,
      jokers: newJokerEarned ? currentJokers - 1 + 1 : currentJokers - 1, // use 1, maybe earn 1
      newJokerEarned,
    };
  }

  // Streak broken — reset to 1
  return { streak: 1, lastActiveDate: today, jokers: currentJokers, newJokerEarned: false };
}

// ── Store ─────────────────────────────────────────────────────────────────────
interface StoreState {
  userWords: Record<string, UserWord>;
  stats: UserStats;
  dailyStats: Record<string, DayStats>;
  updateWord: (wordId: string, isCorrect: boolean, mode: "test" | "learn" | "revise" | "practice") => void;
  addPoints: (points: number) => void;
  awardBonus: (bonusId: string, points: number) => void;
  addTime: (seconds: number, mode?: "test" | "learn" | "revise" | "practice") => void;
  recordTimedResult: (duration: number, words: number) => void;
  resetProgress: () => void;
}

const getNextReviewDate = (box: number): string | null => {
  const now = new Date();
  switch (box) {
    case 1: return startOfDay(now).toISOString();           // due immediately (today)
    case 2: return startOfDay(addDays(now, 1)).toISOString(); // due from midnight tonight
    case 3: return startOfDay(addDays(now, 3)).toISOString();
    case 4: return startOfDay(addDays(now, 7)).toISOString();
    case 5: return startOfDay(addDays(now, 12)).toISOString();
    case 6: return null;
    default: return null;
  }
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      userWords: {},
      stats: {
        points: 0,
        timeSpent: 0,
        testTimeSpent: 0,
        reviseTimeSpent: 0,
        wordsLearnt: 0,
        wordsRevised: 0,
        groupsLearnt: 0,
        wordsFinished: 0,
        streak: 0,
        lastActiveDate: null,
        jokers: 0,
        timedBests: [],
      },
      dailyStats: {},

      addPoints: (points) => {
        set((state) => {
          const today = getTodayKey();
          const currentDayStats = state.dailyStats[today] || { wordsTested: 0, wordsRevised: 0, points: 0, bonusesAwarded: [] };
          const { streak, lastActiveDate, jokers } = computeStreak(state.stats.streak, state.stats.lastActiveDate, state.stats.jokers ?? 0);

          // Daily check-in bonus: 25 pts first activity of the day
          const checkInId = `CHECKIN_${today}`;
          const alreadyCheckedIn = (currentDayStats.bonusesAwarded || []).includes(checkInId);
          const checkInBonus = alreadyCheckedIn ? 0 : 25;
          const newBonuses = alreadyCheckedIn
            ? currentDayStats.bonusesAwarded
            : [...(currentDayStats.bonusesAwarded || []), checkInId];

          const total = points + checkInBonus;
          return {
            stats: { ...state.stats, points: state.stats.points + total, streak, lastActiveDate, jokers },
            dailyStats: {
              ...state.dailyStats,
              [today]: { ...currentDayStats, points: (currentDayStats.points || 0) + total, bonusesAwarded: newBonuses },
            },
          };
        });
      },

      awardBonus: (bonusId, points) => {
        set((state) => {
          const today = getTodayKey();
          const currentDayStats = state.dailyStats[today] || { wordsTested: 0, wordsRevised: 0, points: 0, bonusesAwarded: [] };
          const bonuses = currentDayStats.bonusesAwarded || [];
          if (bonuses.includes(bonusId)) return state;

          const { streak, lastActiveDate, jokers, newJokerEarned } = computeStreak(
            state.stats.streak, state.stats.lastActiveDate, state.stats.jokers ?? 0
          );

          // If this is the GCSE day-complete bonus, also award streak bonus once per day
          const streakBonusId = `STREAK_BONUS_${today}`;
          const streakBonusAlreadyAwarded = bonuses.includes(streakBonusId);
          const isGcseBonus = bonusId.startsWith("GCSE_Day");
          const streakBonus = (isGcseBonus && !streakBonusAlreadyAwarded) ? getStreakBonus(streak) : 0;

          const newBonusIds = [
            ...bonuses,
            bonusId,
            ...(streakBonus > 0 ? [streakBonusId] : []),
            ...(newJokerEarned ? [`JOKER_EARNED_${streak}`] : []),
          ];

          const totalPoints = points + streakBonus;

          return {
            stats: { ...state.stats, points: state.stats.points + totalPoints, streak, lastActiveDate, jokers },
            dailyStats: {
              ...state.dailyStats,
              [today]: {
                ...currentDayStats,
                points: (currentDayStats.points || 0) + totalPoints,
                bonusesAwarded: newBonusIds,
              },
            },
          };
        });
      },

      addTime: (seconds, mode) => {
        set((state) => ({
          stats: {
            ...state.stats,
            timeSpent: state.stats.timeSpent + seconds,
            testTimeSpent: (state.stats.testTimeSpent ?? 0) + (mode === "test" || mode === "learn" ? seconds : 0),
            reviseTimeSpent: (state.stats.reviseTimeSpent ?? 0) + (mode === "revise" ? seconds : 0),
          },
        }));
      },

      updateWord: (wordId, isCorrect, mode) => {
        set((state) => {
          const currentWord = state.userWords[wordId] || { wordId, box: 0, nextReviewDate: null, lastTestedDate: null };
          let newBox = currentWord.box;
          const now = new Date().toISOString();
          let effectiveMode = mode;

          if (effectiveMode === "test") {
            // New word: correct → box 5 (review in 12 days), wrong → box 1 (review today)
            newBox = isCorrect ? 5 : 1;
          } else if (effectiveMode === "learn") {
            // Difficult words already in a box — move up naturally, don't force back to box 2
            newBox = isCorrect ? Math.min(newBox + 1, 6) : 1;
          } else if (effectiveMode === "revise") {
            // Always advance/drop — Revise button pre-filters to due words,
            // and Leitner box clicks should always allow progression.
            newBox = isCorrect ? Math.min(newBox + 1, 6) : 1;
          }

          const nextReviewDate = effectiveMode === "practice" ? currentWord.nextReviewDate : getNextReviewDate(newBox);
          const consecutiveWrong = isCorrect ? 0 : (currentWord.consecutiveWrong ?? 0) + 1;
          const updatedWord: UserWord = { ...currentWord, box: newBox, nextReviewDate, lastTestedDate: now, consecutiveWrong };

          const newStats = { ...state.stats };
          const today = getTodayKey();
          const currentDayStats = state.dailyStats[today] || { wordsTested: 0, wordsRevised: 0, points: 0, bonusesAwarded: [] };
          const newDayStats = { ...currentDayStats };

          const { streak, lastActiveDate, jokers } = computeStreak(state.stats.streak, state.stats.lastActiveDate, state.stats.jokers ?? 0);
          newStats.streak = streak;
          newStats.lastActiveDate = lastActiveDate;
          newStats.jokers = jokers;

          if (effectiveMode !== "practice") {
            if (currentWord.box === 0 && newBox > 0) {
              newStats.wordsLearnt++;
              newDayStats.wordsTested = (newDayStats.wordsTested || 0) + 1;
            } else if (currentWord.box > 0) {
              newStats.wordsRevised++;
              newDayStats.wordsRevised = (newDayStats.wordsRevised || 0) + 1;
            }
            if (currentWord.box < 6 && newBox === 6) newStats.wordsFinished++;
          }

          return {
            userWords: { ...state.userWords, [wordId]: updatedWord },
            stats: newStats,
            dailyStats: { ...state.dailyStats, [today]: newDayStats },
          };
        });
      },

      recordTimedResult: (duration, words) => {
        set((state) => {
          const existing = (state.stats.timedBests || []).filter(r => r.duration === duration);
          const updated = [...existing, { duration, words, date: getTodayKey() }]
            .sort((a, b) => b.words - a.words) // best first
            .slice(0, 7); // keep last 7
          const allOthers = (state.stats.timedBests || []).filter(r => r.duration !== duration);
          return { stats: { ...state.stats, timedBests: [...allOthers, ...updated] } };
        });
      },

      resetProgress: () => {
        set({
          userWords: {},
          stats: {
            points: 0, timeSpent: 0, testTimeSpent: 0, reviseTimeSpent: 0, wordsLearnt: 0, wordsRevised: 0,
            groupsLearnt: 0, wordsFinished: 0, streak: 0, lastActiveDate: null, jokers: 0, timedBests: [],
          },
          dailyStats: {},
        });
      },
    }),
    { name: "vocab-storage" },
  ),
);
