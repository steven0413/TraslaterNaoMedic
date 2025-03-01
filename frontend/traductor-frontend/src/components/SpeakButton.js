// src/components/SpeakButton.js
import React from 'react';

function SpeakButton({ translatedText }) {
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      // Puedes configurar propiedades del utterance como el idioma, volumen, velocidad, etc.
      // utterance.lang = 'es-ES'; // Ejemplo para español de España
      speechSynthesis.speak(utterance);
    } else {
      alert('La Text-to-Speech API no es soportada por tu navegador.');
    }
  };

  return (
    <button onClick={handleSpeak} disabled={!translatedText}>
      Hablar
    </button>
  );
}

export default SpeakButton;