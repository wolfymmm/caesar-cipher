import { TextValidator } from '../services/TextValidator';

export const sanitizeText = (input, lang, maxWords) =>
  TextValidator.sanitize(input, lang, maxWords);

export const normalizeShift = (rawValue, lang) =>
  TextValidator.normalizeShift(rawValue, lang);