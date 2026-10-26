import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LmsProvider } from '@/lib/store';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'EduSMK — Learning Management System (LMS) Kejuruan Digital',
  description: 'Platform pembelajaran digital resmi untuk Sekolah Menengah Kejuruan (SMK) berstandar industri dengan materi interaktif, tugas, kuis, dan penilaian terintegrasi.',
  keywords: ['EduSMK', 'LMS SMK', 'Pembelajaran Kejuruan', 'RPL', 'TKJ', 'DKV', 'Next.js LMS'],
  authors: [{ name: 'EduSMK Engineering Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <LmsProvider>
          {children}
        </LmsProvider>
      </body>
    </html>
  );
}
