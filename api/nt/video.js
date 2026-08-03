addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Query parameters ko extract karo jo client se aayenge (e.g., ?fetch_media=...&course_id=...)
  const fetchMedia = url.searchParams.get('fetch_media');
  const courseId = url.searchParams.get('course_id');

  // Agar parameters nahi diye toh default ya error return kar sakte ho
  if (!fetchMedia || !courseId) {
    return new Response(JSON.stringify({ error: "Missing fetch_media or course_id parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  // Target URL ko dynamic bana diya
  const targetUrl = `https://studybeepro.site/api/api?fetch_media=${fetchMedia}&course_id=${courseId}`;
  
  const newHeaders = new Headers(request.headers);
  newHeaders.set("Host", "studybeepro.site");
  newHeaders.set("Referer", "https://studybeepro.site/");
  newHeaders.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
      redirect: "follow"
    });

    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });

    modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");
    modifiedResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    modifiedResponse.headers.set("Access-Control-Allow-Headers", "*");

    return modifiedResponse;
  } catch (err) {
    return new Response(JSON.stringify({ error: "Proxy failed", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
