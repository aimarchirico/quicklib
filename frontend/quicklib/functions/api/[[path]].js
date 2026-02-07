/**
 * Cloudflare Pages Function - API Proxy
 * 
 * Proxies requests from /api/* to the backend API.
 * This allows the frontend to use /api as the base URL while
 * keeping the backend on a separate domain/tunnel.
 * 
 * Environment variables (set in Cloudflare Pages dashboard):
 * - API_URL: The backend URL
 */

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
