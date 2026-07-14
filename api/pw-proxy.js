const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // URL path ko nikaalein
    let fullPath = req.url.split('/api/pw-proxy/')[1];
    if (!fullPath) return res.status(400).json({ error: "Path missing" });

    try {
        // 1. Base64 aur Query params ko alag karein
        // URL format: BASE64_PART?Signature=...
        const parts = fullPath.split('?');
        const encodedBase = parts[0];
        const queryString = parts.slice(1).join('?'); // Baaki ke saare params

        // 2. Base64 decode karein
        let targetUrl = Buffer.from(encodedBase, 'base64').toString('utf-8');
        
        // 3. Agar query params hain, toh unhe wapas jodein
        if (queryString) {
            targetUrl += '?' + queryString;
        }

        // 4. Request bhejein
        const response = await axios.get(targetUrl, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        res.setHeader('Content-Type', response.headers['content-type']);
        res.send(Buffer.from(response.data));
    } catch (error) {
        // Error ko console mein log karein taaki pata chale ki exact link kya ban raha hai
        console.error("Target URL Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};
