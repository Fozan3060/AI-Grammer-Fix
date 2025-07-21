require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.post('/fix-grammar', async (req, res) => {
  const { text } = req.body;
  console.log('Received text:', text);
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `fix grammar: ${text}` }] }] }),
    });
    const result = await response.json();
    console.log('Gemini API result:', result);
    const fixedText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
    res.json({ fixedText });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fix grammar.' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001')); 