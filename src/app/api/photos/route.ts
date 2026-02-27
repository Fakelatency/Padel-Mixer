import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/admin';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'photos');

/**
 * GET /api/photos — List photos, optionally filtered by tournamentId
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get('tournamentId');

    const where: Record<string, unknown> = {};
    if (tournamentId) {
        where.tournamentId = tournamentId;
    }

    const photos = await prisma.photo.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { id: true, name: true } },
            tournament: { select: { id: true, name: true } },
        },
    });

    return NextResponse.json(photos);
}

/**
 * POST /api/photos — Upload a photo (multipart/form-data)
 * Fields: file (required), caption (optional), tournamentId (optional)
 */
export async function POST(req: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const caption = formData.get('caption') as string | null;
    const tournamentId = formData.get('tournamentId') as string | null;

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type. Allowed: jpg, png, webp, gif' }, { status: 400 });
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 });
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${randomUUID()}.${ext}`;
    const filePath = join(UPLOAD_DIR, filename);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(arrayBuffer));

    // Save to database
    const photo = await prisma.photo.create({
        data: {
            filename,
            originalName: file.name,
            path: `uploads/photos/${filename}`,
            mimeType: file.type,
            size: file.size,
            caption: caption || null,
            tournamentId: tournamentId || null,
            uploadedBy: user.id,
        },
    });

    return NextResponse.json(photo, { status: 201 });
}
