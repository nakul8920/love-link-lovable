/**
 * Vercel Routing Middleware: proxies /api/* and /uploads/* to Railway so the browser
 * never resolves *.up.railway.app (fixes ERR_NAME_NOT_RESOLVED on some ISPs/DNS).
 *
 * Vercel → Settings → Environment Variables:
 *   RAILWAY_API_BASE_URL = https://YOUR-SERVICE.up.railway.app  (no trailing slash)
 * Frontend: leave VITE_API_URL unset so API_BASE_URL is "" (same-origin).
 *
 * Edge runtime only (do not set runtime: "nodejs" — that can break middleware on Vercel).
 */
export const config = {
  matcher: ["/api/:path*", "/uploads/:path*"],
};

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

export default async function middleware(request: Request): Promise<Response> {
  const baseRaw = process.env.RAILWAY_API_BASE_URL?.trim();
  if (!baseRaw) {
    return new Response(
      JSON.stringify({
        message:
          "RAILWAY_API_BASE_URL is not set on Vercel. Add it (e.g. https://xxx.up.railway.app). Unset VITE_API_URL so the app uses /api on this domain.",
      }),
      { status: 503, headers: { "content-type": "application/json; charset=utf-8" } }
    );
  }

  const base = baseRaw.replace(/\/$/, "");
  if (!base.startsWith("http://") && !base.startsWith("https://")) {
    return new Response(
      JSON.stringify({ message: "RAILWAY_API_BASE_URL must start with https://" }),
      { status: 500, headers: { "content-type": "application/json; charset=utf-8" } }
    );
  }

  const src = new URL(request.url);
  const targetUrl = `${base}${src.pathname}${src.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (HOP_BY_HOP.has(k) || k === "host") return;
    headers.set(key, value);
  });

  // So Railway can rewrite /uploads URLs to the same host the user opened (e.g. Vercel),
  // not the raw *.up.railway.app host — fixes broken images & profile thumbnails after deploy.
  const incomingHost = request.headers.get("host") || src.host;
  const incomingProto = (src.protocol || "https:").replace(/:$/, "");
  headers.set("X-Forwarded-Host", incomingHost);
  headers.set("X-Forwarded-Proto", incomingProto);

  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";

  const init: RequestInit & { duplex?: string } = {
    method,
    headers,
    redirect: "manual",
  };

  if (hasBody && request.body) {
    init.body = request.body;
    init.duplex = "half";
  }

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, init);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({
        message:
          "Vercel could not reach your Railway backend. Check RAILWAY_API_BASE_URL and Railway deployment logs.",
        detail,
      }),
      { status: 502, headers: { "content-type": "application/json; charset=utf-8" } }
    );
  }

  const outHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return;
    outHeaders.set(key, value);
  });

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  });
}
