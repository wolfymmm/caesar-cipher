import { describe, it, expect } from 'vitest';
import { CaesarCipher } from '../CaesarCipher';

describe('CaesarCipher Service', () => {
  describe('UA Alphabet (33 chars)', () => {
    const cipherUA = new CaesarCipher('UA');

    it('коректно валідує та нормалізує ключ', () => {
      expect(cipherUA.validateKey(3)).toBe(3);
      expect(cipherUA.validateKey(36)).toBe(3); // 36 % 33 = 3
      expect(cipherUA.validateKey(-1)).toBe(32); // від'ємний зсув
      expect(cipherUA.validateKey('invalid')).toBe(0);
    });

    it('шифрує простий текст зі зсувом 3', () => {
      // А -> Г, Б -> Ґ, В -> Д
      expect(cipherUA.encrypt('АБВ', 3)).toBe('ГҐД');
    });

    it('зберігає регістр літер', () => {
  expect(cipherUA.encrypt('Привіт', 1)).toBe('Рсігїу');
});

    it('гарантує симетричне дешифрування (Encrypt -> Decrypt = Original)', () => {
      const originalText = 'Тестове Повідомлення 123! З літерою Ґ та Ї.';
      const shift = 7;

      const encrypted = cipherUA.encrypt(originalText, shift);
      const decrypted = cipherUA.decrypt(encrypted, shift);

      expect(decrypted).toBe(originalText);
    });

    it('не чіпає неалфавітні символи (цифри, пробіли, пунктуацію)', () => {
      const input = '123, !? — test';
      expect(cipherUA.encrypt(input, 5)).toBe(input);
    });
  });

  describe('EN Alphabet (26 chars)', () => {
    const cipherEN = new CaesarCipher('EN');

    it('шифрує англійський текст із циклічним переходом через кінець алфавіту', () => {
      // Z + 1 -> A, z + 3 -> c
      expect(cipherEN.encrypt('XYZ', 3)).toBe('ABC');
      expect(cipherEN.encrypt('xyz', 3)).toBe('abc');
    });

    it('симетрично розшифровує англійський текст', () => {
      const text = 'Hello World!';
      const encrypted = cipherEN.encrypt(text, 13); // ROT13
      const decrypted = cipherEN.decrypt(encrypted, 13);

      expect(decrypted).toBe(text);
    });
  });
});