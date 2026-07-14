const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Frontend se poora URL combine hoke aayega ya query params se
    // Yahan hum target URL construct kar rahe hain
    const targetBase = "https://rangexcoder-backend.onrender.com";
    const fullPath = req.url; // Isme path aur signature dono honge
    
    try {
        const response = await axios.get(targetBase + fullPath, {
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
