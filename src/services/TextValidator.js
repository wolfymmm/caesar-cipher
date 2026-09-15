import { ALPHABETS } from '../utils/alphabets';

export class TextValidator {
  static DISALLOWED_CHARS = {
    UA: /[^а-яіїєґ0-9\s.,!?:;'"()—–'’ʼ-]/gi,
    EN: /[^a-z0-9\s.,!?:;'"()—–'-]/gi,
  };

  static isValidPayload(text) {
    return typeof text === 'string' && text.trim().length > 0;
  }

  static sanitize(input, lang = 'UA', maxWords = 7) {
    if (!input) return '';

    const regex = this.DISALLOWED_CHARS[lang] || this.DISALLOWED_CHARS.UA;
    const filteredChars = input.replace(regex, '');
    const words = filteredChars.trim().split(/\s+/).filter(Boolean);

    if (words.length >= maxWords && /\s$/.test(filteredChars)) {
      return filteredChars.trimEnd();
    }

    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ');
    }

    return filteredChars;
  }

  static normalizeShift(rawValue, lang = 'UA') {
    if (rawValue === '' || rawValue === null || rawValue === undefined) return '';

    const cleanDigits = String(rawValue).replace(/\D/g, '');
    if (cleanDigits === '') return '';

    const alphabet = ALPHABETS[lang] || ALPHABETS.UA;
    const maxShift = alphabet.length - 1;
    const num = parseInt(cleanDigits, 10);

    if (num > maxShift) return maxShift;
    if (num < 0) return 0;

    return num;
  }
}