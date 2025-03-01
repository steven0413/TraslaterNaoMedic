// src/App.js
import VoiceInputButton from './components/VoiceInputButton';
import React, { useState, useEffect } from 'react';
import LanguageSelector from './components/LanguageSelector';
import TextAreas from './components/TextAreas';
import SpeakButton from './components/SpeakButton';
import './App.css'; // Importa el CSS para estilos


function App() {
  const [sourceLanguage, setSourceLanguage] = useState('es'); // Idioma de origen inicial (español)
  const [targetLanguage, setTargetLanguage] = useState('en'); // Idioma de destino inicial (inglés)
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [languages, setLanguages] = useState(['es', 'en', 'fr', 'de']); // Lista de idiomas soportados

  const handleSourceLanguageChange = (event) => {
    setSourceLanguage(event.target.value);
  };

  const handleTargetLanguageChange = (event) => {
    setTargetLanguage(event.target.value);
  };

  const handleTextChange = (event) => {
    setOriginalText(event.target.value);
  };

  useEffect(() => {
    // Realizar la traducción cuando cambia el texto original o el idioma de destino
    if (originalText && targetLanguage) {
      translateText();
    } else {
      setTranslatedText(''); // Limpiar la traducción si no hay texto o idioma de destino
    }
  }, [originalText, targetLanguage]); // Dependencias del useEffect

  const translateText = async () => {
    try {
      const response = await fetch('http://localhost:5000/translate', { // Reemplaza con la URL de tu backend si es diferente
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: originalText,
          targetLanguage: targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la traducción: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setTranslatedText(data.translatedText); // Asume que el backend devuelve la traducción directamente como texto
    } catch (error) {
      console.error("Error al traducir:", error);
      setTranslatedText('Error en la traducción. Por favor, intenta de nuevo.');
    }
  };

  const handleVoiceTranscription = (transcribedText) => {
    setOriginalText(transcribedText); // Actualizar el área de texto original con la transcripción
  };

  return (
    <div className="App">
  <h1>Traductor Nao Medical con IA</h1>
  <LanguageSelector
    sourceLanguage={sourceLanguage}
    targetLanguage={targetLanguage}
    onSourceLanguageChange={handleSourceLanguageChange}
    onTargetLanguageChange={handleTargetLanguageChange}
    languages={languages}
  />
  <VoiceInputButton onTranscription={handleVoiceTranscription} /> {/* ¡Añadido VoiceInputButton aquí! */}

  <TextAreas
    originalText={originalText}
    translatedText={translatedText}
    onTextChange={handleTextChange}
  />
  <SpeakButton translatedText={translatedText} />
</div>
  );
}

export default App;