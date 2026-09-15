import { useLanguage } from '../../../context/LanguageContext';
import styles from './Header.module.css';
import logoImg from '/logo.svg'; 

export const Header = ({ onLogout }) => {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <header className={styles.header}>
      <img
        src={logoImg}
        alt="Caesar Cipher Online"
        className={styles.logo}
      />
      <nav className={styles.nav}>
        <button className={styles.langBtn} onClick={toggleLanguage}>
          {lang}
        </button>
        <button className={styles.logoutBtn} onClick={onLogout}>
          {t.header.logout}
        </button>
      </nav>
    </header>
  );
};