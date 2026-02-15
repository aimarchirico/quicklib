export async function onRequest(context) {
  const apiUrl = context.env.API_URL;
  
  if (!apiUrl) {
    return new Response('API_URL environment variable not configured', { status: 500 });
  }

  const url = new URL(context.request.url);
  
  // Remove /api prefix - the API_URL already contains the base path (e.g., /quicklib)
  const apiPath = url.pathname.replace(/^\/api/, '');
  const backendUrl = `${apiUrl}${apiPath}${url.search}`;

  // Clone headers but remove host (will be set by fetch)
  const headers = new Headers(context.request.headers);
  headers.delete('host');

  headers.set('X-Forwarded-Prefix', '/api');
  headers.set('X-Forwarded-Host', url.host);
  headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''));
  headers.set('X-Proxy-Secret', context.env.PROXY_SECRET);

  // Forward the request to the backend
  const response = await fetch(backendUrl, {
    method: context.request.method,
    headers: headers,
    body: context.request.body,
  });

  // Return the response
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
