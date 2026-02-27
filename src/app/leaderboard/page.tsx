'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

type Period = 'daily' | 'weekly' | 'monthly' | 'overall';
type LeaderboardType = 'all' | 'official';

interface LeaderboardEntry {
    rank: number;
    playerName: string;
    linkedUserId: string | null;
    totalPoints: number;
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    pointDifference: number;
    winRate: number;
    tournamentsPlayed: number;
}

interface LeaderboardData {
    period: string;
    type: string;
    entries: LeaderboardEntry[];
    totalTournaments: number;
}

export default function LeaderboardPage() {
    const { t } = useApp();
    const [period, setPeriod] = useState<Period>('overall');
    const [type, setType] = useState<LeaderboardType>('all');
    const [data, setData] = useState<LeaderboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/leaderboard?period=${period}&type=${type}`)
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [period, type]);

    const trophies = ['🥇', '🥈', '🥉'];
    const periodOptions: { value: Period; label: string }[] = [
        { value: 'daily', label: t.periodDaily },
        { value: 'weekly', label: t.periodWeekly },
        { value: 'monthly', label: t.periodMonthly },
        { value: 'overall', label: t.periodOverall },
    ];

    return (
        <>
            <Header />
            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-3xl font-black text-white mb-2">🏆 {t.publicLeaderboard}</h1>
                    <p className="text-navy-300">{t.leaderboardSubtitle}</p>
                </div>

                {/* Period Selector */}
                <div className="flex flex-wrap justify-center gap-2 mb-6 animate-slide-up stagger-1" style={{ opacity: 0 }}>
                    {periodOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setPeriod(opt.value)}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${period === opt.value
                                    ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/25'
                                    : 'bg-navy-800/50 text-navy-300 hover:bg-navy-700/50 hover:text-white'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Type Filter */}
                <div className="flex justify-center gap-2 mb-8 animate-slide-up stagger-2" style={{ opacity: 0 }}>
                    <button
                        onClick={() => setType('all')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${type === 'all'
                                ? 'bg-navy-600 text-white'
                                : 'text-navy-400 hover:text-navy-200'
                            }`}
                    >
                        {t.typeAll}
                    </button>
                    <button
                        onClick={() => setType('official')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${type === 'official'
                                ? 'bg-navy-600 text-white'
                                : 'text-navy-400 hover:text-navy-200'
                            }`}
                    >
                        {t.typeOfficial}
                    </button>
                </div>

                {/* Stats Summary */}
                {data && (
                    <div className="flex justify-center gap-6 mb-8 text-sm animate-fade-in">
                        <div className="text-center">
                            <div className="text-2xl font-black text-gold-400">{data.entries.length}</div>
                            <div className="text-navy-400">{t.players}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-gold-400">{data.totalTournaments}</div>
                            <div className="text-navy-400">{t.tournaments}</div>
                        </div>
                    </div>
                )}

                {/* Leaderboard Table */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-[200px]">
                        <div className="text-navy-400 text-lg">Loading...</div>
                    </div>
                ) : data && data.entries.length > 0 ? (
                    <div className="glass-card-static overflow-x-auto animate-slide-up stagger-3" style={{ opacity: 0 }}>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-navy-700/50">
                                    <th className="px-4 py-3 text-left text-xs font-bold text-navy-400 uppercase">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-navy-400 uppercase">{t.player}</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">{t.points}</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">{t.played}</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">{t.won}</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">{t.winRate}%</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">{t.diff}</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">{t.tournaments}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.entries.map((entry) => (
                                    <tr
                                        key={`${entry.playerName}-${entry.rank}`}
                                        className={`border-b border-navy-800/30 transition-colors hover:bg-navy-800/20 ${entry.rank <= 3 ? 'bg-navy-800/10' : ''
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-black text-lg ${entry.rank === 1 ? 'position-1'
                                                        : entry.rank === 2 ? 'position-2'
                                                            : entry.rank === 3 ? 'position-3'
                                                                : 'text-navy-400'
                                                    }`}>
                                                    {entry.rank}
                                                </span>
                                                {entry.rank <= 3 && <span>{trophies[entry.rank - 1]}</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {entry.linkedUserId ? (
                                                <Link
                                                    href={`/player/${entry.linkedUserId}`}
                                                    className="font-medium text-white hover:text-gold-400 transition-colors"
                                                >
                                                    {entry.playerName}
                                                </Link>
                                            ) : (
                                                <span className="font-medium text-white">{entry.playerName}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold text-gold-400">{entry.totalPoints}</td>
                                        <td className="px-4 py-3 text-center text-navy-300">{entry.matchesPlayed}</td>
                                        <td className="px-4 py-3 text-center text-navy-300">{entry.matchesWon}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-medium ${entry.winRate >= 60 ? 'text-success'
                                                    : entry.winRate >= 40 ? 'text-gold-400'
                                                        : 'text-navy-300'
                                                }`}>
                                                {entry.winRate}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-medium ${entry.pointDifference > 0 ? 'text-success'
                                                    : entry.pointDifference < 0 ? 'text-error'
                                                        : 'text-navy-400'
                                                }`}>
                                                {entry.pointDifference > 0 ? '+' : ''}{entry.pointDifference}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-navy-300">{entry.tournamentsPlayed}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="glass-card-static p-12 text-center animate-fade-in">
                        <div className="text-4xl mb-4">📊</div>
                        <p className="text-navy-300">{t.noLeaderboardData}</p>
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
