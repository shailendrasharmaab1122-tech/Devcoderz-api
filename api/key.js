const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const { mpdUrl } = req.query;
        const response = await axios.get('https://rangexcoder-backend.onrender.com/apiserver/api/pw/kid', {
            params: { mpdUrl }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
