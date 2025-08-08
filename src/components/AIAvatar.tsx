import { useState, useRef, useEffect } from "react";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  className?: string;
}

export const AIAvatar = ({ isSpeaking, isListening, className }: AIAvatarProps) => {
  const [mouthAnimation, setMouthAnimation] = useState(0);
  const [eyeBlinkAnimation, setEyeBlinkAnimation] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const blinkIntervalRef = useRef<NodeJS.Timeout>();

  // Mouth animation for speaking
  useEffect(() => {
    if (isSpeaking) {
      intervalRef.current = setInterval(() => {
        setMouthAnimation(Math.random() * 100);
      }, 150);
    } else {
      setMouthAnimation(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSpeaking]);

  // Eye blinking animation
  useEffect(() => {
    blinkIntervalRef.current = setInterval(() => {
      setEyeBlinkAnimation(true);
      setTimeout(() => setEyeBlinkAnimation(false), 150);
    }, 2000 + Math.random() * 3000);

    return () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Avatar Container */}
      <div className="relative w-48 h-64 mb-4">
        {/* Body */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-40 bg-gradient-primary rounded-t-3xl shadow-ai opacity-90" />
        
        {/* Head */}
        <div className={cn(
          "absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-32 bg-gradient-card rounded-full border-2 border-primary/20 shadow-card transition-all duration-300",
          isSpeaking && "animate-pulse-glow",
          isListening && "border-secondary animate-pulse"
        )}>
          {/* Eyes */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            <div className={cn(
              "w-3 h-3 bg-primary rounded-full transition-all duration-150",
              eyeBlinkAnimation && "h-0.5"
            )} />
            <div className={cn(
              "w-3 h-3 bg-primary rounded-full transition-all duration-150",
              eyeBlinkAnimation && "h-0.5"
            )} />
          </div>

          {/* Mouth */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div 
              className={cn(
                "w-4 h-2 bg-secondary rounded-full transition-all duration-150",
                isSpeaking && "animate-pulse"
              )}
              style={{
                transform: isSpeaking ? `scaleY(${0.5 + mouthAnimation / 200})` : 'scaleY(0.5)',
                width: isSpeaking ? `${12 + mouthAnimation / 10}px` : '16px'
              }}
            />
          </div>

          {/* Avatar Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Bot className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Voice Waves */}
        {isSpeaking && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-secondary rounded-full animate-pulse"
                style={{
                  height: `${20 + Math.sin(Date.now() / 200 + i) * 15}px`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        )}

        {/* Listening Indicator */}
        {isListening && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {isSpeaking ? (
            "MentorAI is speaking..."
          ) : isListening ? (
            "Listening to your question..."
          ) : (
            "Ready to help you learn"
          )}
        </p>
      </div>
    </div>
  );
};