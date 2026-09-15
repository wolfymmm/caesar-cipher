import { ALPHABETS } from '../../../../utils/alphabets';
import { useLanguage } from '../../../../context/LanguageContext';
import styles from './CipherWheel.module.css';

export const CipherWheel = ({ shift, language }) => {
  const { lang: contextLang } = useLanguage();
  const currentLang = language || contextLang || 'UA';

  const alphabet = ALPHABETS[currentLang] || ALPHABETS.UA;
  const step = 360 / alphabet.length;
  const rotationAngle = (Number(shift) || 0) * step;

  return (
    <div className={styles.wheel}>
      <div className={styles.outer}>
        {alphabet.split('').map((char, index) => (
          <span
            key={`outer-${char}-${index}`}
            className={styles.char}
            style={{
              transform: `translate(-50%, -50%) rotate(${index * step}deg) translateY(-205px)`,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      <div
        className={styles.inner}
        style={{ transform: `rotate(${rotationAngle}deg)` }}
      >
        {alphabet.split('').map((char, index) => (
          <span
            key={`inner-${char}-${index}`}
            className={styles.char}
            style={{
              transform: `translate(-50%, -50%) rotate(${index * step}deg) translateY(-148px)`,
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};