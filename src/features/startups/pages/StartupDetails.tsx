import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Linkedin, Calendar, MapPin, Globe } from 'lucide-react';
import { slugify } from '@/shared/utils/slug';
import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer';
import startupsData from '@/data/startups.json';
import categoriesData from '@/data/startup_categories.json';
import NotFound from '@/shared/pages/NotFound';
import type { Startup, Category } from '../types';

const startups: Startup[] = startupsData;
const categories: Category[] = categoriesData;

const StartupDetails = () => {
    const { slug } = useParams<{ slug: string }>();
    const [imageError, setImageError] = useState(false);

    const startup = useMemo(() => {
        return startups.find((s) => slugify(s.name) === slug);
    }, [slug]);

    const startupCategories = useMemo(() => {
        if (!startup) return [];
        return categories.filter((cat) => startup.categoryIds.includes(cat.id));
    }, [startup]);

    // Set page title, uses slug - Algeria Ecosystem, can be changed, this is important lel SEO
    useEffect(() => {
        if (startup) {
            document.title = `${startup.name} - Algeria Ecosystem`;
        }
    }, [startup]);

    if (!startup) {
        return <NotFound />;
    }

    // Favicon logic 3awedtah hna, consider moving to utils for DRY
    let domain = '';
    if (startup.website) {
        try {
            const url = new URL(startup.website.startsWith('http') ? startup.website : `https://${startup.website}`);
            domain = url.hostname.replace(/^www\./, '');
        } catch {
            domain = startup.website.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').split('/')[0];
        }
    }
    const faviconUrl = domain ? `https://fetchfavicon.com/i/${domain}?size=64` : '';

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="container py-4 sm:py-6 px-4 sm:px-6 flex-1 flex flex-col">
                <Header />

                <main className="flex-1 mt-8 max-w-4xl mx-auto w-full">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Ecosystem
                    </Link>

                    <article className="bg-card rounded-3xl border border-border/60 p-6 sm:p-10 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
                            {/* Logo Section */}
                            <div className="flex-shrink-0">
                                {faviconUrl && !imageError ? (
                                    <img
                                        src={faviconUrl}
                                        alt={`${startup.name} logo`}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-contain border border-border/40 bg-white"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-secondary/40 flex items-center justify-center text-3xl font-bold text-primary">
                                        {startup.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Header Info */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{startup.name}</h1>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {startupCategories.map((c) => (
                                        <span key={c.id} className="text-sm font-medium text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
                                            {c.name}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Founded {startup.foundedYear}</span>
                                    </div>
                                    {/* Placeholder for location if added later */}
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>Algeria</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row sm:flex-col gap-3 mt-4 sm:mt-0">
                                {startup.website && (
                                    <a
                                        href={startup.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium min-w-[140px]"
                                    >
                                        <Globe className="w-4 h-4" />
                                        Visit Website
                                    </a>
                                )}
                                {startup.linkedin && (
                                    <a
                                        href={startup.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors font-medium min-w-[140px]"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-border/40">
                            <h2 className="text-xl font-semibold mb-4">About {startup.name}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {startup.name} is a leading startup in the Algerian ecosystem, innovating in the {startupCategories.map(c => c.name).join(' and ')} sector.
                                Founded in {startup.foundedYear}, it is contributing to the digital transformation of the region.
                            </p>
                        </div>
                    </article>
                </main>

                <div className="mt-auto pt-8">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default StartupDetails;
