import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const MIME_TYPES: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
};

/**
 * GET /api/uploads/[...path] — Serve uploaded files from public/uploads/
 * e.g. /api/uploads/photos/abc.jpeg → public/uploads/photos/abc.jpeg
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadsDir, ...path);

    // Security: prevent directory traversal
    if (!filePath.startsWith(uploadsDir)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!existsSync(filePath)) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const ext = path[path.length - 1]?.split('.').pop()?.toLowerCase() || '';
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
}
