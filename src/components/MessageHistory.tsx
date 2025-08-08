import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Bot, User, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface MessageHistoryProps {
  messages: Message[];
  onPlayAudio?: (content: string) => void;
  isPlayingAudio?: string | null;
}

export const MessageHistory = ({ 
  messages, 
  onPlayAudio, 
  isPlayingAudio 
}: MessageHistoryProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Bot className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Welcome to MentorAI
          </h3>
          <p className="text-muted-foreground">
            I'm your personal AI training mentor. Start a conversation by clicking the microphone button below and ask me anything!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3 animate-slide-up",
            message.sender === "user" ? "justify-end" : "justify-start"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {message.sender === "ai" && (
            <Avatar className="w-8 h-8 border-2 border-primary shadow-ai">
              <AvatarFallback className="bg-gradient-primary text-white">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          )}

          <Card 
            className={cn(
              "max-w-[80%] p-4 shadow-card",
              message.sender === "user" 
                ? "bg-gradient-secondary text-secondary-foreground shadow-user" 
                : "bg-gradient-card border-primary/20"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm leading-relaxed">{message.content}</p>
              
              {message.sender === "ai" && onPlayAudio && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPlayAudio(message.content)}
                  disabled={isPlayingAudio === message.id}
                  className="h-6 w-6 p-0 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Volume2 
                    className={cn(
                      "w-3 h-3",
                      isPlayingAudio === message.id && "animate-pulse text-primary"
                    )} 
                  />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs opacity-60">
                {message.sender === "user" ? "You" : "MentorAI"}
              </span>
              <span className="text-xs opacity-40">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </Card>

          {message.sender === "user" && (
            <Avatar className="w-8 h-8 border-2 border-secondary shadow-user">
              <AvatarFallback className="bg-gradient-secondary text-secondary-foreground">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
    </div>
  );
};