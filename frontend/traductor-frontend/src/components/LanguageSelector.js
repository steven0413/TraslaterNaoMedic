// src/components/LanguageSelector.js
import React from 'react';

function LanguageSelector({ sourceLanguage, targetLanguage, onSourceLanguageChange, onTargetLanguageChange, languages }) {
  return (
    <div>
      <div>
        <label htmlFor="sourceLanguage">Idioma de Origen:</label>
        <select
          id="sourceLanguage"
          value={sourceLanguage}
          onChange={onSourceLanguageChange}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="targetLanguage">Idioma de Destino:</label>
        <select
          id="targetLanguage"
          value={targetLanguage}
          onChange={onTargetLanguageChange}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default LanguageSelector;