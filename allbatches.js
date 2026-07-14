const axios = require('axios');
const CryptoJS = require('crypto-js');

export default async function handler(req, res) {
    const SECRET_KEY = "pwzone_super_secret_key_2026";
    try {
        const response = await axios.get('https://rangexcoder-backend.onrender.com/api/AllBatches?page=2');
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(response.data), SECRET_KEY).toString();
        res.status(200).json({ encryptedData });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch or encrypt data" });
    }
}