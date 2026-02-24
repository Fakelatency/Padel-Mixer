'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';

interface PublicProfile {
    user: {
        id: string;
        name: string;
        createdAt: string;
    };
    stats: {
        tournamentsPlayed: number;
        tournamentsWon: number;
        totalMatchesPlayed: number;
        totalMatchesWon: number;
        totalMatchesLost: number;
        totalPoints: number;
        totalPointDifference: number;
        winRate: number;
        avgPointsPerMatch: number;
        recentTournaments: {
            tournamentId: string;
            tournamentName: string;
            format: string;
            placement: number;
            totalPlayers: number;
            points: number;
            matchesWon: number;
            matchesLost: number;
            pointDifference: number;
            finishedAt: string;
        }[];
        bestPartners: {
            partnerName: string;
            sharedMatches: number;
            sharedWins: number;
        }[];
    };
}

const formatIcons: Record<string, string> = {
    americano: '🎾',
    mixedAmericano: '👫',
    teamAmericano: '👥',
    mexicano: '🌮',
    teamMexicano: '🏆',
};

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { t } = useApp();
    const router = useRouter();
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        fetch(`/padel/api/player/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then((data) => {
                setProfile(data);
                setLoading(false);
            })
            .catch(() => {
                setNotFound(true);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-navy-400 text-lg">Loading...</div>
                </div>
            </>
        );
    }

    if (notFound || !profile) {
        return (
            <>
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="text-5xl mb-4">😕</div>
                        <h1 className="text-2xl font-bold text-white mb-2">Player not found</h1>
                        <p className="text-navy-400 mb-6">This player profile doesn&apos;t exist.</p>
                        <button onClick={() => router.push('/')} className="btn-primary px-6 py-2">
                            {t.backToHome}
                        </button>
                    </div>
                </div>
            </>
        );
    }

    const { user, stats } = profile;
    const memberDate = new Date(user.createdAt).toLocaleDateString();

    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Hero */}
                <div className="text-center mb-10 animate-fade-in">
                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-4xl font-black text-navy-950 mx-auto shadow-lg shadow-gold-500/30">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-1">{user.name}</h1>
                    <p className="text-navy-400 text-sm">{t.memberSince} {memberDate}</p>
                </div>

                {stats.tournamentsPlayed === 0 ? (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="text-6xl mb-4">📊</div>
                        <h2 className="text-xl font-bold text-white mb-2">{t.noStatsYet}</h2>
                        <p className="text-navy-400">{t.noStatsDesc}</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="animate-slide-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="glass-card-static p-5 text-center">
                                    <div className="text-3xl font-black text-gold-400 mb-1">{stats.tournamentsPlayed}</div>
                                    <div className="text-xs text-navy-400 uppercase tracking-wider font-bold">{t.tournamentsPlayed}</div>
                                </div>
                                <div className="glass-card-static p-5 text-center">
                                    <div className="text-3xl font-black text-gold-400 mb-1">{stats.tournamentsWon}</div>
                                    <div className="text-xs text-navy-400 uppercase tracking-wider font-bold">{t.tournamentsWon}</div>
                                </div>
                                <div className="glass-card-static p-5 text-center">
                                    <div className="text-3xl font-black text-white mb-1">{stats.totalMatchesPlayed}</div>
                                    <div className="text-xs text-navy-400 uppercase tracking-wider font-bold">{t.played}</div>
                                </div>
                                <div className="glass-card-static p-5 text-center">
                                    <div className="text-3xl font-black text-success mb-1">{stats.totalMatchesWon}</div>
                                    <div className="text-xs text-navy-400 uppercase tracking-wider font-bold">{t.won}</div>
                                </div>
                                <div className="glass-card-static p-5 text-center">
                                    <div className="text-3xl font-black text-white mb-1">{stats.winRate}%</div>
                                    <div className="text-xs text-navy-400 uppercase tracking-wider font-bold">{t.winRate}</div>
                                </div>
                                <div className="glass-card-static p-5 text-center">
                                    <div className="text-3xl font-black text-white mb-1">{stats.avgPointsPerMatch}</div>
                                    <div className="text-xs text-navy-400 uppercase tracking-wider font-bold">{t.avgPointsPerMatch}</div>
                                </div>
                            </div>
                        </div>

                        {/* Point Difference */}
                        <div className="animate-slide-up" style={{ opacity: 0, animationDelay: '0.15s' }}>
                            <div className="glass-card-static p-5 flex items-center justify-between">
                                <span className="text-sm font-bold text-navy-300 uppercase tracking-wider">{t.diff}</span>
                                <span className={`text-3xl font-black ${stats.totalPointDifference >= 0 ? 'text-success' : 'text-error'}`}>
                                    {stats.totalPointDifference > 0 ? '+' : ''}{stats.totalPointDifference}
                                </span>
                            </div>
                        </div>

                        {/* Best Partners */}
                        {stats.bestPartners.length > 0 && (
                            <div className="animate-slide-up" style={{ opacity: 0, animationDelay: '0.2s' }}>
                                <h2 className="text-lg font-bold text-navy-200 mb-4 flex items-center gap-2">
                                    <span>🤝</span> {t.bestPartners}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {stats.bestPartners.map((partner, idx) => (
                                        <div key={partner.partnerName} className="glass-card-static p-4 flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black ${idx === 0 ? 'bg-gold-500/20 text-gold-400' : idx === 1 ? 'bg-gray-400/20 text-gray-300' : 'bg-orange-400/20 text-orange-300'}`}>
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-white truncate">{partner.partnerName}</div>
                                                <div className="text-xs text-navy-400">
                                                    {partner.sharedWins} {t.sharedWins} • {partner.sharedMatches} {t.played.toLowerCase()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Tournaments */}
                        {stats.recentTournaments.length > 0 && (
                            <div className="animate-slide-up" style={{ opacity: 0, animationDelay: '0.25s' }}>
                                <h2 className="text-lg font-bold text-navy-200 mb-4 flex items-center gap-2">
                                    <span>📋</span> {t.recentTournaments}
                                </h2>
                                <div className="space-y-3">
                                    {stats.recentTournaments.map((tournament, idx) => {
                                        const placementEmoji = tournament.placement === 1 ? '🥇' : tournament.placement === 2 ? '🥈' : tournament.placement === 3 ? '🥉' : `#${tournament.placement}`;
                                        return (
                                            <div
                                                key={tournament.tournamentId}
                                                className="glass-card-static p-4 animate-fade-in cursor-pointer hover:border-gold-500/30 transition-all"
                                                style={{ animationDelay: `${idx * 0.05}s`, opacity: 0 }}
                                                onClick={() => router.push(`/tournament/${tournament.tournamentId}/results`)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="text-2xl">{formatIcons[tournament.format] || '🎾'}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-white truncate">{tournament.tournamentName}</h3>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-400">
                                                            <span>{tournament.matchesWon}W / {tournament.matchesLost}L</span>
                                                            <span>•</span>
                                                            <span>{tournament.points} {t.points.toLowerCase()}</span>
                                                            <span>•</span>
                                                            <span className={tournament.pointDifference >= 0 ? 'text-success' : 'text-error'}>
                                                                {tournament.pointDifference > 0 ? '+' : ''}{tournament.pointDifference}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-black">
                                                            {placementEmoji}
                                                        </div>
                                                        <div className="text-xs text-navy-500">
                                                            /{tournament.totalPlayers}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </>
    );
}
