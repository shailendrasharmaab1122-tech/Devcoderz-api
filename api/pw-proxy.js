const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const targetBase = "https://rangexcoder-backend.onrender.com";
    const targetUrl = targetBase + req.url;

    try {
        const response = await axios.get(targetUrl, {
            responseType: 'arraybuffer'
        });

        res.setHeader('Content-Type', response.headers['content-type']);
        res.status(200).send(Buffer.from(response.data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
