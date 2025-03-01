// src/components/TextAreas.js
import React from 'react';

function TextAreas({ originalText, translatedText, onTextChange }) {
  return (
    <div>
      <div>
        <label htmlFor="originalText">Texto Original:</label>
        <textarea
          id="originalText"
          value={originalText}
          onChange={onTextChange}
          placeholder="Escribe o pega aquí el texto a traducir..."
        />
      </div>
      <div>
        <label htmlFor="translatedText">Texto Traducido:</label>
        <div id="translatedText" className="translated-text-area">
          {translatedText}
        </div>
      </div>
    </div>
  );
}

export default TextAreas;