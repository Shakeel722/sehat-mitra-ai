import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
  };
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-gradient-primary text-white rounded-br-md"
            : "bg-secondary-light text-foreground rounded-bl-md"
        )}
      >
        <p className="text-sm md:text-base whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
