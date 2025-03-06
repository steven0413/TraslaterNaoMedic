import VoiceInputButton from './components/VoiceInputButton';
import React, { useState, useEffect } from 'react';
import LanguageSelector from './components/LanguageSelector';
import TextAreas from './components/TextAreas';
import SpeakButton from './components/SpeakButton';
import './App.css'; 


function App() {
  const [sourceLanguage, setSourceLanguage] = useState('es','en','fr'); // Idioma de origen
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [languages] = useState(['es', 'en', 'fr']); // Lista de idiomas soportados

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
    if (originalText && targetLanguage) {
      translateText();
    } else {
      setTranslatedText(''); 
    }
  }, [originalText, targetLanguage]); 

  const translateText = async () => {
    try {
      const response = await fetch('http://localhost:5000/translate', { 
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
      setTranslatedText(data.translatedText); 
    } catch (error) {
      console.error("Error al traducir:", error);
      setTranslatedText('Error en la traducción. Por favor, intenta de nuevo.');
    }
  };

  const handleVoiceTranscription = (transcribedText) => {
    setOriginalText(transcribedText); 
  };

  return (
    <div className="App">
  <h1>NaoMedical Translator</h1>
  <LanguageSelector
    sourceLanguage={sourceLanguage}
    targetLanguage={targetLanguage}
    onSourceLanguageChange={handleSourceLanguageChange}
    onTargetLanguageChange={handleTargetLanguageChange}
    languages={languages}
  />
  <VoiceInputButton onTranscription={handleVoiceTranscription} sourceLanguage={sourceLanguage} /> {}

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