import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "fr";

type Translations = Record<string, Record<string, string>>;

const translations: Translations = {
    en: {
        startups: "Startups",
        startupsDesc: "Discover the vibrant startup ecosystem of Algeria. Explore innovative companies shaping the future across technology, finance, and beyond.",
        incubators: "Incubators",
        incubatorsDesc: "Discover incubators supporting and nurturing startups across Algeria.",
        accelerators: "Accelerators",
        acceleratorsDesc: "Discover accelerators providing mentorship, funding, and growth opportunities for startups in Algeria.",
        coworking: "Co-Working Spaces",
        coworkingDesc: "Find co-working spaces and collaborative work environments in Algeria.",
        media: "Media",
        mediaDesc: "Discover podcasts, videos, and newsletters from the Algerian ecosystem.",
        jobs: "Jobs",
        jobsDesc: "Discover job portals and career opportunities in Algeria. Find your next career move.",
        communities: "Communities",
        communitiesDesc: "Discover communities, groups, and organizations in Algeria. Connect with developers, entrepreneurs, and tech enthusiasts.",
        events: "Events",
        eventsDesc: "Discover tech events, conferences, and meetups happening in Algeria. Stay connected with the latest events in the ecosystem.",
        resources: "Resources",
        resourcesDesc: "Discover helpful resources for the Algerian ecosystem. Find websites that provide information about the ecosystem, statistics, and more.",
        about: "About",
        aboutDesc: "Learn more about the Algeria Ecosystem project, its vision, and how you can contribute.",
        submitData: "Submit Data",

        headerTitle: "Algeria Ecosystem",
        headerDescription:
            "Discover the vibrant startup ecosystem of Algeria. Explore innovative companies shaping the future across technology, finance, and beyond.",
    },
    fr: {
        startups: "Startups",
        startupsDesc: "Découvrez l'écosystème dynamique des startups en Algérie. Explorez des entreprises innovantes qui façonnent l'avenir dans les domaines de la technologie, de la finance et bien plus encore.",
        incubators: "Incubateurs",
        incubatorsDesc: "Découvrez les incubateurs qui soutiennent et accompagnent les startups en Algérie.",
        accelerators: "Accélérateurs",
        acceleratorsDesc: "Découvrez les accélérateurs offrant mentorat, financement et opportunités de croissance pour les startups en Algérie.",
        coworking: "Espaces de coworking",
        coworkingDesc: "Trouvez des espaces de coworking et environnements collaboratifs en Algérie.",
        media: "Médias",
        mediaDesc: "Découvrez des podcasts, vidéos et newsletters de l'écosystème algérien.",
        jobs: "Emplois",
        jobsDesc: "Découvrez les portails d'emploi et opportunités de carrière en Algérie. Trouvez votre prochaine opportunité.",
        communities: "Communautés",
        communitiesDesc: "Découvrez les communautés, groupes et organisations en Algérie. Connectez-vous avec des développeurs, entrepreneurs et passionnés de technologie.",
        events: "Événements",
        eventsDesc: "Découvrez les événements tech, conférences et meetups qui se déroulent en Algérie. Restez connecté aux dernières actualités de l'écosystème.",
        resources: "Ressources",
        resourcesDesc: "Découvrez des ressources utiles pour l'écosystème algérien. Consultez des sites fournissant informations, statistiques et plus encore.",
        about: "À propos",
        aboutDesc: "Découvrez le projet Écosystème algérien, sa vision et comment vous pouvez y contribuer.",
        submitData: "Soumettre des données",

        headerTitle: "Écosystème Algérien",
        headerDescription:
            "Découvrez l'écosystème dynamique des startups en Algérie. Explorez des entreprises innovantes qui façonnent l’avenir.",
    },
};

const LanguageContext = createContext<{
    language: Language;
    setLanguage: (l: Language) => void;
    t: (key: string) => string;
} | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<Language>(
        () => (localStorage.getItem("language") as Language) || "en"
    );

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    const t = (key: string) => translations[language][key] ?? key;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
    return ctx;
};
