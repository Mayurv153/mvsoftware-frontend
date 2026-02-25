export const metadata = {
    title: 'Blog',
    description: 'Insights on web development, SEO, performance, and digital growth by MV Webservice.',
    alternates: {
        canonical: '/blog',
    },
    openGraph: {
        title: 'Blog | MV Webservice',
        description: 'Insights on web development, SEO, performance, and digital growth.',
        url: 'https://mvwebservice.com/blog',
        type: 'website',
    },
};

export default function BlogLayout({ children }) {
    return children;
}
