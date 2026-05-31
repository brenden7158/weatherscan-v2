/**
 * Weatherscan V2 - Bun native server
 * Fast, lightweight static file server + API proxies
 * No external dependencies required.
 */

const PORT = 3000;
const STATIC_DIR = "./main";

// Simple proxy helper: forwards the request tail to the upstream base URL
async function proxyTo(upstreamBase, req) {
  const url = new URL(req.url);
  // Strip the mount prefix (e.g. /surf, /cwf) to get the resource path + query
  const mount = url.pathname.match(/^\/(surf|coastalwaters|cwf)/)?.[0] ?? "";
  const tail = url.pathname.slice(mount.length) + url.search;

  const target = upstreamBase.replace(/\/$/, "") + tail;

  const upstream = await fetch(target, {
    method: req.method,
    headers: filterHeaders(req.headers),
    // body only for non-GET (none of our proxies need POST/PUT currently)
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer(),
  });

  // Replicate useful response headers
  const headers = new Headers();
  upstream.headers.forEach((value, key) => {
    // Skip hop-by-hop headers
    if (!["connection", "keep-alive", "transfer-encoding", "upgrade"].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

function filterHeaders(headers) {
  const out = new Headers();
  headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (["host", "connection", "content-length", "upgrade", "http2-settings"].includes(lower)) return;
    out.set(key, value);
  });
  return out;
}

async function serveStatic(pathname) {
  // Normalize root to index.html
  let filePath = pathname === "/" || pathname === "" ? "/index.html" : pathname;

  // Prevent path traversal
  if (filePath.includes("..")) {
    return new Response("Forbidden", { status: 403 });
  }

  const file = Bun.file(`${STATIC_DIR}${filePath}`);

  if (await file.exists()) {
    return new Response(file);
  }

  // Try adding .html for clean URLs (optional nicety)
  if (!filePath.includes(".")) {
    const htmlFile = Bun.file(`${STATIC_DIR}${filePath}.html`);
    if (await htmlFile.exists()) {
      return new Response(htmlFile);
    }
  }

  return null;
}

const server = Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    const { pathname } = url;

    // --- API Proxies (must come before static) ---

    // Airport status (FAA)
    if (pathname === "/airports" || pathname.startsWith("/airports?")) {
      try {
        const upstream = await fetch("https://nasstatus.faa.gov/api/airport-events");
        const data = await upstream.json();
        return Response.json(data, {
          headers: { "Cache-Control": "no-store" },
        });
      } catch (err) {
        return Response.json({ error: "Failed to fetch airport data" }, { status: 502 });
      }
    }

    // Surf reports (NDBC text files)
    if (pathname.startsWith("/surf/")) {
      try {
        return await proxyTo("https://www.ndbc.noaa.gov/data/latest_obs", req);
      } catch (err) {
        return new Response("Surf proxy error", { status: 502 });
      }
    }

    // Coastal waters forecast locations (NWS)
    if (pathname.startsWith("/coastalwaters/")) {
      try {
        return await proxyTo("https://api.weather.gov/products/types/CWF/locations", req);
      } catch (err) {
        return new Response("Coastal waters proxy error", { status: 502 });
      }
    }

    // Coastal waters product by ID (NWS)
    if (pathname.startsWith("/cwf/")) {
      try {
        return await proxyTo("https://api.weather.gov/products", req);
      } catch (err) {
        return new Response("CWF proxy error", { status: 502 });
      }
    }

    // --- Static files (from ./main) ---
    const staticResponse = await serveStatic(pathname);
    if (staticResponse) {
      return staticResponse;
    }

    // Not found
    return new Response("Not Found", { status: 404 });
  },
  error(error) {
    console.error("Server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  },
});

console.log("Weatherscan V2 by Mist Weather Media");
console.log(`Running on Bun ${Bun.version}`);
console.log(`Main serving on http://127.0.0.1:${server.port}`);
console.log(`Network: http://${server.hostname}:${server.port}`);