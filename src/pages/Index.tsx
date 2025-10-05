import { useState } from "react";
import Landing from "@/components/Landing";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  if (showChat) {
    return (
      <ChatInterface
        onBack={() => setShowChat(false)}
        language={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  return (
    <Landing
      onStartChat={() => setShowChat(true)}
      language={language}
      onLanguageChange={setLanguage}
    />
  );
};

export default Index;
