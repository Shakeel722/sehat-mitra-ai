import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Phone, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Hospital {
  name: string;
  distance: string;
  address: string;
  phone: string;
  type: string;
}

interface HospitalFinderProps {
  onBack: () => void;
  language: "en" | "hi";
}

const HospitalFinder = ({ onBack, language }: HospitalFinderProps) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Sample hospital data (in production, this would come from an API)
  const sampleHospitals: Hospital[] = [
    {
      name: language === "hi" ? "जिला अस्पताल" : "District Hospital",
      distance: "2.5 km",
      address: language === "hi" ? "मुख्य मार्ग, जिला केंद्र" : "Main Road, District Center",
      phone: "+91-1234-567890",
      type: language === "hi" ? "सरकारी" : "Government",
    },
    {
      name: language === "hi" ? "प्राथमिक स्वास्थ्य केंद्र" : "Primary Health Center",
      distance: "1.2 km",
      address: language === "hi" ? "ग्राम पंचायत रोड" : "Gram Panchayat Road",
      phone: "+91-1234-567891",
      type: language === "hi" ? "सरकारी" : "Government",
    },
    {
      name: language === "hi" ? "सामुदायिक स्वास्थ्य केंद्र" : "Community Health Center",
      distance: "4.8 km",
      address: language === "hi" ? "ब्लॉक मुख्यालय" : "Block Headquarters",
      phone: "+91-1234-567892",
      type: language === "hi" ? "सरकारी" : "Government",
    },
  ];

  const content = {
    en: {
      title: "Nearby Hospitals",
      findLocation: "Find My Location",
      locating: "Locating...",
      getDirections: "Get Directions",
      call: "Call",
      noLocation: "Location not available",
      locationError: "Unable to access location. Please enable location services.",
    },
    hi: {
      title: "नजदीकी अस्पताल",
      findLocation: "मेरा स्थान खोजें",
      locating: "खोज रहे हैं...",
      getDirections: "दिशा निर्देश प्राप्त करें",
      call: "कॉल करें",
      noLocation: "स्थान उपलब्ध नहीं है",
      locationError: "स्थान तक पहुंच नहीं हो सकी। कृपया स्थान सेवाएं सक्षम करें।",
    },
  };

  const t = content[language];

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
          toast({
            title: language === "hi" ? "स्थान मिल गया" : "Location Found",
            description: language === "hi"
              ? "आपके निकटतम अस्पताल दिखाए जा रहे हैं।"
              : "Showing hospitals near you.",
          });
        },
        (error) => {
          console.error("Location error:", error);
          setLoading(false);
          toast({
            title: language === "hi" ? "त्रुटि" : "Error",
            description: t.locationError,
            variant: "destructive",
          });
        }
      );
    }
  };

  const openMaps = (hospital: Hospital) => {
    if (location) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${encodeURIComponent(hospital.name + " " + hospital.address)}`,
        "_blank"
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + " " + hospital.address)}`,
        "_blank"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="bg-gradient-primary text-white px-4 py-4 shadow-soft">
        <div className="container mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">{t.title}</h1>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Location Button */}
        <Button
          onClick={getLocation}
          disabled={loading}
          className="w-full mb-6 bg-gradient-primary hover:opacity-90"
          size="lg"
        >
          <Navigation className="h-5 w-5 mr-2" />
          {loading ? t.locating : t.findLocation}
        </Button>

        {/* Hospital Cards */}
        <div className="space-y-4">
          {sampleHospitals.map((hospital, index) => (
            <Card
              key={index}
              className="p-4 hover:shadow-card transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{hospital.name}</h3>
                  <span className="text-xs text-primary font-medium">{hospital.type}</span>
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  {hospital.distance}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {hospital.address}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => openMaps(hospital)}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {t.getDirections}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${hospital.phone}`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {t.call}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HospitalFinder;
