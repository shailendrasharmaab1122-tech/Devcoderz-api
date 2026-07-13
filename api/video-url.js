const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Check karein ki query parameters null to nahi aa rahe
    const { batch_id, subject_id, video_id, video_type, title } = req.query;
    
    if (!batch_id || !video_id) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    const vidcloudBase = "https://vidcloud.eu.org/play.php";
    const params = new URLSearchParams({ batch_id, subject_id, video_id, video_type, title });
    const targetUrl = `${vidcloudBase}?${params.toString()}`;
    
    const renderUrl = `https://rangexcoder-backend.onrender.com/api/test-scrape-vidcloud?url=${encodeURIComponent(targetUrl)}&authToken=&phpSessId=`;
    
    try {
        const response = await axios.get(renderUrl);
        return res.json(response.data);
    } catch (error) {
        // Error ko response mein bhejein taaki crash ka reason pata chale
        return res.status(500).json({ error: error.message, stack: error.stack });
    }
};
