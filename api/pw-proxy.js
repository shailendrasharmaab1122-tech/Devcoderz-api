const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Path mein se "aHR0..." wala part nikaalein
    let fullPath = req.url.split('/api/pw-proxy/')[1];
    if (!fullPath) return res.status(400).json({ error: "Path missing" });

    // Isme query params (Signature) bhi ho sakte hain
    const [encodedBase, queryString] = fullPath.split('?');

    try {
        // Base64 decode karein
        const targetUrl = Buffer.from(encodedBase, 'base64').toString('utf-8') + (queryString ? '?' + queryString : '');

        // Yahan 'targetBase' ki zaroorat nahi hai, kyunki targetUrl mein poora link hai
        const response = await axios.get(targetUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        res.setHeader('Content-Type', response.headers['content-type']);
        res.send(Buffer.from(response.data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
