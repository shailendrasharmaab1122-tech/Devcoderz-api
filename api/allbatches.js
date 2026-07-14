const CryptoJS = require('crypto-js');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    const SECRET_KEY = "pwzone_super_secret_key_2026";

    try {
        const response = await fetch("https://rangexcoder-backend.onrender.com/api/AllBatches?page=2");
        if (!response.ok) throw new Error("Core database array unreachable.");
        const data = await response.json();
        
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
        
        return res.status(200).json({ encryptedData });
    } catch (error) {
        return res.status(500).json({ error: "Failed to load proxy stream engine data." });
    }
}
