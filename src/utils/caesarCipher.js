import { CaesarCipher } from '../services/CaesarCipher';

export const caesarCipher = (text, shift, lang = 'UA', isEncrypt = true) => {
  const cipher = new CaesarCipher(lang);
  return isEncrypt ? cipher.encrypt(text, shift) : cipher.decrypt(text, shift);
};