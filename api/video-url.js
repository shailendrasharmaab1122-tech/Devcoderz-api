const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const { batchId, subjectId, childId, videoId, accessToken, refreshToken } = req.query;
        const response = await axios.get('https://rangexcoder-backend.onrender.com/apiserver/api/pw/metpro', {
            params: { batchId, subjectId, childId, videoId, accessToken, refreshToken }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
