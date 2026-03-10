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

export function checkAnswer(
  userInput: string,
  target: string,
  isGermanTarget: boolean,
) {
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

      // Stricter distance: whole word must count (no typos allowed for base match)
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

        // Check optional content
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
