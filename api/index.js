const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/video-url', async (req, res) => {
    try {
        const { batchId, subjectId, scheduleId, accessToken, refreshToken } = req.query;
        
        const response = await axios.get('https://rangexcoder-backend.onrender.com/api/get-video-url', {
            params: { batchId, subjectId, scheduleId, accessToken, refreshToken }
        });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/get-otp', async (req, res) => {
    try {
        const { kid, accessToken, refreshToken } = req.query;
        
        const response = await axios.get('https://rangexcoder-backend.onrender.com/api/get-otp', {
            params: { kid, accessToken, refreshToken }
        });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
