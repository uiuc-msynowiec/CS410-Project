import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

import dotenv from "dotenv";
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const app = express();
app.use(cors());
app.use(express.json());


app.post('/api/openai', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful product recommendation assistant for Amazon shoppers who must return answers of 100 words or less.' },
          { role: 'user', content: query }
        ],
      }),
    });

    
    const data = await response.json();
    console.log("OpenAI full response:", data);
    res.json({ result: data.choices?.[0]?.message?.content || 'No response' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
