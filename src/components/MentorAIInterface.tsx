import React, { useState, useCallback } from "react";
import { VoiceInput } from "./VoiceInput";
import { Avatar3D } from "./Avatar3D";
import { ElevenLabsVoice } from "./ElevenLabsVoice";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock AI response function
const mockAIResponse = async (userMessage: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (userMessage.toLowerCase().includes("quantum")) {
    return "Quantum physics involves the study of matter and energy at the smallest scales, where particles behave in ways that seem impossible in our everyday world.";
  }
  
  if (userMessage.toLowerCase().includes("calculus")) {
    return "Calculus is the mathematical study of change and motion, with two main branches: differential and integral calculus.";
  }

  return `That's an interesting question about "${userMessage}". Let me explain the key concepts and help you understand this topic better.`;
};

export const MentorAIInterface = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleUserMessage = useCallback(async (content: string) => {
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await mockAIResponse(content);
      
      // Speak the response using Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
      }
      
      toast({
        title: "Message Processed",
        description: `You asked: "${content}"`
      });
      
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Processing Error",
        description: "Unable to process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize voice service
  const voiceService = ElevenLabsVoice({
    onSpeakingChange: setIsSpeaking,
    onListeningChange: setIsListening,
    onTranscript: handleUserMessage
  });


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
              <p className="text-sm text-muted-foreground">Your 3D Interactive Training Mentor</p>
            </div>
          </div>
          
          <Badge variant="outline" className="border-primary/30 text-primary">
            <Sparkles className="w-3 h-3 mr-1" />
            Voice Mode Active
          </Badge>
        </div>
      </header>

      {/* Main Interface */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            
            {/* 3D Avatar */}
            <div className="lg:col-span-2">
              <Card className="h-full bg-gradient-card border-primary/10 shadow-card p-6">
                <Avatar3D 
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                />
              </Card>
            </div>

            {/* Voice Controls */}
            <div className="flex flex-col gap-4">
              <Card className="p-6 bg-gradient-card border-primary/10 shadow-card">
                <h3 className="text-lg font-semibold text-foreground mb-4">Voice Interaction</h3>
                <VoiceInput 
                  onTranscript={handleUserMessage}
                  isLoading={isLoading}
                />
              </Card>

              {/* Status */}
              <Card className="p-4 bg-gradient-card border-primary/10 shadow-card">
                <h3 className="font-semibold text-foreground mb-2">Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mode:</span>
                    <span className="text-primary">3D Voice Interactive</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`${isSpeaking ? 'text-secondary' : isListening ? 'text-accent' : 'text-primary'}`}>
                      {isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Ready'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Voice:</span>
                    <span className="text-secondary">
                      {voiceService.isInitialized ? 'Available' : 'Initializing...'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};