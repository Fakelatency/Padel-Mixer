import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { brand } from '@/lib/brand';
import { BASE_PATH as BASE } from '@/lib/basepath';

export const metadata: Metadata = {
  title: brand.appTitle,
  description: brand.appDescription,
  icons: {
    icon: `${BASE}${brand.faviconPath}`,
    apple: `${BASE}${brand.faviconPath}`,
  },
};

/**
 * Inline CSS that injects brand-specific custom properties and the font @import.
 * This is the bridge between brand.ts and the CSS custom properties used in globals.css.
 */
function brandCssVars(): string {
  return `
    @import url('${brand.fontUrl}');
    :root {
      --brand-font: ${brand.fontFamily};
      --brand-bg-watermark: url('${BASE}${brand.faviconPath}');
      --brand-signet-url: url('${BASE}${brand.signetPath}');

      --color-navy-950: ${brand.colors.primary[950]};
      --color-navy-900: ${brand.colors.primary[900]};
      --color-navy-800: ${brand.colors.primary[800]};
      --color-navy-700: ${brand.colors.primary[700]};
      --color-navy-600: ${brand.colors.primary[600]};
      --color-navy-500: ${brand.colors.primary[500]};
      --color-navy-400: ${brand.colors.primary[400]};
      --color-navy-300: ${brand.colors.primary[300]};
      --color-navy-200: ${brand.colors.primary[200]};
      --color-navy-100: ${brand.colors.primary[100]};

      --color-gold-600: ${brand.colors.accent[600]};
      --color-gold-500: ${brand.colors.accent[500]};
      --color-gold-400: ${brand.colors.accent[400]};
      --color-gold-300: ${brand.colors.accent[300]};

      --color-success: ${brand.colors.success};
      --color-error: ${brand.colors.error};
      --color-warning: ${brand.colors.warning};
    }
  `;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: brandCssVars() }} />
      </head>
      <body>
        <div className="court-bg" />
        <AppProvider>
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
