import { useLanguage } from '../../../context/LanguageContext';
import styles from './Hero.module.css';

export const Hero = ({ onScrollToText, onScrollToDocument }) => {
  const { t } = useLanguage();

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t.hero.title}</h1>
        <p className={styles.subtitle}>{t.hero.subtitle}</p>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={onScrollToText}>
            {t.hero.btnText}
          </button>
          <button className={styles.btn} onClick={onScrollToDocument}>
            {t.hero.btnDoc}
          </button>
        </div>
      </div>
    </section>
  );
};