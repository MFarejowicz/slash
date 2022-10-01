import { sample } from "lodash";

interface PatternMap {
  [char: string]: string;
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const PATTERNS = ["AABBCBB", "AABBBCC"];

function getRandomCharacter(map: PatternMap) {
  let char = sample(ALPHABET)!;
  while (char in map) {
    char = sample(ALPHABET)!;
  }
  return char;
}

export function generateSequence() {
  const pattern = sample(PATTERNS)!;

  const patternMap: PatternMap = {};
  const result: string[] = [];
  for (const letter of pattern) {
    if (!(letter in patternMap)) {
      const randomCharacter = getRandomCharacter(patternMap);
      patternMap[letter] = randomCharacter;
    }
    result.push(patternMap[letter]);
  }

  return result;
}
