import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Users, Stethoscope, Code } from "lucide-react";

/**
 * About Us page component
 * Displays information about the medical and engineering teams
 */
const AboutUs = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background bg-gradient-radial">

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              {t('about.title')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>

          {/* Team Sections */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Medical Team */}
            <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-medical-blue/10">
                  <Stethoscope className="h-6 w-6 text-medical-blue" />
                </div>
                <h2 className="text-2xl font-bold">{t('about.medicalTeam.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.medicalTeam.description')}
              </p>
            </div>

            {/* Engineering Team */}
            <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-medical-teal/10">
                  <Code className="h-6 w-6 text-medical-teal" />
                </div>
                <h2 className="text-2xl font-bold">{t('about.engineeringTeam.title')}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.engineeringTeam.description')}
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-accent/10">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-2xl font-bold">{t('about.mission.title')}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('about.mission.description')}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
      
    </div>
  );
};

export default AboutUs;
