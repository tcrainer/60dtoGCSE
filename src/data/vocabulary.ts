import { topicAVocab } from "./topicA";
import { topicBVocab } from "./topicB";
import { topicCVocab } from "./topicC";
import { topicDVocab } from "./topicD";
import { topicEVocab } from "./topicE";
import { topicFVocab } from "./topicF";
import { topicGVocab } from "./topicG";
import { topicHVocab } from "./topicH";
import { topicB1Vocab } from "./topicB1";
import { topicB1WritingVocab } from "./topicB1Writing";

export interface Topic {
  id: string;
  name: string;
  totalWords: number;
}

export const topics: Topic[] = [
  { id: "A", name: "Home and abroad", totalWords: 0 },
  { id: "B", name: "Education & Employment", totalWords: 0 },
  { id: "C", name: "Personal life & Relationships", totalWords: 0 },
  { id: "D", name: "The world around us", totalWords: 0 },
  { id: "E", name: "Social activities, health", totalWords: 0 },
  { id: "F", name: "Strukturwörter (Structural)", totalWords: 0 },
  { id: "G", name: "Opinion, Intensifiers, Adj.", totalWords: 0 },
  { id: "H", name: "Most Important Verbs and Tenses", totalWords: 0 },
  { id: "B1", name: "B1 Vocabulary", totalWords: 0 },
  { id: "S1", name: "Schreiben 1 - Informal", totalWords: 0 },
  { id: "S2", name: "Schreiben 2 - Opinion", totalWords: 0 },
  { id: "S3", name: "Schreiben 3 - Formal", totalWords: 0 },
];

export interface Word {
  id: string;
  topicId: string;
  day: number | string;
  german: string;
  english: string;
  category?: string;
  german3rdPerson?: string;
  germanImperfekt?: string;
  germanPerfekt?: string;
  englishImperfekt?: string;
  englishPerfekt?: string;
  isVerb?: boolean;
}

const parseVocab = (topicId: string, rawData: string): Word[] => {
  return rawData
    .trim()
    .split("\n")
    .map((line, index) => {
      const [dayStr, german, english] = line.split("\t");
      const day = parseInt(dayStr, 10);
      return {
        id: `word_${topicId}_${index}`,
        topicId,
        day,
        german: german?.trim() || "",
        english: english?.trim() || "",
      };
    })
    .filter((w) => w.german && w.english && !isNaN(w.day));
};

const parseVerbVocab = (topicId: string, rawData: string): Word[] => {
  return rawData
    .trim()
    .split("\n")
    .map((line, index) => {
      const [
        dayStr,
        german,
        german3rd,
        germanImp,
        germanPerf,
        english,
        englishImp,
        englishPerf,
        type,
      ] = line.split("\t");
      const day = parseInt(dayStr, 10);
      return {
        id: `word_${topicId}_${index}`,
        topicId,
        day,
        german: german?.trim() || "",
        german3rdPerson: german3rd?.trim() || "",
        germanImperfekt: germanImp?.trim() || "",
        germanPerfekt: germanPerf?.trim() || "",
        english: english?.trim() || "",
        englishImperfekt: englishImp?.trim() || "",
        englishPerfekt: englishPerf?.trim() || "",
        category: type?.trim() || "",
        isVerb: true,
      };
    })
    .filter((w) => w.german && w.english && !isNaN(w.day));
};

const parseB1Vocab = (topicId: string, rawData: string): Word[] => {
  const words = rawData
    .trim()
    .split("\n")
    .map((line, index) => {
      const [dayStr, german, english] = line.split("\t");
      const day = parseInt(dayStr, 10);
      return {
        id: `word_${topicId}_${index}`,
        topicId,
        day,
        german: german?.trim() || "",
        english: english?.trim() || "",
      };
    })
    .filter((w) => w.german && w.english && !isNaN(w.day));

  // Split each day into 'a' and 'b'
  const splitWords: Word[] = [];
  const wordsByDay: { [key: number]: Word[] } = {};
  words.forEach(w => {
    const dayNum = w.day as number;
    if (!wordsByDay[dayNum]) wordsByDay[dayNum] = [];
    wordsByDay[dayNum].push(w);
  });

  Object.keys(wordsByDay).forEach(dayKey => {
    const day = parseInt(dayKey, 10);
    const dayWords = wordsByDay[day];
    const mid = Math.ceil(dayWords.length / 2);
    dayWords.forEach((w, i) => {
      splitWords.push({
        ...w,
        day: i < mid ? `${day}a` : `${day}b`
      });
    });
  });

  return splitWords;
};

export const vocabulary: Word[] = [
  ...parseVocab("A", topicAVocab),
  ...parseVocab("B", topicBVocab),
  ...parseVocab("C", topicCVocab),
  ...parseVocab("D", topicDVocab),
  ...parseVocab("E", topicEVocab),
  ...parseVocab("F", topicFVocab),
  ...parseVocab("G", topicGVocab),
  ...parseVerbVocab("H", topicHVocab),
  ...parseB1Vocab("B1", topicB1Vocab),
  ...parseVocab("S1", topicB1WritingVocab).filter(w => Number(w.day) >= 1 && Number(w.day) <= 7),
  ...parseVocab("S2", topicB1WritingVocab).filter(w => Number(w.day) >= 8 && Number(w.day) <= 14).map(w => ({ ...w, topicId: "S2", day: Number(w.day) - 7 })),
  ...parseVocab("S3", topicB1WritingVocab).filter(w => Number(w.day) >= 15 && Number(w.day) <= 23).map(w => ({ ...w, topicId: "S3", day: Math.min(7, Number(w.day) - 14) })),
];

// Update topic counts
topics.forEach((topic) => {
  topic.totalWords = vocabulary.filter((w) => w.topicId === topic.id).length;
});
