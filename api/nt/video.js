export default async function handler(req, res) {
  const { fetch_media, course_id } = req.query;

  if (!fetch_media || !course_id) {
    return res.status(400).json({ error: "Missing fetch_media or course_id parameters" });
  }

  const targetUrl = `https://studybeepro.site/api/api?fetch_media=${fetch_media}&course_id=${course_id}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Host": "studybeepro.site",
        "Referer": "https://studybeepro.site/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      redirect: "follow"
    });

    const data = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");

    return res.status(response.status).send(data);
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}
