import { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { CipherWheel } from './CipherWheel/CipherWheel.jsx';
import { caesarCipher } from '../../../utils/caesarCipher';
import { sanitizeText, normalizeShift } from '../../../utils/validators';
import { ALPHABETS } from '../../../utils/alphabets';
import styles from './TextCipher.module.css';

const MAX_WORDS = 7;

export const TextCipher = () => {
  const { t } = useLanguage();

  const [cipherLang, setCipherLang] = useState('UA');
  const [text, setText] = useState('');
  const [shift, setShift] = useState('');
  const [result, setResult] = useState('');

  const maxShift = ALPHABETS[cipherLang].length - 1;

  const handleCipherLangChange = (newLang) => {
    if (newLang === cipherLang) return;
    setCipherLang(newLang);
    setText((prev) => sanitizeText(prev, newLang, MAX_WORDS));
    setResult('');
    
    const maxNew = ALPHABETS[newLang].length - 1;
    if (shift !== '' && Number(shift) > maxNew) {
      setShift(maxNew);
    }
  };

  const handleEncrypt = () => {
    if (!text.trim()) return;
    const currentShift = shift === '' ? 0 : Number(shift);
    const encrypted = caesarCipher(text, currentShift, cipherLang, true);
    setResult(encrypted);
  };

  const handleDecrypt = () => {
    const currentShift = shift === '' ? 0 : Number(shift);
    
    const stringToDecrypt = result ? result : text;

    if (!stringToDecrypt.trim()) return;

    const decrypted = caesarCipher(stringToDecrypt, currentShift, cipherLang, false);
    setResult(decrypted);
  };

  return (
    <section id="text-cipher-section" className={styles.section}>
      <h2 className={styles.title}>{t.textCipher.title}</h2>

      <div className={styles.langToggle}>
        <button
          className={cipherLang === 'UA' ? styles.active : ''}
          onClick={() => handleCipherLangChange('UA')}
        >
          UA(33)
        </button>
        <button
          className={cipherLang === 'EN' ? styles.active : ''}
          onClick={() => handleCipherLangChange('EN')}
        >
          EN(26)
        </button>
      </div>

      <div className={styles.wheelWrapper}>
        <CipherWheel shift={shift === '' ? 0 : Number(shift)} language={cipherLang} />

        <div className={styles.controls}>
          <input
            type="text"
            placeholder={t.textCipher.inputPlaceholder}
            value={text}
            onChange={(e) => {
              setText(sanitizeText(e.target.value, cipherLang, MAX_WORDS));
              setResult(''); 
            }}
            autoComplete="off"
          />

          <input
            type="number"
            min="0"
            max={maxShift}
            placeholder={`${t.textCipher.shiftPlaceholder} (0–${maxShift})`}
            value={shift}
            onChange={(e) => {
              const val = e.target.value;
              setShift(val === '' ? '' : normalizeShift(val, cipherLang));
            }}
            onKeyDown={(e) => {
              if (['-', '+', 'e', 'E', '.', ','].includes(e.key)) {
                e.preventDefault();
              }
            }}
          />

          <div className={styles.btnGroup}>
            <button
              className={styles.btnPrimary}
              onClick={handleEncrypt}
              disabled={!text.trim()}
            >
              {t.textCipher.encryptBtn}
            </button>
            <button
              className={styles.btnSecondary}
              onClick={handleDecrypt}
              disabled={!text.trim() && !result.trim()}
            >
              {t.textCipher.decryptBtn}
            </button>
          </div>

          <div className={styles.result}>
            {result || t.textCipher.defaultResult}
          </div>
        </div>
      </div>
    </section>
  );
};