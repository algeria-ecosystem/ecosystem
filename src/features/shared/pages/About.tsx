import Header from '@/features/shared/components/Header';
import Footer from '@/features/shared/components/Footer';
import { Mail, Linkedin, Github, Plus, ExternalLink, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-4 sm:py-6 px-4 sm:px-6">
        <Header
        // title="About"
        // description="Learn more about the Algeria Ecosystem project, its vision, and how you can contribute."
        />

        <section className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
          {/* Vision Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle>Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                The Algeria Ecosystem website aims to provide a comprehensive directory of the Algerian ecosystem.
                Our vision is to connect entrepreneurs, investors, developers, and stakeholders by showcasing startups,
                incubators, accelerators, co-working spaces, media, jobs, communities, events, and valuable resources
                that support innovation and entrepreneurship in Algeria.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Get in touch with us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="mailto:contact@zegai.org"
                className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground truncate">contact@zegai.org</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </a>

              <a
                href="https://linkedin.com/in/houarizegai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Linkedin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">LinkedIn</p>
                  <p className="text-sm text-muted-foreground truncate">in/houarizegai</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </a>
            </CardContent>
          </Card>

          {/* Contribution Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                <CardTitle>Contribution</CardTitle>
              </div>
              <CardDescription>Help us grow the ecosystem directory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We welcome contributions from the community! You can help by adding or editing data to keep the directory
                up-to-date and comprehensive.
              </p>

              <div className="space-y-3">
                <Link
                  to={'/submit'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">Submit Data</p>
                    <p className="text-sm text-muted-foreground">Add new entries via our form</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </Link>

                <a
                  href="https://github.com/algeria-ecosystem/ecosystem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Github className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">Contribute on GitHub</p>
                    <p className="text-sm text-muted-foreground">Edit data directly via pull requests</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default About;

