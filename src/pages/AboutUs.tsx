import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { Users, Stethoscope, Code } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background bg-gradient-radial">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm font-medium text-primary transition-colors">
                About us
              </Link>
              <Link to="/legal" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Legal notice
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              About Aortic Code
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collaborative effort between medical professionals and engineering experts to provide 
              accurate aortic measurement calculations.
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
                <h2 className="text-2xl font-bold">Medical Team</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our medical team consists of experienced cardiologists and cardiovascular specialists 
                who ensure the accuracy and clinical relevance of all calculations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With decades of combined experience in aortic pathologies and cardiovascular imaging, 
                they provide the clinical expertise that makes this tool reliable for medical professionals.
              </p>
            </div>

            {/* Engineering Team */}
            <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-medical-teal/10">
                  <Code className="h-6 w-6 text-medical-teal" />
                </div>
                <h2 className="text-2xl font-bold">Engineering Team</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our engineering team brings expertise in medical software development, ensuring 
                the platform is secure, accessible, and user-friendly.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                They focus on creating intuitive interfaces and reliable calculations that medical 
                professionals can trust in their daily practice.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass animate-scale-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-accent/10">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Aortic Code was developed to provide medical professionals with a reliable, easy-to-use 
              tool for aortic measurements and calculations. Our goal is to support clinical decision-making 
              with accurate, evidence-based calculations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By combining medical expertise with modern engineering practices, we strive to create 
              tools that enhance patient care and support healthcare professionals in their daily work.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Aortic Code. Eina professional per a professionals mèdics.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
