import './styles/global.css';
import styles from './App.module.css';
import { Header } from './components/layout/Header/Header';
import { Footer } from './components/layout/Footer/Footer';
import { Hero } from './components/sections/Hero/Hero';
import { TextCipher } from './components/sections/TextCipher/TextCipher';
import { DocumentCipher } from './components/sections/DocumentCipher/DocumentCipher';
import { LanguageProvider } from './context/LanguageContext';

export const App = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <LanguageProvider>
      <div>
        {/* Спільна верхня секція з фоновою статуєю */}
        <div className={styles.mainScreen}>
          <Header onLogout={() => alert('Вихід із системи')} />
          <Hero
            onScrollToText={() => scrollTo('text-cipher-section')}
            onScrollToDocument={() => scrollTo('document-cipher-section')}
          />
        </div>

        <main>
          <TextCipher />
          <DocumentCipher />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default App;