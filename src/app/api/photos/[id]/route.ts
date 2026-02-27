import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { unlink } from 'fs/promises';
import { join } from 'path';

/**
 * DELETE /api/photos/[id] — Delete a photo (admin only)
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;

    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Delete file from disk
    try {
        const filePath = join(process.cwd(), 'public', photo.path);
        await unlink(filePath);
    } catch {
        // File may already be deleted — continue
    }

    // Delete from database
    await prisma.photo.delete({ where: { id } });

    return NextResponse.json({ success: true });
}
