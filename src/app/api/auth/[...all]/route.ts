import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const { GET: _GET, POST: _POST } = toNextJsHandler(auth);

/**
 * Next.js App Router with basePath '/padel' passes requests with the full URL
 * including '/padel' prefix. better-auth expects paths starting with '/api/auth'
 * (its default basePath). We strip '/padel' so better-auth can route correctly.
 * We also strip trailing slashes added by Next.js trailingSlash config.
 */
function fixRequest(req: Request): Request {
    const url = new URL(req.url);
    if (url.pathname.startsWith('/padel')) {
        url.pathname = url.pathname.slice('/padel'.length);
    }
    // Strip trailing slash (Next.js trailingSlash: true adds them)
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
        url.pathname = url.pathname.slice(0, -1);
    }
    return new Request(url, req);
}

export function GET(req: Request) {
    return _GET(fixRequest(req));
}

export function POST(req: Request) {
    return _POST(fixRequest(req));
}
