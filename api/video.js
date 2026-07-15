const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { batch_id, subject_id, video_id, video_type, title } = req.query;
    
    const vidcloudBase = "https://vidcloud.eu.org/play.php";
    const params = new URLSearchParams({ batch_id, subject_id, video_id, video_type, title });
    const targetUrl = `${vidcloudBase}?${params.toString()}`;
    
    const renderUrl = `https://rangexcoder-backend.onrender.com/api/test-scrape-vidcloud?url=${encodeURIComponent(targetUrl)}&authToken=&phpSessId=`;
    
    try {
        const response = await axios.get(renderUrl);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ error: "Proxy Failed", details: error.message });
    }
};
