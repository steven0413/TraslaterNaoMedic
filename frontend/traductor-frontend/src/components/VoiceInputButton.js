// src/components/VoiceInputButton.js
import React, { useState, useRef, useCallback } from 'react';
import VoiceInputButton from './components/VoiceInputButton';


function VoiceInputButton({ onTranscription }) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef(null); // Usamos useRef para mantener el mediaRecorder entre renders
    const audioChunks = useRef([]); // useRef para los chunks de audio
    const recognition = useRef(null); // Para SpeechRecognition (alternativa, menos control sobre el audio)
    const [useSpeechRecognition, setUseSpeechRecognition] = useState(false); // Decide si usar MediaRecorder o SpeechRecognition

    const startRecordingWithMediaRecorder = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' }); // WEBM_OPUS para compatibilidad con Google Cloud Speech-to-Text

            mediaRecorder.current.ondataavailable = event => {
                audioChunks.current.push(event.data); // Almacenar los chunks de audio
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm; codecs=opus' });
                audioChunks.current = []; // Limpiar chunks para la próxima grabación
                setIsRecording(false);

                // Convertir Blob a Base64 para enviar al backend (puedes explorar otras opciones como ArrayBuffer si es más eficiente)
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Audio = reader.result.split(',')[1]; // Extraer la parte base64 después de 'data:audio/webm; codecs=opus;base64,'
                    sendAudioToBackend(base64Audio); // Enviar audio base64 al backend
                };
                reader.readAsDataURL(audioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            console.log('Grabación iniciada con MediaRecorder.');

        } catch (err) {
            console.error('Error al iniciar la grabación de audio con MediaRecorder:', err);
            alert('Error al iniciar la grabación de audio. Asegúrate de dar permisos de micrófono y que tu navegador soporta MediaRecorder.');
            setIsRecording(false);
        }
    }, [onTranscription]); // 'onTranscription' como dependencia de useCallback


    const startRecordingWithSpeechRecognition = useCallback(() => {
        recognition.current = new window.webkitSpeechRecognition() || new window.SpeechRecognition(); // Compatibilidad con Chrome y otros navegadores
        recognition.current.continuous = false; // Transcripción de una sola "frase"
        recognition.current.interimResults = false; // No mostrar resultados intermedios (puedes cambiar a true para feedback en tiempo real)
        recognition.current.lang = 'es-ES'; // Idioma por defecto, pero deberías permitir que el usuario lo configure.  Usa el prop 'sourceLanguage' del LanguageSelector.

        recognition.current.onstart = () => {
            setIsRecording(true);
            console.log('Grabación iniciada con SpeechRecognition.');
        };

        recognition.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setIsRecording(false);
            onTranscription(transcript); // Enviar transcripción al componente App a través del prop 'onTranscription'
            console.log('Transcripción de SpeechRecognition:', transcript);
        };


        recognition.current.onerror = (event) => {
            console.error('Error en SpeechRecognition:', event.error);
            alert('Error en el reconocimiento de voz. Asegúrate de dar permisos de micrófono y que tu navegador soporta SpeechRecognition.');
            setIsRecording(false);
        };

        recognition.current.onend = () => {
            setIsRecording(false);
            console.log('Grabación finalizada con SpeechRecognition.');
        };


        recognition.current.start();


    }, [onTranscription]); // 'onTranscription' como dependencia de useCallback

    const stopRecordingWithMediaRecorder = useCallback(() => {
        if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
            mediaRecorder.current.stop(); // Detener MediaRecorder, el evento 'onstop' se encargará de enviar al backend
            console.log('Grabación detenida con MediaRecorder.');
        }
    }, []);

    const stopRecordingWithSpeechRecognition = useCallback(() => {
        if (recognition.current) {
            recognition.current.stop(); // Detener SpeechRecognition, el evento 'onresult' se encargará de la transcripción
            setIsRecording(false);
            console.log('Grabación detenida con SpeechRecognition.');
        }
    }, []);


    const sendAudioToBackend = async (base64Audio) => {
        try {
            const response = await fetch('http://localhost:5000/transcribe', { // Ajusta la URL si tu backend está en otro lugar
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ audioData: base64Audio, sourceLanguage: 'es-ES' }) // Envía audio base64 y el idioma (puedes obtener el idioma seleccionado por el usuario desde App.js si lo pasas como prop)
            });

            if (!response.ok) {
                throw new Error(`Error del backend al transcribir audio: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            onTranscription(data.transcribedText); // Enviar texto transcrito al componente App a través del prop 'onTranscription'
            console.log('Transcripción recibida del backend:', data.transcribedText);


        } catch (error) {
            console.error('Error al enviar audio al backend para transcripción:', error);
            alert('Error al enviar audio al backend para transcripción. Intenta de nuevo.');
        }
    };


    const handleRecordButtonClick = () => {
        if (!isRecording) {
            if (useSpeechRecognition) {
                startRecordingWithSpeechRecognition();
            } else {
                startRecordingWithMediaRecorder();
            }

        } else {
            if (useSpeechRecognition) {
                stopRecordingWithSpeechRecognition();
            } else {
                stopRecordingWithMediaRecorder();
            }
        }
    };


    const handleToggleUseSpeechRecognition = () => {
        setUseSpeechRecognition(!useSpeechRecognition);
        setIsRecording(false); // Detener cualquier grabación activa al cambiar de método
        if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
            stopRecordingWithMediaRecorder();
        }
        if (recognition.current) {
            stopRecordingWithSpeechRecognition();
        }
    };


    return (
        <div>
            <button onClick={handleRecordButtonClick}>
                {isRecording ? 'Detener Grabación' : 'Iniciar Grabación'}
            </button>

             <label>
                Usar SpeechRecognition API (Navegador, más simple, menos control):
                <input
                    type="checkbox"
                    checked={useSpeechRecognition}
                    onChange={handleToggleUseSpeechRecognition}
                />
            </label>


        </div>
    );
}

export default VoiceInputButton;