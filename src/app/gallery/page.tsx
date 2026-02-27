'use client';

import { useEffect, useState, useRef } from 'react';
import Header from '@/components/Header';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import Image from 'next/image';

interface Photo {
    id: string;
    filename: string;
    originalName: string;
    path: string;
    mimeType: string;
    caption: string | null;
    tournamentId: string | null;
    tournament: { id: string; name: string } | null;
    user: { id: string; name: string } | null;
    createdAt: string;
}

interface TournamentOption {
    id: string;
    name: string;
}

export default function GalleryPage() {
    const { t, user, tournaments } = useApp();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterTournament, setFilterTournament] = useState<string>('');
    const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadCaption, setUploadCaption] = useState('');
    const [uploadTournament, setUploadTournament] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get unique tournaments from app context for the filter
    const tournamentOptions: TournamentOption[] = (tournaments || []).map((t: { id: string; name: string }) => ({
        id: t.id,
        name: t.name,
    }));

    useEffect(() => {
        loadPhotos();
    }, [filterTournament]);

    async function loadPhotos() {
        setLoading(true);
        const url = filterTournament
            ? `/api/photos?tournamentId=${filterTournament}`
            : '/api/photos';
        try {
            const res = await fetch(url);
            const data = await res.json();
            setPhotos(Array.isArray(data) ? data : []);
        } catch {
            setPhotos([]);
        }
        setLoading(false);
    }

    async function handleUpload() {
        const file = fileInputRef.current?.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        if (uploadCaption) formData.append('caption', uploadCaption);
        if (uploadTournament) formData.append('tournamentId', uploadTournament);

        try {
            const res = await fetch('/api/photos', { method: 'POST', body: formData });
            if (res.ok) {
                setShowUpload(false);
                setUploadCaption('');
                setUploadTournament('');
                if (fileInputRef.current) fileInputRef.current.value = '';
                loadPhotos();
            }
        } catch {
            // handle error silently
        }
        setUploading(false);
    }

    return (
        <>
            <Header />
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Title */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-3xl font-black text-white mb-2">📸 {t.gallery}</h1>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8 animate-slide-up stagger-1" style={{ opacity: 0 }}>
                    {/* Tournament Filter */}
                    <select
                        value={filterTournament}
                        onChange={(e) => setFilterTournament(e.target.value)}
                        className="bg-navy-800/80 border border-navy-600/30 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500/50"
                    >
                        <option value="">{t.typeAll}</option>
                        {tournamentOptions.map((to) => (
                            <option key={to.id} value={to.id}>{to.name}</option>
                        ))}
                    </select>

                    {/* Upload Button */}
                    {user && (
                        <button
                            onClick={() => setShowUpload(true)}
                            className="btn-primary text-sm px-5 py-2 flex items-center gap-2"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="8" y1="3" x2="8" y2="13" />
                                <line x1="3" y1="8" x2="13" y2="8" />
                            </svg>
                            Upload
                        </button>
                    )}
                </div>

                {/* Upload Modal */}
                {showUpload && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowUpload(false)}>
                        <div className="glass-card-static p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-lg font-bold text-white mb-4">Upload Photo</h3>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="w-full mb-4 text-sm text-navy-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gold-500 file:text-navy-950 hover:file:bg-gold-400"
                            />

                            <input
                                type="text"
                                placeholder="Caption (optional)"
                                value={uploadCaption}
                                onChange={(e) => setUploadCaption(e.target.value)}
                                className="w-full mb-4 bg-navy-900/50 border border-navy-700/50 rounded-xl px-4 py-2 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-gold-500/50"
                            />

                            <select
                                value={uploadTournament}
                                onChange={(e) => setUploadTournament(e.target.value)}
                                className="w-full mb-4 bg-navy-900/50 border border-navy-700/50 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500/50"
                            >
                                <option value="">No tournament link</option>
                                {tournamentOptions.map((to) => (
                                    <option key={to.id} value={to.id}>{to.name}</option>
                                ))}
                            </select>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="btn-primary flex-1 text-sm py-2"
                                >
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </button>
                                <button
                                    onClick={() => setShowUpload(false)}
                                    className="btn-ghost flex-1 text-sm py-2"
                                >
                                    {t.cancel}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Photo Grid */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-[200px]">
                        <div className="text-navy-400 text-lg">Loading...</div>
                    </div>
                ) : photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 animate-fade-in">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="relative group cursor-pointer rounded-xl overflow-hidden bg-navy-800/50 aspect-square"
                                onClick={() => setLightboxPhoto(photo)}
                            >
                                <Image
                                    src={`/${photo.path}`}
                                    alt={photo.caption || photo.originalName}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        {photo.caption && (
                                            <p className="text-white text-xs font-medium truncate">{photo.caption}</p>
                                        )}
                                        {photo.tournament && (
                                            <p className="text-gold-400 text-[10px] truncate">🏆 {photo.tournament.name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card-static p-12 text-center animate-fade-in">
                        <div className="text-4xl mb-4">📷</div>
                        <p className="text-navy-300">{t.noLeaderboardData}</p>
                    </div>
                )}

                {/* Lightbox */}
                {lightboxPhoto && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
                        onClick={() => setLightboxPhoto(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl z-50"
                            onClick={() => setLightboxPhoto(null)}
                        >
                            ✕
                        </button>
                        <div className="relative max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={`/${lightboxPhoto.path}`}
                                alt={lightboxPhoto.caption || lightboxPhoto.originalName}
                                width={1200}
                                height={900}
                                className="object-contain max-h-[85vh] rounded-lg"
                            />
                            <div className="mt-3 text-center">
                                {lightboxPhoto.caption && (
                                    <p className="text-white text-sm">{lightboxPhoto.caption}</p>
                                )}
                                {lightboxPhoto.tournament && (
                                    <Link
                                        href={`/tournament/${lightboxPhoto.tournament.id}/results`}
                                        className="text-gold-400 text-xs hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        🏆 {lightboxPhoto.tournament.name}
                                    </Link>
                                )}
                                {lightboxPhoto.user && (
                                    <p className="text-navy-400 text-xs mt-1">
                                        by {lightboxPhoto.user.name} • {new Date(lightboxPhoto.createdAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Back */}
                <div className="text-center mt-8">
                    <Link href="/" className="btn-ghost">
                        ← {t.backToHome}
                    </Link>
                </div>
            </main>
        </>
    );
}
