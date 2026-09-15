import { describe, it, expect } from 'vitest';
import { TextValidator } from '../TextValidator';

describe('TextValidator Service', () => {
  describe('isValidPayload', () => {
    it('повертає true для непорожнього рядка', () => {
      expect(TextValidator.isValidPayload('Привіт')).toBe(true);
    });

    it('повертає false для порожнього рядка або пробілів', () => {
      expect(TextValidator.isValidPayload('')).toBe(false);
      expect(TextValidator.isValidPayload('   ')).toBe(false);
      expect(TextValidator.isValidPayload(null)).toBe(false);
    });
  });

  describe('normalizeShift', () => {
    it('видаляє нечислові символи', () => {
      expect(TextValidator.normalizeShift('abc12def', 'UA')).toBe(12);
    });

    it('обмежує максимальний зсув довжиною алфавіту мінус 1', () => {
      // UA: max 32
      expect(TextValidator.normalizeShift('50', 'UA')).toBe(32);
      // EN: max 25
      expect(TextValidator.normalizeShift('50', 'EN')).toBe(25);
    });

    it('повертає порожній рядок, якщо введення порожнє', () => {
      expect(TextValidator.normalizeShift('', 'UA')).toBe('');
    });
  });

  describe('sanitize', () => {
    it('видаляє символи чужого алфавіту для обраної мови', () => {
      // Англійські літери в українському тексті мають видалятися
      const input = 'Привіт world!';
      const sanitized = TextValidator.sanitize(input, 'UA');
      expect(sanitized).toBe('Привіт !');
    });

    it('дозволяє українські специфічні символи (і, ї, є, ґ, апостроф)', () => {
      const input = "м'яч, їжак, єнот, ґанок";
      expect(TextValidator.sanitize(input, 'UA')).toBe(input);
    });

    it('обмежує максимальну кількість слів', () => {
      const input = 'один два три чотири п’ять шість сім вісім дев’ять';
      const sanitized = TextValidator.sanitize(input, 'UA', 5);
      expect(sanitized).toBe('один два три чотири п’ять');
    });
  });
});