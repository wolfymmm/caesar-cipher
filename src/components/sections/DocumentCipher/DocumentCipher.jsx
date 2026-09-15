import { useState, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { caesarCipher } from '../../../utils/caesarCipher';
import { extractTextFromFile, exportDocument } from '../../../utils/fileHandlers';
import { normalizeShift } from '../../../utils/validators';
import { ALPHABETS } from '../../../utils/alphabets';
import styles from './DocumentCipher.module.css';

const EXPORT_FORMATS = ['txt', 'docx', 'html'];
const ACCEPT_FILES = '.txt,.html,.htm,.pdf,.docx';

export const DocumentCipher = () => {
  const { t } = useLanguage();

  const [docCipherLang, setDocCipherLang] = useState('UA');
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [processedContent, setProcessedContent] = useState('');
  const [shift, setShift] = useState(''); 
  const [exportFormat, setExportFormat] = useState('txt');
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  
  const maxShift = ALPHABETS[docCipherLang].length - 1;

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setIsLoading(true);
    setFile(uploadedFile);

    const ext = uploadedFile.name.split('.').pop()?.toLowerCase();
    if (EXPORT_FORMATS.includes(ext)) {
      setExportFormat(ext);
    } else {
      setExportFormat('txt');
    }

    try {
      const text = await extractTextFromFile(uploadedFile);
      setFileContent(text);
      setProcessedContent(text); 
    } catch (err) {
      alert(err.message);
      handleDeleteFile();
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessFile = (isEncrypt) => {
    const sourceText = processedContent || fileContent;
    if (!sourceText) return;

    const currentShift = shift === '' ? 0 : Number(shift);
    const output = caesarCipher(sourceText, currentShift, docCipherLang, isEncrypt);
    
    setProcessedContent(output);
  };

  const handleDeleteFile = () => {
    setFile(null);
    setFileContent('');
    setProcessedContent('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="document-cipher-section" className={styles.section}>
      <h2 className={styles.title}>{t.documentCipher.title}</h2>

      <div className={styles.grid}>
        <div className={`${styles.viewer} ${!processedContent ? styles.viewerPlaceholder : ''}`}>
          {isLoading ? t.documentCipher.loading : processedContent || t.documentCipher.placeholder}
        </div>

        <div className={styles.panel}>
          <div className={styles.fileStatus}>
            {t.documentCipher.selectedFile}{' '}
            <span className={styles.filename}>
              {file ? file.name : t.documentCipher.noFile}
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept={ACCEPT_FILES}
            style={{ display: 'none' }}
          />

          <div className={styles.controlRow}>
            {!file ? (
              <button
                className={styles.btnPrimary}
                onClick={() => fileInputRef.current.click()}
              >
                {t.documentCipher.chooseBtn}
              </button>
            ) : (
              <>
                <button
                  className={styles.btn}
                  onClick={() => fileInputRef.current.click()}
                  disabled={isLoading}
                >
                  {t.documentCipher.changeBtn}
                </button>
                <button
                  className={styles.btn}
                  onClick={handleDeleteFile}
                  disabled={isLoading}
                >
                  {t.documentCipher.deleteBtn}
                </button>
              </>
            )}
          </div>

          <div className={styles.controlRow}>
            <select
              value={docCipherLang}
              onChange={(e) => {
                const newLang = e.target.value;
                setDocCipherLang(newLang);
                
                const maxNewShift = ALPHABETS[newLang].length - 1;
                if (shift !== '' && Number(shift) > maxNewShift) {
                  setShift(maxNewShift);
                }
              }}
            >
              <option value="UA">UA</option>
              <option value="EN">EN</option>
            </select>
            <input
              type="number"
              min="0"
              max={maxShift}
              placeholder={`${t.documentCipher.shiftPlaceholder} (0–${maxShift})`}
              value={shift}
              onChange={(e) => {
                const val = e.target.value;
                setShift(val === '' ? '' : normalizeShift(val, docCipherLang));
              }}
              onKeyDown={(e) => {
                if (['-', '+', 'e', 'E', '.', ','].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </div>

          <div className={styles.controlRow}>
            <button
              className={styles.btnPrimary}
              onClick={() => handleProcessFile(true)}
              disabled={!processedContent || isLoading}
            >
              {t.documentCipher.encryptBtn}
            </button>
            <button
              className={styles.btn}
              onClick={() => handleProcessFile(false)}
              disabled={!processedContent || isLoading}
            >
              {t.documentCipher.decryptBtn}
            </button>
          </div>

          <div className={styles.controlRow}>
            <button
              className={styles.btn}
              onClick={() => {
                const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'document';
                exportDocument(processedContent, baseName, exportFormat);
              }}
              disabled={!processedContent || isLoading}
            >
              {t.documentCipher.downloadBtn}
            </button>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              disabled={isLoading}
            >
              {EXPORT_FORMATS.map((ext) => (
                <option key={ext} value={ext}>
                  {ext}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};