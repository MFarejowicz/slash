import { random } from "lodash";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const PATTERNS = ["AABBCBB", "AABBBCC"];

function removeDuplicateCharacters(str: string) {
  return str
    .split("")
    .filter((item, pos, self) => self.indexOf(item) === pos)
    .join("");
}

function getRandomCharacter(used: Set<string>) {
  let char = ALPHABET[random(ALPHABET.length - 1)];
  while (used.has(char)) {
    char = ALPHABET[random(ALPHABET.length - 1)];
  }
  return char;
}

export function generateSequence() {
  const index = random(PATTERNS.length - 1);
  const pattern = PATTERNS[index];

  const unique = removeDuplicateCharacters(pattern);
  const used = new Set<string>();

  const patternMap: { [base: string]: string } = {};
  for (const letter of unique) {
    const randomCharacter = getRandomCharacter(used);
    used.add(randomCharacter);
    patternMap[letter] = randomCharacter;
  }

  return pattern.replace(new RegExp(`[${unique}]`, "g"), (base) => patternMap[base]).split("");
}
