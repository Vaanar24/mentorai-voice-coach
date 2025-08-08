import React, { useState, useCallback } from "react";
import { VoiceInput } from "./VoiceInput";
import { Avatar3D } from "./Avatar3D";
import { ElevenLabsVoice } from "./ElevenLabsVoice";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// AI Response function using Supabase Edge Function
const getAIResponse = async (userMessage: string): Promise<string> => {
  try {
    // Try to call the Supabase Edge Function
    const response = await fetch(`${window.location.origin}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.response;
    }
  } catch (error) {
    console.error('Error calling AI API:', error);
  }
  
  // Fallback responses for common interactions
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm MentorAI, your personal training mentor. I'm here to help you learn about any topic you're curious about. What would you like to explore today?";
  }
  
  if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you do')) {
    return "I'm doing great, thank you for asking! I'm excited to help you learn something new today. What subject interests you?";
  }
  
  if (lowerMessage.includes('thank you') || lowerMessage.includes('thanks')) {
    return "You're very welcome! I'm always happy to help you learn. Is there anything else you'd like to know about?";
  }
  
  if (lowerMessage.includes('goodbye') || lowerMessage.includes('bye')) {
    return "Goodbye! It was great helping you learn today. Feel free to come back anytime you have more questions!";
  }
  
  if (lowerMessage.includes('what') && lowerMessage.includes('your name')) {
    return "I'm MentorAI! I'm your personal AI training mentor, designed to help you learn and understand various topics. What would you like to learn about?";
  }
  
  if (lowerMessage.includes('quantum')) {
    return "Quantum physics is fascinating! It's the study of matter and energy at the smallest scales, where particles behave in ways that seem impossible in our everyday world. Would you like to explore quantum entanglement or wave-particle duality?";
  }
  
  if (lowerMessage.includes('calculus')) {
    return "Calculus is the mathematical study of change and motion! It has two main branches: differential calculus (rates of change) and integral calculus (accumulation). What aspect would you like to dive into?";
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return "I can help you learn about virtually any topic! Just ask me questions about science, math, history, programming, or anything else you're curious about. What interests you most?";
  }
  
  return `That's an interesting question about "${userMessage}"! I'd love to help you understand this better. Could you tell me more about what specific aspect you'd like to learn, or would you like me to give you a general overview?`;
};

export const MentorAIInterface = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleUserMessage = useCallback(async (content: string) => {
    setIsLoading(true);

    try {
      // Get AI response from Supabase Edge Function
      const aiResponse = await getAIResponse(content);
      
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};