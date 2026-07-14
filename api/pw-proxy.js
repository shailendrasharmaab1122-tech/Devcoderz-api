const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // req.url mein /api/pw-proxy/aHR0cHM.../master.mpd?Signature=... milega
    // Hume ise rangexcoder-backend se jodhna hai
    const targetBase = "https://rangexcoder-backend.onrender.com";
    const targetUrl = targetBase + req.url;

    try {
        const response = await axios.get(targetUrl, {
            responseType: 'arraybuffer',
            headers: {
                'Referer': 'https://brainboxinstitute.in/',
                'User-Agent': 'Mozilla/5.0'
            }
        });

        res.setHeader('Content-Type', response.headers['content-type']);
        res.status(200).send(Buffer.from(response.data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
