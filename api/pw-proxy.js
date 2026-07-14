const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    const targetBase = "https://rangexcoder-backend.onrender.com";
    const fullTargetUrl = targetBase + req.url;

    try {
        const response = await axios.get(fullTargetUrl, {
            responseType: 'arraybuffer'
        });

        res.setHeader('Content-Type', response.headers['content-type']);
        res.status(200).send(Buffer.from(response.data));
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({ 
            error: error.message 
        });
    }
};
