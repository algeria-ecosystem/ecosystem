import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState } from "react";

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();
    const [isEn, setIsEn] = useState(language === "en");

    const toggleLanguage = () => {
        const newLang = language === "en" ? "fr" : "en";
        setLanguage(newLang);
        setIsEn(newLang === "en");
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="h-9 w-9 rounded-lg hover:bg-muted/80 transition-all duration-200 relative group flex items-center justify-center"
            aria-label={isEn ? "Switch to French" : "Switch to English"}
            title={isEn ? "Switch to French" : "Switch to English"}
        >
            {/* EN Globe */}
            <Globe className={`absolute h-5 w-5 transition-all duration-300 ${isEn ? "rotate-0 scale-100" : "rotate-90 scale-0"} text-foreground`} />
            {/* FR Globe */}
            <Globe className={`absolute h-5 w-5 transition-all duration-300 ${isEn ? "rotate-90 scale-0" : "rotate-0 scale-100"} text-foreground`} />
        </Button>
    );
}
