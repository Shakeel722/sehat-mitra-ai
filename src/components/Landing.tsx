import { Button } from "@/components/ui/button";
import { Heart, Activity, Users } from "lucide-react";
import heroImage from "@/assets/hero-healthcare.jpg";
import logo from "@/assets/logo.png";

interface LandingProps {
  onStartChat: () => void;
  language: "en" | "hi";
  onLanguageChange: (lang: "en" | "hi") => void;
}

const Landing = ({ onStartChat, language, onLanguageChange }: LandingProps) => {
  const content = {
    en: {
      title: "SehatSaathi",
      subtitle: "Your AI Health Companion for Rural India",
      tagline: "Healthcare guidance at your fingertips - anytime, anywhere",
      startBtn: "Start Chatting",
      features: [
        { icon: Heart, title: "Health Guidance", desc: "Get verified first-aid and basic health advice" },
        { icon: Activity, title: "Tele-Consultation", desc: "Connect with doctors remotely" },
        { icon: Users, title: "Find Hospitals", desc: "Locate nearby health facilities" },
      ],
      footer: "Empowering Rural Healthcare with AI",
    },
    hi: {
      title: "सेहतसाथी",
      subtitle: "ग्रामीण भारत के लिए आपका AI स्वास्थ्य साथी",
      tagline: "स्वास्थ्य मार्गदर्शन आपकी उंगलियों पर - कभी भी, कहीं भी",
      startBtn: "चैट शुरू करें",
      features: [
        { icon: Heart, title: "स्वास्थ्य मार्गदर्शन", desc: "प्राथमिक चिकित्सा और स्वास्थ्य सलाह प्राप्त करें" },
        { icon: Activity, title: "टेली-परामर्श", desc: "डॉक्टरों से दूरस्थ रूप से जुड़ें" },
        { icon: Users, title: "अस्पताल खोजें", desc: "नजदीकी स्वास्थ्य सुविधाएं खोजें" },
      ],
      footer: "AI के साथ ग्रामीण स्वास्थ्य सेवा को सशक्त बनाना",
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SehatSaathi Logo" className="h-12 w-12" />
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {t.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant={language === "en" ? "default" : "outline"}
            size="sm"
            onClick={() => onLanguageChange("en")}
          >
            English
          </Button>
          <Button
            variant={language === "hi" ? "default" : "outline"}
            size="sm"
            onClick={() => onLanguageChange("hi")}
          >
            हिंदी
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {t.subtitle}
            </h2>
            <p className="text-lg text-muted-foreground">{t.tagline}</p>
            <Button
              size="lg"
              onClick={onStartChat}
              className="bg-gradient-primary hover:opacity-90 transition-all hover:scale-105 shadow-soft text-lg px-8 py-6"
            >
              {t.startBtn}
            </Button>
          </div>
          <div className="relative animate-fade-in-up">
            <img
              src={heroImage}
              alt="Healthcare in Rural India"
              className="rounded-2xl shadow-card w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-2xl" />
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {t.features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-xl shadow-card hover:shadow-soft transition-all hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground font-medium">{t.footer}</p>
      </footer>
    </div>
  );
};

export default Landing;
