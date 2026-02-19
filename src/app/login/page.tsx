'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useApp } from '@/context/AppContext';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
    const { t } = useApp();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await authClient.signIn.email({
                email,
                password,
            });
            if (result.error) {
                setError(result.error.message || t.loginError);
            } else {
                router.push('/');
                router.refresh();
            }
        } catch {
            setError(t.loginError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 animate-fade-in">
                    <div className="relative inline-block mb-4">
                        <Image
                            src="/baza-padel-logo.png"
                            alt="Baza Padel Club"
                            width={220}
                            height={60}
                            className="mx-auto object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">{t.login}</h1>
                    <p className="text-navy-300 text-sm">{t.loginSubtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card-static p-6 space-y-4 animate-slide-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-navy-300 mb-1.5">{t.email}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            placeholder="email@example.com"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-navy-300 mb-1.5">{t.password}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 text-lg disabled:opacity-50"
                    >
                        {loading ? '...' : t.login}
                    </button>

                    <p className="text-center text-sm text-navy-400">
                        {t.noAccount}{' '}
                        <Link href="/register" className="text-gold-400 hover:text-gold-300 font-medium">
                            {t.registerLink}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
