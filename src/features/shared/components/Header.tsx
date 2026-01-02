import { Rocket, Building2, Zap, Users, Radio, Briefcase, MessageCircle, Calendar, BookOpen, Info, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Startups', icon: Rocket },
    { path: '/incubators', label: 'Incubators', icon: Building2 },
    { path: '/accelerators', label: 'Accelerators', icon: Zap },
    { path: '/coworking-spaces', label: 'Co-Working Spaces', icon: Users },
    { path: '/media', label: 'Media', icon: Radio },
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/communities', label: 'Communities', icon: MessageCircle },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="text-center py-6 sm:py-8 px-4 border-b border-border/40 mb-0 pb-0">
      <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary text-primary-foreground flex-shrink-0">
          <Rocket className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">Algeria Ecosystem</h2>
        <div className="flex items-center flex-shrink-0 mt-1">
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2 max-w-full overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden min-[375px]:inline">{item.label}</span>
              <span className="min-[375px]:hidden">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>

    </header>
  );
};

export default Header;

