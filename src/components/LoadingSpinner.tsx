'use client';

import Image from 'next/image';
import { brand } from '@/lib/brand';
import { BASE_PATH as BASE } from '@/lib/basepath';

interface LoadingSpinnerProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ text, size = 'md' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-12 h-12 mb-3',
        md: 'w-24 h-24 mb-6',
        lg: 'w-32 h-32 mb-8',
    };

    const containerClasses = {
        sm: 'min-h-[150px]',
        md: 'min-h-[300px]',
        lg: 'min-h-[400px]',
    };

    return (
        <div className={`flex flex-col items-center justify-center ${containerClasses[size]} animate-fade-in`}>
            <div className={`relative ${sizeClasses[size]}`}>
                <Image
                    src={`${BASE}${brand.signetPath}`}
                    alt=""
                    fill
                    unoptimized
                    className="object-contain animate-pulse opacity-40"
                />
            </div>
            {text && <p className="text-navy-400 text-sm font-medium">{text}</p>}
        </div>
    );
}
