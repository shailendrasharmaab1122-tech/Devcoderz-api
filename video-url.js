const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { url, authToken, phpSessId } = req.query;

    if (!url) return res.status(400).json({ error: "URL missing" });

    try {
        const response = await axios.get(url, {
            headers: {
                'Cookie': phpSessId ? `PHPSESSID=${phpSessId}` : '',
                'Authorization': authToken || '',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        // Regex se m3u8 ya mpd link nikalna
        const match = response.data.match(/https?:\/\/[^\s"']+\.(mpd|m3u8)/);
        
        if (match) {
            return res.json({ url: match[0] });
        } else {
            return res.status(404).json({ error: "Stream link not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
