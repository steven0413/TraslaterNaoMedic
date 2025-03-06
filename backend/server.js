const speech = require('@google-cloud/speech').v1p1beta1; 

// SDK de Google Cloud Speech-to-Text
const speechClient = new speech.SpeechClient({
    keyFilename: 'traslatenaomedical-6c6ec2ab1f7d.json', 
});


// Si ocurre un error durante la transcripción, se captura y se devuelve un error 500 con detalles.
app.post('/transcribe', async (req, res) => {
    console.log('[SERVER] languageCode from frontend:', req.body.sourceLanguage); 
    try {
       
        const audioBytes = req.body.audioData; 

        if (!audioBytes) {
            return res.status(400).json({ error: 'No se proporcionaron datos de audio.' });
        }

        const audio = {
            content: audioBytes, 
        };
        const config = {
            encoding: 'WEBM_OPUS', 
            sampleRateHertz: 48000, 
            languageCode: req.body.sourceLanguage, 
            model: 'medical_dictation', 
            useEnhanced: true, 
            
        };
        const request = {
            audio: audio,
            config: config,
        };

        console.log('[SERVER] Iniciando transcripción con Google Cloud Speech-to-Text API...');
        const [response] = await speechClient.recognize(request); 
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n'); 


        console.log('[SERVER] Transcripción exitosa:', transcription);
        res.json({ transcribedText: transcription }); 

    } catch (error) {
        console.error('[SERVER] Error en la transcripción con Google Cloud Speech-to-Text API:', error);
        res.status(500).json({ error: 'Error al transcribir el audio.', details: error.message });
    }
});




/*
ChatGTP
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = 5000;

const openai = new OpenAI({
});

app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
    const { text, targetLanguage } = req.body;

    // ... (validación como ya tienes) ...

    console.log(`[${new Date().toISOString()}] Petición de traducción recibida: Idioma destino: ${targetLanguage}, Texto original (inicio): ${text.substring(0, 50)}...`);

    console.time('OpenAI API Call Duration'); // Inicia el temporizador

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `Eres un traductor altamente especializado en textos del sector sanitario. Tu tarea es traducir el siguiente texto al idioma ${targetLanguage}. Es crucial mantener la precisión terminológica y el significado médico preciso.  El texto a traducir es:`,
                },
                {
                    role: 'user',
                    content: text,
                },
            ],
        });

        console.timeEnd('OpenAI API Call Duration'); // Detiene el temporizador y muestra el tiempo en la consola

        const translatedText = response.choices[0].message.content;
        console.log(`[${new Date().toISOString()}] Traducción exitosa: Idioma destino: ${targetLanguage}, Texto traducido (inicio): ${translatedText.substring(0, 50)}...`);
        res.json({ translatedText });

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error en la traducción:`, error);
        res.status(500).json({ error: 'Error en la traducción' });
    }
});

app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});*/



