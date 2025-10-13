import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { AlertTriangle, Shield, FileText, Scale } from "lucide-react";

const LegalNotice = () => {
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
              <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                About us
              </Link>
              <Link to="/legal" className="text-sm font-medium text-primary transition-colors">
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
          {/* Title */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Legal Notice</h1>
            <p className="text-lg text-muted-foreground">
              Important information regarding the use of Aortic Code
            </p>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass mb-6 animate-slide-up">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-destructive/10 flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Medical Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong>This tool does not replace professional medical advice, diagnosis, or treatment.</strong> 
                  Aortic Code is designed as a support tool for qualified medical professionals and should be 
                  used only as a complement to clinical judgment and experience.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Always seek the advice of your physician or other qualified health provider with any questions 
                  you may have regarding a medical condition. Never disregard professional medical advice or delay 
                  in seeking it because of information obtained from this tool.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The calculations and results provided by Aortic Code are based on established medical formulas 
                  and guidelines, but they should always be interpreted in the context of the individual patient's 
                  clinical situation by a qualified healthcare professional.
                </p>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10 flex-shrink-0">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The developers, contributors, and operators of Aortic Code shall not be held responsible for 
                  any damages, injuries, losses, or liabilities (including but not limited to direct, indirect, 
                  incidental, special, consequential, or punitive damages) arising from:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2 mb-4">
                  <li>The use or inability to use this tool</li>
                  <li>Any decisions made based on calculations provided by this tool</li>
                  <li>Any errors, inaccuracies, or omissions in the content or calculations</li>
                  <li>Any technical malfunctions or interruptions in service</li>
                  <li>Any reliance placed on the information provided by this tool</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  By using Aortic Code, you acknowledge and agree that you use this tool at your own risk and 
                  that you are solely responsible for any decisions made based on the information provided.
                </p>
              </div>
            </div>
          </div>

          {/* Professional Use Only */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-medical-blue/10 flex-shrink-0">
                <FileText className="h-6 w-6 text-medical-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Professional Use Only</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Aortic Code is intended exclusively for use by qualified medical professionals with appropriate 
                  training and expertise in cardiovascular medicine and imaging interpretation.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Users must have the necessary medical knowledge and clinical experience to properly interpret 
                  the results and apply them within the appropriate clinical context. This tool is not intended 
                  for use by patients or individuals without medical training.
                </p>
              </div>
            </div>
          </div>

          {/* Accuracy and Updates */}
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-glass animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-medical-teal/10 flex-shrink-0">
                <Scale className="h-6 w-6 text-medical-teal" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Accuracy and Updates</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  While we strive to ensure the accuracy and reliability of all calculations and information 
                  provided by Aortic Code, we make no warranties or representations regarding the completeness, 
                  accuracy, or reliability of the content.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Medical knowledge and guidelines evolve over time. We endeavor to keep the tool updated with 
                  current medical standards, but users should always verify calculations and consult current 
                  medical literature and guidelines.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Users are encouraged to report any discrepancies or issues to help us maintain and improve 
                  the accuracy of this tool.
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center mt-12 text-sm text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
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

export default LegalNotice;
