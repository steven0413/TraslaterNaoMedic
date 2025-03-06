import React from 'react';

function SpeakButton({ translatedText }) {
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      speechSynthesis.speak(utterance);
    } else {
      alert('La Text-to-Speech API no es soportada por tu navegador.');
    }
  };
}

export default SpeakButton;