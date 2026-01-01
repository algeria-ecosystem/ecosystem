import {
  Rocket,
  Building2,
  Zap,
  Users,
  Radio,
  Briefcase,
  MessageCircle,
  Calendar,
  BookOpen,
  Info,
  Plus,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/i18n/LanguageContext";

interface HeaderProps {
  title?: string;
  description?: string;
}

const Header = ({
  title = "startups",
  description = "startupsDesc",
}: HeaderProps) => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/", key: "startups", icon: Rocket },
    { path: "/incubators", key: "incubators", icon: Building2 },
    { path: "/accelerators", key: "accelerators", icon: Zap },
    { path: "/coworking-spaces", key: "coworking", icon: Users },
    { path: "/media", key: "media", icon: Radio },
    { path: "/jobs", key: "jobs", icon: Briefcase },
    { path: "/communities", key: "communities", icon: MessageCircle },
    { path: "/events", key: "events", icon: Calendar },
    { path: "/resources", key: "resources", icon: BookOpen },
    { path: "/about", key: "about", icon: Info },
  ];

  return (
    <header className="text-center py-8 sm:py-12 md:py-16 px-4">
      <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary text-primary-foreground flex-shrink-0">
          <Rocket className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {t("headerTitle")}
        </h2>

        <div className="flex items-center flex-shrink-0 mt-1">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 px-2 max-w-full overflow-x-auto">
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
              <span className="hidden min-[375px]:inline">{t(item.key)}</span>
              <span className="min-[375px]:hidden">{t(item.key).split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-3 sm:mb-4 px-4">
        {t(title)}
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
        {t(description)}
      </p>

      {/* Contribution CTA */}
      {location.pathname !== "/about" && (
        <div className="mt-4 sm:mt-5 px-4">
          <a
            href="https://forms.gle/AiACXXFWwA1inGPJA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm text-primary hover:bg-primary/10 font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t("submitData")}</span>
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
