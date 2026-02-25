import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import PageLoader from '@/components/PageLoader';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata = {
    metadataBase: new URL('https://mvwebservice.com'),
    title: {
        default: 'MV Webservice — Stunning Websites & AI Automations',
        template: '%s | MV Webservice',
    },
    description:
        'We build stunning animated websites & AI-powered automations for small businesses and startups. Premium quality, fast delivery.',
    keywords: ['web development', 'creative technologist', 'animated websites', 'AI automation', 'web design India', 'MV Webservice'],
    openGraph: {
        title: 'MV Webservice — Stunning Websites & AI Automations',
        description: 'We build stunning animated websites & AI-powered automations for small businesses and startups.',
        url: 'https://mvwebservice.com',
        siteName: 'MV Webservice',
        type: 'website',
        locale: 'en_IN',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MV Webservice',
        description: 'Stunning websites & AI automations for businesses.',
    },
    robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
            </head>
            <body className="min-h-screen flex flex-col">
                <TooltipProvider>
                    <PageLoader />
                    <CustomCursor />
                    <SmoothScroll>
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </SmoothScroll>
                    <Toaster />
                </TooltipProvider>
            </body>
        </html>
    );
}


