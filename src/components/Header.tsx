import { Rocket } from 'lucide-react';

const Header = () => {
  return (
    <header className="text-center py-12 md:py-16">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-6">
        <Rocket className="w-7 h-7" />
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
        Algerian Startups Directory
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Discover the vibrant startup ecosystem of Algeria. Explore innovative companies 
        shaping the future across technology, finance, and beyond.
      </p>
    </header>
  );
};

export default Header;
