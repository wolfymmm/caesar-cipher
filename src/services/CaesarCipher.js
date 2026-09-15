import { ALPHABETS } from '../utils/alphabets';
import { TextValidator } from './TextValidator';

export class CaesarCipher {
  constructor(lang = 'UA') {
    this.setLanguage(lang);
  }

  setLanguage(lang) {
    this.lang = lang;
    this.alphabet = ALPHABETS[lang] || ALPHABETS.UA;
    this.n = this.alphabet.length;
  }

  validateKey(key) {
    const parsed = parseInt(key, 10);
    if (isNaN(parsed)) return 0;
    return ((parsed % this.n) + this.n) % this.n;
  }

  encrypt(text, shift) {
    return this._transform(text, shift, true);
  }

  decrypt(text, shift) {
    return this._transform(text, shift, false);
  }

 
  _transform(text, shift, isEncrypt) {
    if (!TextValidator.isValidPayload(text)) return '';

    const cleanShift = this.validateKey(shift);
    if (cleanShift === 0) return text;

    const offset = isEncrypt ? cleanShift : -cleanShift;

    return text
      .split('')
      .map((char) => {
        const upper = char.toUpperCase();
        const index = this.alphabet.indexOf(upper);

        if (index === -1) return char;

        const newIndex = ((index + offset) % this.n + this.n) % this.n;
        const newChar = this.alphabet[newIndex];
        const isLower = char === char.toLowerCase() && char !== char.toUpperCase();

        return isLower ? newChar.toLowerCase() : newChar;
      })
      .join('');
  }
}