// funciones React
import React, { useState, useRef, useCallback } from 'react';

// Componente funcional VoiceInputButton
function VoiceInputButton({ onTranscription, sourceLanguage }) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef(null); 
    const audioChunks = useRef([]); 
    const recognition = useRef(null); 
    const [useSpeechRecognition, setUseSpeechRecognition] = useState(false); 

    // Función para iniciar la grabación de audio con MediaRecorder
    const startRecordingWithMediaRecorder = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm; codecs=opus' });

            mediaRecorder.current.ondataavailable = event => {
                audioChunks.current.push(event.data); 
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm; codecs=opus' });
                audioChunks.current = []; 
                setIsRecording(false);

                
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Audio = reader.result.split(',')[1]; 
                    sendAudioToBackend(base64Audio); 
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
    }, [onTranscription]); 


    const startRecordingWithSpeechRecognition = useCallback(() => {
        recognition.current = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
        recognition.current.continuous = false; 
        recognition.current.interimResults = false; 
        recognition.current.lang = 'es-ES'; 

        recognition.current.onstart = () => {
            setIsRecording(true);
            console.log('Grabación iniciada con SpeechRecognition.');
        };

        recognition.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setIsRecording(false);
            onTranscription(transcript); 
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


    }, [onTranscription]); 

    const stopRecordingWithMediaRecorder = useCallback(() => {
        if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
            mediaRecorder.current.stop(); 
            console.log('Grabación detenida con MediaRecorder.');
        }
    }, []);

    const stopRecordingWithSpeechRecognition = useCallback(() => {
        if (recognition.current) {
            recognition.current.stop(); 
            setIsRecording(false);
            console.log('Grabación detenida con SpeechRecognition.');
        }
    }, []);


    const sendAudioToBackend = async (base64Audio) => {
        try {
            const response = await fetch('http://localhost:5000/transcribe', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ audioData: base64Audio, sourceLanguage: sourceLanguage })
            });

            if (!response.ok) {
                throw new Error(`Error del backend al transcribir audio: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            onTranscription(data.transcribedText); 
            console.log('Transcripción recibida del backend:', data.transcribedText);


        } catch (error) {
            console.error('Error al enviar audio al backend para transcripción:', error);
            alert('Marca campo requerido SpeechRecognition API');
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
        setIsRecording(false); 
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
                {isRecording ? 'Detener Grabación' : 'Hablar'}
            </button>

             <label>
                Usar SpeechRecognition API:
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