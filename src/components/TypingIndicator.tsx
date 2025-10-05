const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="bg-secondary-light rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
          <div
            className="w-2 h-2 bg-primary rounded-full animate-pulse-soft"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="w-2 h-2 bg-primary rounded-full animate-pulse-soft"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
