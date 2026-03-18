export function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/\.\.\./g, "")
    .replace(/[.,?!]/g, "")
    .replace(/^to\s+/i, "")
    .replace(/^(ich|du|er|sie|es|wir|ihr|sie|Sie)\s+/i, "")
    .trim();
}

export function stripArticle(text: string) {
  return text.replace(/^(der|die|das|ein|eine|einen)\s+/i, "").trim();
}

export function getArticle(text: string) {
  const match = text.match(/^(der|die|das|ein|eine|einen)\s+/i);
  return match ? match[1].toLowerCase() : "";
}

export function removeParentheses(text: string) {
  return text.replace(/\(.*?\)/g, "").trim();
}

export function extractParenthesesContent(text: string) {
  const matches = text.match(/\((.*?)\)/g);
  if (!matches) return [];
  return matches.map((m) => m.replace(/[()]/g, "").trim().toLowerCase());
}

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}

function hasUmlautMismatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const umlautMap: Record<string, string> = {
    ä: "a",
    ö: "o",
    ü: "u",
    ß: "ss",
    Ä: "A",
    Ö: "O",
    Ü: "U",
  };
  for (let i = 0; i < a.length; i++) {
    const charA = a[i];
    const charB = b[i];
    if (charA !== charB) {
      if (umlautMap[charA] === charB || umlautMap[charB] === charA) {
        return true;
      }
    }
  }
  return false;
}

/** 
 * Pre-process target to expand shared-noun article patterns.
 * "der/die Reisende" → "der Reisende / die Reisende"
 * "der/die Angestellte, -n" → "der Angestellte, -n / die Angestellte, -n"
 * This prevents "/" from splitting into "der" and "die Reisende" as two unrelated options.
 */
function expandArticleSlash(text: string): string {
  const ARTICLES = ['der', 'die', 'das', 'ein', 'eine', 'einen', 'einem', 'einer'];
  // Pattern: article/article followed by a word (the shared noun)
  // e.g. "der/die Reisende" or "ein/eine Angestellte, -n"
  return text.replace(
    new RegExp(`\\b(${ARTICLES.join('|')})\\s*/\\s*(${ARTICLES.join('|')})\\s+`, 'gi'),
    (match, art1, art2, offset, str) => {
      // Find the rest of the string (the shared noun + any suffix like ", -n")
      const rest = str.substring(offset + match.length);
      // Take everything up to the next " / " or end (but not comma-space that's part of declension like ", -n")
      const nounMatch = rest.match(/^(\S+(?:\s*,\s*-\w*)?)/);
      if (nounMatch) {
        const noun = nounMatch[1];
        // Replace the whole "art1/art2 noun" with "art1 noun / art2 noun"
        return `${art1} ${noun} / ${art2} `;
      }
      return match;
    }
  );
}

export function checkAnswer(
  userInput: string,
  target: string,
  isGermanTarget: boolean,
) {
  // Pre-process: expand "der/die Noun" → "der Noun / die Noun"
  target = expandArticleSlash(target);
  
  const targetSynonyms = target
    .split(/[/,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const userSynonyms = userInput
    .split(/[/,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (userSynonyms.length === 0) return { isCorrect: false, points: 0 };

  let totalPoints = 0;
  let matchedTargets = new Set<number>();
  let wrongGenderMessage = "";

  for (const userSyn of userSynonyms) {
    const rawUser = userSyn;
    const normUser = normalizeText(removeParentheses(userSyn));
    const normUserNoArticle = stripArticle(normUser);
    const userArticle = getArticle(normalizeText(userSyn));

    let bestMatchPoints = 0;
    let bestTargetIdx = -1;
    let genderWrongForThisMatch = false;
    let correctGenderForThisMatch = "";
    let extraPoints = 0;

    for (let i = 0; i < targetSynonyms.length; i++) {
      if (matchedTargets.has(i)) continue;

      const rawTarget = targetSynonyms[i];
      const normTarget = normalizeText(removeParentheses(rawTarget));
      const normTargetNoArticle = stripArticle(normTarget);
      const targetArticle = getArticle(normalizeText(rawTarget));
      const targetOptionals = extractParenthesesContent(rawTarget);

      const maxDistance = 0;

      const isBaseMatch =
        normUserNoArticle === normTargetNoArticle ||
        (levenshtein(normUserNoArticle, normTargetNoArticle) <= maxDistance &&
          !hasUmlautMismatch(normUserNoArticle, normTargetNoArticle));

      if (isBaseMatch) {
        let points = 10;
        let genderWrong = false;

        if (isGermanTarget && targetArticle) {
          if (userArticle !== targetArticle) {
            points = 7;
            genderWrong = true;
          }
        }

        let bonus = 0;
        if (targetOptionals.length > 0) {
          const userFullText = normalizeText(rawUser);
          for (const opt of targetOptionals) {
            const normOpt = normalizeText(opt);
            if (
              rawUser.includes(`(${opt})`) ||
              userFullText.endsWith(` ${normOpt}`) ||
              userFullText.includes(` ${normOpt} `)
            ) {
              bonus += 5;
            }
          }
        }

        if (points + bonus > bestMatchPoints) {
          bestMatchPoints = points;
          bestTargetIdx = i;
          genderWrongForThisMatch = genderWrong;
          correctGenderForThisMatch = targetArticle;
          extraPoints = bonus;
        }
      }
    }

    if (bestTargetIdx !== -1) {
      totalPoints += bestMatchPoints + extraPoints;
      matchedTargets.add(bestTargetIdx);
      if (genderWrongForThisMatch) {
        wrongGenderMessage = `Wrong gender! The correct gender is "${correctGenderForThisMatch}".`;
      }
    }
  }

  let isCorrect = matchedTargets.size > 0;

  return {
    isCorrect,
    points: totalPoints,
    message: wrongGenderMessage || undefined,
  };
}

// For writing phrases, commas are part of the grammar not synonym separators.
// Only split on / to allow either option (e.g. "Liebe NAME / Lieber NAME").
// Students can type either side of the / and it counts as correct.
// Students can also type "A / B" (both sides with slash) and it counts as correct.
function checkFormalPronouns(userInput: string, target: string): boolean {
  const formalRe = /\b(Sie|Ihnen|Ihres|Ihrem|Ihren|Ihrer|Ihre|Ihr)\b/g;
  const targetMatches = [...target.matchAll(formalRe)].map(m => m[1]);
  if (targetMatches.length === 0) return true;
  for (const form of targetMatches) {
    const re = new RegExp(`\\b${form}\\b`);
    if (!re.test(userInput)) return false;
  }
  return true;
}

/** Normalize for writing: strip punctuation, lowercase, but keep all words (including pronouns) */
function normalizeWriting(text: string): string {
  return text
    .replace(/\.\.\./g, "")
    .replace(/[.,?!;:–—""„"'«»()]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Get sorted word bag from a string */
function wordBag(text: string): string[] {
  return text.split(/\s+/).filter(Boolean).sort();
}

/** Check if two word bags match, allowing a total Levenshtein budget for typos across all words */
function wordBagsMatch(userWords: string[], targetWords: string[]): boolean {
  if (userWords.length !== targetWords.length) return false;
  // Sort both and compare word by word, allowing 1 typo total
  let totalDist = 0;
  for (let i = 0; i < userWords.length; i++) {
    const d = levenshtein(userWords[i], targetWords[i]);
    totalDist += d;
    if (totalDist > 1) return false;
  }
  return true;
}

export function checkWritingAnswer(userInput: string, target: string) {
  const targetOptions = target
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);

  // Allow user to type either side of a slash, or both sides with a slash.
  const userOptions = userInput
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);

  if (userOptions.length === 0) return { isCorrect: false, points: 0 };

  for (const userOpt of userOptions) {
    const userNorm = normalizeWriting(userOpt);

    for (const option of targetOptions) {
      const optStripped  = normalizeWriting(removeParentheses(option));
      const optExpanded  = normalizeWriting(option.replace(/\(([^)]+)\)/g, "$1"));

      for (const optNorm of [optStripped, optExpanded]) {
        // 1. Exact match (after punctuation stripping)
        if (userNorm === optNorm) {
          if (!checkFormalPronouns(userOpt, option)) return { isCorrect: false, points: 0, message: "Check capitalisation: Sie / Ihnen / Ihr" };
          return { isCorrect: true, points: 10 };
        }

        // 2. Levenshtein on the whole string (catches small typos)
        const maxDist = optNorm.length > 10 ? 1 : 0;
        if (levenshtein(userNorm, optNorm) <= maxDist) {
          if (!checkFormalPronouns(userOpt, option)) return { isCorrect: false, points: 0, message: "Check capitalisation: Sie / Ihnen / Ihr" };
          return { isCorrect: true, points: 10 };
        }

        // 3. Word-bag comparison: same words in any order (German word order flexibility)
        const userWords = wordBag(userNorm);
        const optWords = wordBag(optNorm);
        if (wordBagsMatch(userWords, optWords)) {
          if (!checkFormalPronouns(userOpt, option)) return { isCorrect: false, points: 0, message: "Check capitalisation: Sie / Ihnen / Ihr" };
          return { isCorrect: true, points: 10 };
        }
      }
    }
  }

  return { isCorrect: false, points: 0 };
}
