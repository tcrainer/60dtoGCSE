/**
 * Creates a gapped version of a German sentence by blanking out
 * the target word (and articles/reflexive pronouns where appropriate).
 *
 * Returns { gapped: string, revealed: string } where:
 *  - gapped: the sentence with blanks (______)
 *  - revealed: the original sentence (for showing after correct answer)
 */

const ARTICLES = ['der', 'die', 'das', 'dem', 'den', 'des', 'ein', 'eine', 'einem', 'einen', 'einer', 'eines'];
const DICT_ARTICLES = ['der', 'die', 'das'];
const SEPARABLE_PREFIXES = ['ab', 'an', 'auf', 'aus', 'bei', 'ein', 'fest', 'her', 'hin', 'los', 'mit', 'nach', 'um', 'vor', 'weg', 'zu', 'zurück'];
const REFLEXIVE_PRONOUNS = ['mich', 'dich', 'sich', 'uns', 'euch'];
const BLANK = '______';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replace a word in a sentence, handling umlauts where \b fails */
function replaceWord(sentence: string, word: string, replacement: string): string {
  // Try \b first
  const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'i');
  if (regex.test(sentence)) {
    return sentence.replace(regex, replacement);
  }
  // Fallback for umlauts: use space/punctuation boundaries
  const escaped = escapeRegex(word);
  const softRegex = new RegExp(`(?<=^|[\\s.,!?;:()])${escaped}(?=$|[\\s.,!?;:()])`, 'i');
  if (softRegex.test(sentence)) {
    return sentence.replace(softRegex, replacement);
  }
  return sentence;
}

/** Remove dictionary article from a word, return [hasArticle, stem] */
function stripDictArticle(word: string): [boolean, string] {
  for (const art of DICT_ARTICLES) {
    if (word.toLowerCase().startsWith(art + ' ')) {
      return [true, word.substring(art.length + 1).trim()];
    }
    // Handle "der/die Reisende"
    const slashPattern = new RegExp(`^${art}\\s*/\\s*\\w+\\s+`, 'i');
    if (slashPattern.test(word)) {
      return [true, word.replace(slashPattern, '').trim()];
    }
  }
  return [false, word];
}

/** Try to blank a word in the sentence (case-insensitive, word-boundary) */
function blankWord(sentence: string, word: string): { result: string; found: boolean } {
  // Try exact match with word boundary first
  const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'i');
  if (regex.test(sentence)) {
    return { result: sentence.replace(regex, BLANK), found: true };
  }
  // Word boundary \b doesn't work well with umlauts (ä, ö, ü, ß)
  // Try matching with space/punctuation boundaries instead
  const escaped = escapeRegex(word);
  const softRegex = new RegExp(`(?<=^|[\\s.,!?;:])${escaped}(?=$|[\\s.,!?;:])`, 'i');
  if (softRegex.test(sentence)) {
    return { result: sentence.replace(softRegex, BLANK), found: true };
  }
  // Try as suffix of a compound word (e.g., "Ferien" in "Sommerferien", "Baum" in "Apfelbaum")
  const compoundRegex = new RegExp(`(\\S+)${escaped}\\b`, 'i');
  const compoundMatch = sentence.match(compoundRegex);
  if (compoundMatch) {
    // Blank the entire compound word
    const fullWord = compoundMatch[0];
    return { result: sentence.replace(fullWord, BLANK), found: true };
  }
  // Also try compound suffix without \b (for umlauts at end)
  const compoundSoftRegex = new RegExp(`(\\S+)${escaped}(?=$|[\\s.,!?;:])`, 'i');
  const compoundSoftMatch = sentence.match(compoundSoftRegex);
  if (compoundSoftMatch) {
    const fullWord = compoundSoftMatch[0];
    return { result: sentence.replace(fullWord, BLANK), found: true };
  }
  return { result: sentence, found: false };
}

/** Try to blank an article that appears before a blank in the sentence */
function blankArticleBefore(sentence: string): string {
  // Find the closest article before the FIRST blank (max 3 words before it)
  // e.g., "in der Stadtmitte" → "der" before blank
  // e.g., "in einer großen Stadt" → "einer" before blank
  // Must NOT match unrelated articles earlier in the sentence
  const articlesPattern = ARTICLES.join('|');
  // Match: article + up to 2 optional adjective/words + blank
  // Use character class that includes German umlauts (ä, ö, ü, ß)
  const WORD = '[a-zA-ZäöüÄÖÜß]+';
  const pattern = new RegExp(
    `(?:^|\\s)(${articlesPattern})((?:\\s+${WORD}){0,2})\\s+${escapeRegex(BLANK)}`,
    'gi'
  );
  // Find ALL matches and use the last one (closest to blank)
  let lastMatch: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(sentence)) !== null) {
    lastMatch = m;
  }
  if (lastMatch) {
    const article = lastMatch[1];
    const middle = lastMatch[2]; // adjectives between article and blank
    // Replace this specific occurrence: article + middle + blank → blank + middle + blank
    const toReplace = new RegExp(
      `(^|\\s)${escapeRegex(article)}${escapeRegex(middle)}\\s+${escapeRegex(BLANK)}`,
      'i'
    );
    return sentence.replace(toReplace, `$1${BLANK}${middle} ${BLANK}`);
  }
  return sentence;
}

/** Handle separable verb: find conjugated stem + prefix at end or clause boundary */
function handleSeparableVerb(sentence: string, infinitive: string): { result: string; found: boolean } {
  for (const prefix of SEPARABLE_PREFIXES) {
    if (!infinitive.startsWith(prefix)) continue;
    
    const stem = infinitive.substring(prefix.length); // e.g., "kommen" from "ankommen"
    
    // Look for the prefix at end of sentence OR before a comma/clause boundary
    const prefixAtEnd = new RegExp(`\\b${escapeRegex(prefix)}\\s*([.,!?;:]*)\\s*$`, 'i');
    const prefixAtClause = new RegExp(`\\b${escapeRegex(prefix)}\\s*,`, 'i');
    const prefixStandalone = new RegExp(`\\b${escapeRegex(prefix)}\\b`, 'i');
    
    const hasPrefixAtEnd = prefixAtEnd.test(sentence);
    const hasPrefixAtClause = prefixAtClause.test(sentence);
    
    if (!hasPrefixAtEnd && !hasPrefixAtClause) continue;
    
    // Find a word in the sentence that looks like a conjugation of the stem
    const stemRoot = stem.replace(/e?n$/, ''); // remove -en/-n ending: "komm" from "kommen"
    const words = sentence.replace(/[.,!?;:]/g, '').split(/\s+/);
    
    let result = sentence;
    let foundStem = false;
    
    for (const w of words) {
      if (w.toLowerCase() === prefix.toLowerCase()) continue; // skip the prefix itself
      if (w.toLowerCase().startsWith(stemRoot.toLowerCase()) && w.length >= stemRoot.length) {
        // This looks like a conjugated form
        result = replaceWord(result, w, BLANK);
        foundStem = true;
        break;
      }
    }
    
    if (foundStem) {
      // Blank the prefix
      if (hasPrefixAtEnd) {
        result = result.replace(prefixAtEnd, `${BLANK}$1`);
      } else {
        // At clause boundary: blank just the prefix word, keep the comma
        result = result.replace(prefixStandalone, BLANK);
      }
      return { result, found: true };
    }
  }
  return { result: sentence, found: false };
}

/** Handle reflexive verb: blank reflexive pronoun and verb form */
function handleReflexiveVerb(sentence: string, verbWithoutSich: string): { result: string; found: boolean } {
  let result = sentence;
  let foundVerb = false;
  
  // First try the whole verb (might be infinitive in sentence)
  const verbBlank = blankWord(result, verbWithoutSich);
  if (verbBlank.found) {
    result = verbBlank.result;
    foundVerb = true;
  } else {
    // Try to find conjugated form
    const stemRoot = verbWithoutSich.replace(/e?n$/, '');
    const words = sentence.replace(/[.,!?;:]/g, '').split(/\s+/);
    
    for (const w of words) {
      if (REFLEXIVE_PRONOUNS.includes(w.toLowerCase())) continue;
      if (w.toLowerCase().startsWith(stemRoot.toLowerCase()) && w.length >= stemRoot.length) {
        result = replaceWord(result, w, BLANK);
        foundVerb = true;
        break;
      }
    }
  }
  
  // Also blank the reflexive pronoun
  if (foundVerb) {
    for (const pron of REFLEXIVE_PRONOUNS) {
      const pronRegex = new RegExp(`\\b${escapeRegex(pron)}\\b`, 'i');
      if (pronRegex.test(result)) {
        result = result.replace(pronRegex, BLANK);
        break;
      }
    }
  }
  
  return { result, found: foundVerb };
}

export function createGappedSentence(germanWord: string, germanSentence: string): string {
  if (!germanSentence) return '';
  
  let word = germanWord.trim();
  let sentence = germanSentence.trim();
  
  // Handle alternatives - take first option for matching
  // e.g., "wechseln, umtauschen" → try "umtauschen" first (more likely in sentence), then "wechseln"
  const alternatives = word.split(/[/,]/).map(s => s.trim()).filter(Boolean);
  
  // Try each alternative
  for (const alt of alternatives) {
    const result = tryCreateGap(alt, sentence);
    if (result !== sentence) return result;
  }
  
  // If nothing worked, try each alternative reversed
  for (const alt of [...alternatives].reverse()) {
    const result = tryCreateGap(alt, sentence);
    if (result !== sentence) return result;
  }
  
  // Fallback: return the sentence as-is (no gaps - shouldn't happen often)
  return sentence;
}

function tryCreateGap(word: string, sentence: string): string {
  // Strip dictionary article
  const [hasArticle, stem] = stripDictArticle(word);
  
  // Check for reflexive verb (starts with "sich ")
  const isReflexive = stem.toLowerCase().startsWith('sich ');
  const verbAfterSich = isReflexive ? stem.substring(5).trim() : stem;
  
  // Strategy 1: Try direct match of the full stem (works for most nouns, adjectives, country names)
  // For multi-word stems, try matching each component
  const stemParts = (isReflexive ? verbAfterSich : stem).split(/\s+/);
  
  if (stemParts.length === 1) {
    // Single word - try direct match
    const direct = blankWord(sentence, stemParts[0]);
    if (direct.found) {
      let result = direct.result;
      if (hasArticle) result = blankArticleBefore(result);
      if (isReflexive) {
        // Also blank reflexive pronoun
        for (const pron of REFLEXIVE_PRONOUNS) {
          const pronRegex = new RegExp(`\\b${escapeRegex(pron)}\\b`, 'i');
          if (pronRegex.test(result)) {
            result = result.replace(pronRegex, BLANK);
            break;
          }
        }
      }
      return result;
    }
    
    // Strategy 2: Separable verb
    const sep = handleSeparableVerb(sentence, stemParts[0]);
    if (sep.found) return sep.result;
    
    // Strategy 3: Reflexive verb with conjugation
    if (isReflexive) {
      const refl = handleReflexiveVerb(sentence, verbAfterSich);
      if (refl.found) return refl.result;
    }
    
    // Strategy 4: Try matching conjugated verb forms
    // Remove -en/-n ending and look for stem root
    const stemRoot = stemParts[0].replace(/e?n$/, '');
    if (stemRoot.length >= 3) {
      const words = sentence.replace(/[.,!?;:!]/g, '').split(/\s+/);
      for (const w of words) {
        if (w.toLowerCase().startsWith(stemRoot.toLowerCase()) && w.length >= stemRoot.length) {
          let result = replaceWord(sentence, w, BLANK);
          return result;
        }
      }
    }
  } else {
    // Multi-word expression: blank each part
    let result = sentence;
    let anyFound = false;
    
    for (const part of stemParts) {
      const partResult = blankWord(result, part);
      if (partResult.found) {
        result = partResult.result;
        anyFound = true;
      } else {
        // Try conjugated form for verbs in multi-word expressions
        const partRoot = part.replace(/e?n$/, '');
        if (partRoot.length >= 3) {
          const words = result.replace(/[.,!?;:]/g, '').split(/\s+/);
          for (const w of words) {
            if (w.toLowerCase().startsWith(partRoot.toLowerCase()) && w.length >= partRoot.length && w !== BLANK) {
              result = replaceWord(result, w, BLANK);
              anyFound = true;
              break;
            }
          }
        }
        
        // Also check for separable prefix at end
        for (const prefix of SEPARABLE_PREFIXES) {
          if (part.startsWith(prefix)) {
            const prefixAtEnd = new RegExp(`\\b${escapeRegex(prefix)}\\s*([.,!?;:]*)\\s*$`, 'i');
            if (prefixAtEnd.test(result)) {
              const innerStem = part.substring(prefix.length).replace(/e?n$/, '');
              const words2 = result.replace(/[.,!?;:]/g, '').split(/\s+/);
              for (const w of words2) {
                if (w !== BLANK && w.toLowerCase().startsWith(innerStem.toLowerCase()) && w.length >= innerStem.length) {
                  result = replaceWord(result, w, BLANK);
                  result = result.replace(prefixAtEnd, `${BLANK}$1`);
                  anyFound = true;
                  break;
                }
              }
            }
          }
        }
      }
    }
    
    if (anyFound) {
      if (hasArticle) result = blankArticleBefore(result);
      return result;
    }
  }
  
  return sentence; // No match found
}
