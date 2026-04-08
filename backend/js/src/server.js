import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

app.use(cors());
app.use(express.json());
app.use(express.static(frontendDistPath));

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'gemma4:31b-cloud';

const analyzeWithOllama = async (text) => {
  const prompt = `You are a scam detection AI. Analyze the following text and determine if it's a scam or not.

Respond with ONLY a JSON object in this exact format:
{"is_scam": true/false, "confidence": 0-100, "reason": "brief explanation", "red_flags": ["flag1", "flag2"]}

Text to analyze: "${text}"`;

  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const data = await response.json();
  const output = data.response || '';

  try {
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    // fall through
  }

  return {
    is_scam: false,
    confidence: 50,
    reason: 'Could not parse response',
    red_flags: [],
  };
};

app.post('/api/detect', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const result = await analyzeWithOllama(text);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
