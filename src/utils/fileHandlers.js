import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const extractTextFromFile = async (file) => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'txt':
    case 'html':
    case 'htm': {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });
    }

    case 'docx': {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }

    case 'pdf': {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageString = textContent.items.map((item) => item.str).join(' ');
        fullText += pageString + '\n';
      }
      return fullText.trim();
    }

    default:
      throw new Error(`Формат .${extension} не підтримується для читання.`);
  }
};

export const exportDocument = async (text, baseName, targetFormat) => {
  const filename = `${baseName}_processed.${targetFormat}`;

  switch (targetFormat) {
    case 'txt': {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      triggerDownload(blob, filename);
      break;
    }

    case 'html': {
      const htmlContent = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>${baseName}</title>
  <style>
    body { font-family: sans-serif; white-space: pre-wrap; padding: 24px; line-height: 1.6; }
  </style>
</head>
<body>${text}</body>
</html>`;
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      triggerDownload(blob, filename);
      break;
    }

    case 'docx': {
      const paragraphs = text.split('\n').map(
        (line) =>
          new Paragraph({
            children: [new TextRun({ text: line, font: 'Arial', size: 24 })],
          })
      );

      const doc = new Document({
        sections: [{ properties: {}, children: paragraphs }],
      });

      const blob = await Packer.toBlob(doc);
      triggerDownload(blob, filename);
      break;
    }

    default:
      throw new Error(`Формат ${targetFormat} не підтримується для експорту.`);
  }
};

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};