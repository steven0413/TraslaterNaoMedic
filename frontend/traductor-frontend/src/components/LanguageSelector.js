import React from 'react';

function LanguageSelector({ sourceLanguage, targetLanguage, onSourceLanguageChange, onTargetLanguageChange, languages }) {
  return (
    <div>
      <div>
        <label htmlFor="sourceLanguage">Select language origin:</label>
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
        <label htmlFor="targetLanguage">Select language to translate:</label>
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