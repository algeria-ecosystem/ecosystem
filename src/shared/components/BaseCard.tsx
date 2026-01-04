import { useState, useRef, useLayoutEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BaseCardProps {
    name: string;
    description: string;
    url?: string;
    externalLinkLabel?: string;
    subtitle?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

const BaseCard = ({
    name,
    description,
    url,
    externalLinkLabel,
    subtitle,
    footer,
    className,
}: BaseCardProps) => {
    const [imageError, setImageError] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        const checkClamping = () => {
            const element = descriptionRef.current;
            if (element) {
                // Check if the content is actually overflowing its container
                const isOverflowing = element.scrollHeight > element.clientHeight;
                setIsClamped(isOverflowing);
            }
        };

        // Initial check
        checkClamping();

        // Optional: Re-check on window resize if needed
        window.addEventListener('resize', checkClamping);
        return () => window.removeEventListener('resize', checkClamping);
    }, [description, isExpanded]); // Re-run if description changes or expansion state changes

    let domain = '';
    if (url) {
        try {
            const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
            domain = parsedUrl.hostname.replace(/^www\./, '');
        } catch {
            // Fallback for malformed URLs
            domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').split('/')[0];
        }
    }
    const faviconUrl = domain ? `https://fetchfavicon.com/i/${domain}?size=64` : '';

    return (
        <article className={cn(
            "group relative bg-card rounded-2xl border border-border/60 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
            className
        )}>
            <div className="flex items-start gap-4 mb-5">
                {imageError || !faviconUrl ? (
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-secondary/40 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">{name.charAt(0).toUpperCase()}</span>
                    </div>
                ) : (
                    <img
                        src={faviconUrl}
                        alt={`${name} logo`}
                        className="flex-shrink-0 w-10 h-10 rounded-xl object-contain"
                        onError={() => setImageError(true)}
                    />
                )}

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-card-foreground truncate mb-1 group-hover:text-primary transition-colors duration-300">
                        {name}
                    </h3>
                    {subtitle}
                    <p
                        ref={descriptionRef}
                        className={cn(
                            "text-sm text-muted-foreground",
                            !isExpanded && "line-clamp-3"
                        )}
                    >
                        {description}
                    </p>
                    {(isClamped || isExpanded) && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors inline-block"
                        >
                            {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </div>

                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 w-9 h-9 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group-hover:scale-110"
                        aria-label={externalLinkLabel || `Visit ${name} website`}
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>

            {footer && (
                <div className="flex items-center justify-between pt-5 border-t border-border/40">
                    {footer}
                </div>
            )}
        </article>
    );
};

export default BaseCard;
