export async function handler(event) {
    const path = event.path.replace("/.netlify/functions/proxy", "");
    const target = "https://tanoracma.infinityfree.me/tanora-api/api" + path;
  
    const queryString = event.queryStringParameters
      ? "?" + new URLSearchParams(event.queryStringParameters).toString()
      : "";
  
    const isFormData = event.headers["content-type"]?.includes("multipart/form-data");
  
    try {
      const res = await fetch(target + queryString, {
        method: event.httpMethod,
        headers: isFormData
          ? {}
          : { "Content-Type": "application/json" },
        body: ["GET", "HEAD"].includes(event.httpMethod) ? undefined : event.body,
      });
  
      const contentType = res.headers.get("content-type") || "";
      const body = await res.text();
  
      return {
        statusCode: res.status,
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        },
        body,
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Proxy error: " + err.message }),
      };
    }
  }