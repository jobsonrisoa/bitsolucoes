import './globals.css';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter, Archivo_Black, Anton, IBM_Plex_Mono } from 'next/font/google';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { TransitionProvider } from '../components/TransitionProvider';
import { TransitionStage } from '../components/TransitionStage';
import { KeyboardShortcuts } from '../components/KeyboardShortcuts';
import { Topbar } from '../components/Topbar';
import { RouteFocus } from '../components/RouteFocus';
import { SvgDefs } from '../components/svg/SvgDefs';
import { RouteSkeleton } from '../components/domain/PageSkeletons';
import { ArrowKeyNavigation } from '../components/ui/ArrowKeyNavigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const archivo = Archivo_Black({ weight: "400", subsets: ['latin'], variable: '--font-archivo' });
const anton = Anton({ weight: "400", subsets: ['latin'], variable: '--font-anton' });
const ibm = IBM_Plex_Mono({ weight: "400", subsets: ['latin'], variable: '--font-ibm' });

export const metadata: Metadata = {
  title: 'Átrio',
  description: 'Portal de solicitações internas',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${archivo.variable} ${anton.variable} ${ibm.variable} font-sans`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <TransitionProvider>
                <SvgDefs />
                <TransitionStage />
                <KeyboardShortcuts />
                <ArrowKeyNavigation />
                <RouteFocus />
                <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
                <Topbar />
                <main id="conteudo" tabIndex={-1} className="h-[calc(100vh-64px)] overflow-y-auto overscroll-contain">
                  <Suspense fallback={<RouteSkeleton />}>
                    {children}
                  </Suspense>
                </main>
              </TransitionProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
