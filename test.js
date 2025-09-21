const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;

app.get('/api/data', async (req, res) => {
  const apiKey = process.env.YOUR_API_KEY; // Stored securely
  const apiEndpoint = `https://api.example.com/data?key=${apiKey}`;

  try {
    const response = await fetch(apiEndpoint);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});