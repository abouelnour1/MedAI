// src/api/gemini.js
import express from 'express';
import fetch from 'node-fetch'; // لو تستخدم Node.js
const router = express.Router();

router.post('/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch('https://api.gemini.com/v1/endpoint', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`, // المفتاح محفوظ على السيرفر
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
