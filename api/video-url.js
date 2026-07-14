const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/combine-data', async (req, res) => {
    try {
        const { kid, batchId, subjectId, childId, videoId, accessToken, refreshToken } = req.query;

        const otpRes = await axios.get('https://rangexcoder-backend.onrender.com/api/get-otp', {
            params: { kid, accessToken, refreshToken }
        });

        const videoRes = await axios.get('https://rangexcoder-backend.onrender.com/api/get-video-url', {
            params: { batchId, subjectId, childId, videoId, accessToken, refreshToken }
        });

        res.json({
            success: true,
            otpData: otpRes.data,
            videoData: videoRes.data
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.response?.data || error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
