export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).send("URL parameter is missing");

    try {
        const targetUrl = `https://rangexcoder-backend.onrender.com/apiserver/api/pi/play?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
        
        res.status(response.status).send(buffer);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}
