import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MapPin, ArrowLeft, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import HospitalFinder from "./HospitalFinder";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  onBack: () => void;
  language: "en" | "hi";
  onLanguageChange: (lang: "en" | "hi") => void;
}

const ChatInterface = ({ onBack, language, onLanguageChange }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHospitalFinder, setShowHospitalFinder] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const content = {
    en: {
      title: "SehatSaathi",
      placeholder: "Type your symptoms or health question...",
      findHospitals: "Find Nearby Hospitals",
      tele: "Tele-Consultation",
      welcome: "Hello! I'm SehatSaathi, your health companion. How can I help you today?",
    },
    hi: {
      title: "सेहतसाथी",
      placeholder: "अपने लक्षण या स्वास्थ्य प्रश्न लिखें...",
      findHospitals: "नजदीकी अस्पताल खोजें",
      tele: "टेली-परामर्श",
      welcome: "नमस्ते! मैं सेहतसाथी हूं, आपका स्वास्थ्य साथी। मैं आज आपकी कैसे मदद कर सकता हूं?",
    },
  };

  const t = content[language];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    setMessages([{ role: "assistant", content: t.welcome }]);
  }, [language]);

  const streamChat = async (userMessage: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
    
    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          language,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: language === "hi" ? "सीमा पार" : "Rate Limit",
            description: language === "hi" 
              ? "कृपया थोड़ी देर बाद पुनः प्रयास करें।"
              : "Please try again later.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: language === "hi" ? "भुगतान आवश्यक" : "Payment Required",
            description: language === "hi"
              ? "कृपया अपने वर्कस्पेस में क्रेडिट जोड़ें।"
              : "Please add credits to your workspace.",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";
      let streamDone = false;

      while (!streamDone && reader) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi"
          ? "संदेश भेजने में विफल। कृपया पुनः प्रयास करें।"
          : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    await streamChat(userMessage);
    setIsLoading(false);
  };

  if (showHospitalFinder) {
    return (
      <HospitalFinder
        onBack={() => setShowHospitalFinder(false)}
        language={language}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white px-4 py-4 shadow-soft">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img src={logo} alt="Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold">{t.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant={language === "en" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onLanguageChange("en")}
              className="text-white hover:bg-white/20"
            >
              EN
            </Button>
            <Button
              variant={language === "hi" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onLanguageChange("hi")}
              className="text-white hover:bg-white/20"
            >
              हि
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="container mx-auto max-w-3xl">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 bg-secondary-light border-t">
        <div className="container mx-auto max-w-3xl flex gap-2 overflow-x-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHospitalFinder(true)}
            className="whitespace-nowrap"
          >
            <MapPin className="h-4 w-4 mr-2" />
            {t.findHospitals}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("tel:+911234567890")}
            className="whitespace-nowrap"
          >
            <Phone className="h-4 w-4 mr-2" />
            {t.tele}
          </Button>
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-4 bg-card border-t shadow-soft">
        <div className="container mx-auto max-w-3xl flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={t.placeholder}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
