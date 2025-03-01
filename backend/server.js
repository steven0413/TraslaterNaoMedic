const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = 5000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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
});