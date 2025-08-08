import { useState, useCallback } from "react";
import { MessageHistory, Message } from "./MessageHistory";
import { VoiceInput } from "./VoiceInput";
import { LearningContext } from "./LearningContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock webhook function - replace with actual webhook call
const mockWebhookCall = async (userMessage: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock responses based on keywords
  if (userMessage.toLowerCase().includes("quantum")) {
    return "Quantum physics is fascinating! Quantum entanglement is a phenomenon where two particles become connected in such a way that the quantum state of each particle cannot be described independently. When you measure one particle, you instantly know the state of the other, regardless of the distance between them. Think of it like having two magical coins that always land on opposite sides - if one shows heads, the other will always show tails, no matter how far apart they are!";
  }
  
  if (userMessage.toLowerCase().includes("calculus")) {
    return "Calculus is the mathematical study of change and motion! It has two main branches: differential calculus (dealing with rates of change and slopes) and integral calculus (dealing with areas and accumulation). Think of derivatives as asking 'how fast is something changing right now?' and integrals as asking 'how much has accumulated over time?' It's like being able to precisely measure the speed of a car at any instant, or calculate exactly how far it traveled.";
  }

  return `That's an excellent question! I understand you're asking about "${userMessage}". Let me break this down for you in a way that's easy to understand. This topic involves several key concepts that build upon each other. Would you like me to start with the fundamentals, or do you have a specific aspect you'd like to explore first?`;
};

export const MentorAIInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const handleUserMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call webhook (mocked for demo)
      const aiResponse = await mockWebhookCall(content);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling webhook:", error);
      toast({
        title: "Connection Error",
        description: "Unable to reach MentorAI. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePlayAudio = useCallback(async (content: string) => {
    // Mock audio playback - replace with ElevenLabs integration
    const messageId = `audio-${Date.now()}`;
    setPlayingAudioId(messageId);
    
    // Simulate audio duration
    setTimeout(() => {
      setPlayingAudioId(null);
    }, 3000);

    toast({
      title: "Audio Playback",
      description: "This would play the message using ElevenLabs TTS."
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-ai">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MentorAI</h1>
              <p className="text-sm text-muted-foreground">Your Personal Training Mentor</p>
            </div>
          </div>
          
          <Badge variant="outline" className="border-primary/30 text-primary">
            <Sparkles className="w-3 h-3 mr-1" />
            Active Learning Mode
          </Badge>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full flex gap-6 p-6">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col bg-gradient-card border-primary/10 shadow-card overflow-hidden">
            <MessageHistory 
              messages={messages}
              onPlayAudio={handlePlayAudio}
              isPlayingAudio={playingAudioId}
            />
            
            {/* Voice Input Area */}
            <div className="border-t border-border/50 p-6 bg-background/50 backdrop-blur-sm">
              <VoiceInput 
                onTranscript={handleUserMessage}
                isLoading={isLoading}
              />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="w-80 flex flex-col gap-4">
          <LearningContext onSuggestionClick={handleUserMessage} />
          
          {/* Status Card */}
          <Card className="p-4 bg-gradient-card border-primary/10 shadow-card">
            <h3 className="font-semibold text-foreground mb-2">Session Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Messages:</span>
                <span className="text-foreground">{messages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode:</span>
                <span className="text-primary">Voice Interactive</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-secondary">Ready</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};