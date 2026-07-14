const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // URL ko query param se lein
    const path = req.query.path; 
    const targetBase = "https://rangexcoder-backend.onrender.com";
    
    if (!path) return res.status(400).json({ error: "Path missing" });

    try {
        const response = await axios.get(targetBase + path, {
            responseType: 'arraybuffer'
        });

        res.setHeader('Content-Type', response.headers['content-type']);
        res.status(200).send(Buffer.from(response.data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
