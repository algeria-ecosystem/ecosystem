import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 mt-12 border-t border-border">
      <div className="text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> for the Algerian startup ecosystem
        </p>
      </div>
    </footer>
  );
};

export default Footer;
