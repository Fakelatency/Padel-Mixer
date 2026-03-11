import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { BASE_PATH } from '@/lib/basepath';

const { GET: _GET, POST: _POST } = toNextJsHandler(auth);

/**
 * Next.js App Router with a basePath passes requests with the full URL
 * including the basePath prefix. better-auth expects paths starting with '/api/auth'
 * (its default basePath). We strip the basePath so better-auth can route correctly.
 * We also strip trailing slashes added by Next.js trailingSlash config.
 */
function fixRequest(req: Request): Request {
    const url = new URL(req.url);
    if (url.pathname.startsWith(BASE_PATH)) {
        url.pathname = url.pathname.slice(BASE_PATH.length);
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
