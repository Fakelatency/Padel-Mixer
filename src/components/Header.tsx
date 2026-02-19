'use client';

import { useApp } from '@/context/AppContext';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import logo from '../../public/baza-padel-logo.png';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { t, locale, setLocale, user } = useApp();
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-navy-950/80 border-b border-navy-700/30">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                    <div className="h-8 sm:h-10 transition-transform group-hover:scale-105">
                        <Image
                            src={logo}
                            alt="Baza Padel Club"
                            width={120}
                            height={32}
                            className="h-full w-auto object-contain"
                        />
                    </div>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex rounded-full bg-navy-800/80 border border-navy-600/30 p-0.5 gap-0.5">
                        <button
                            onClick={() => setLocale('pl')}
                            className={`relative px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide transition-all duration-300 ${locale === 'pl'
                                ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/30'
                                : 'text-navy-400 hover:text-navy-200'
                                }`}
                        >
                            PL
                        </button>
                        <button
                            onClick={() => setLocale('en')}
                            className={`relative px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide transition-all duration-300 ${locale === 'en'
                                ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/30'
                                : 'text-navy-400 hover:text-navy-200'
                                }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLocale('de')}
                            className={`relative px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide transition-all duration-300 ${locale === 'de'
                                ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/30'
                                : 'text-navy-400 hover:text-navy-200'
                                }`}
                        >
                            DE
                        </button>
                        <button
                            onClick={() => setLocale('ua')}
                            className={`relative px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide transition-all duration-300 ${locale === 'ua'
                                ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/30'
                                : 'text-navy-400 hover:text-navy-200'
                                }`}
                        >
                            UA
                        </button>
                    </div>


                    {user ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-navy-300 hidden sm:inline">{user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 rounded-full text-xs font-bold bg-navy-800/80 border border-navy-600/30 text-navy-400 hover:text-white hover:border-red-500/30 transition-all"
                            >
                                {t.logout}
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="px-3 py-1.5 rounded-full text-xs font-bold bg-navy-800/80 border border-navy-600/30 text-navy-400 hover:text-white transition-all"
                        >
                            {t.login}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
