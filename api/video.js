const express = require('express');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/video', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ success: false, error: "URL parameter is missing!" });
    }

    let browser;
    try {
        // Optimized for Render and cloud hosting environments
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

        let extractedData = {
            success: false,
            manifestUrl: null,
            clearKeys: null,
            schedule: "Could not get user details!"
        };

        const intercepted = {
            manifestUrl: null,
            keys: null
        };

        page.on('request', (request) => {
            const reqUrl = request.url();
            if (reqUrl.includes('.mpd') || reqUrl.includes('.m3u8')) {
                intercepted.manifestUrl = reqUrl;
            }
        });

        page.on('response', async (response) => {
            const resUrl = response.url();
            try {
                if (resUrl.includes('.mpd') || resUrl.includes('/license') || resUrl.includes('/keys') || resUrl.includes('api/v1/')) {
                    const text = await response.text();
                    try {
                        const json = JSON.parse(text);
                        if (json.keys || json.clearkeys || json.key || json.clearKeys) {
                            intercepted.keys = json.keys || json.clearkeys || json.key || json.clearKeys;
                        } else if (json.data && (json.data.keys || json.data.clearKeys)) {
                            intercepted.keys = json.data.keys || json.data.clearKeys;
                        }
                    } catch (e) {}
                }
            } catch (e) {}
        });

        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 50000 });

        try {
            await page.waitForSelector('video, iframe, .jw-video, .shaka-video-container', { timeout: 10000 });
        } catch (e) {}

        await page.evaluate(async () => {
            const clickElements = document.querySelectorAll('button, video, .vjs-big-play-button, .jw-icon-playback');
            clickElements.forEach(el => {
                try { el.click(); } catch (e) {}
            });

            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 200;
                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= document.body.scrollHeight || totalHeight > 1500) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        await new Promise(resolve => setTimeout(resolve, 4000));

        const dynamicData = await page.evaluate(() => {
            let keysFound = null;
            let manifestFound = null;

            try {
                if (window.shaka && window.shaka.Player) {
                    const videoElements = document.querySelectorAll('video');
                    videoElements.forEach(video => {
                        if (video && video.src && (video.src.includes('.mpd') || video.src.includes('.m3u8'))) {
                            manifestFound = video.src;
                        }
                    });
                }

                if (window.playerConfig) {
                    keysFound = window.playerConfig.keys || window.playerConfig.clearKeys || window.playerConfig.drmKeys;
                }
                if (!keysFound && window.shakaPlayerInstance) {
                    keysFound = window.shakaPlayerInstance.keySystems;
                }
                if (!keysFound && window.getConfig) {
                    const conf = window.getConfig();
                    keysFound = conf.keys || conf.clearKeys;
                }

                for (let key in window) {
                    try {
                        if (window[key] && typeof window[key] === 'object') {
                            if (window[key].keys || window[key].clearKeys) {
                                keysFound = window[key].keys || window[key].clearKeys;
                                break;
                            }
                        }
                    } catch (e) {}
                }
            } catch (e) {}

            return {
                manifest: manifestFound,
                keys: keysFound
            };
        });

        if (intercepted.manifestUrl) {
            extractedData.manifestUrl = intercepted.manifestUrl;
        } else if (dynamicData.manifest) {
            extractedData.manifestUrl = dynamicData.manifest;
        }

        if (extractedData.manifestUrl) {
            extractedData.success = true;
        }

        if (dynamicData.keys) {
            extractedData.clearKeys = dynamicData.keys;
        } else if (intercepted.keys) {
            extractedData.clearKeys = intercepted.keys;
        } else {
            extractedData.clearKeys = null;
        }

        await browser.close();
        return res.json(extractedData);

    } catch (error) {
        if (browser) await browser.close();
        return res.status(500).json({ 
            success: false, 
            error: error.message,
            schedule: "Could not get user details!"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {});
