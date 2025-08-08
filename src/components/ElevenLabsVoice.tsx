import { useEffect, useState } from "react";
import { useConversation } from "@11labs/react";
import { toast } from "@/hooks/use-toast";

interface ElevenLabsVoiceProps {
  onSpeakingChange: (isSpeaking: boolean) => void;
  onListeningChange: (isListening: boolean) => void;
  onTranscript: (text: string) => void;
}

export const ElevenLabsVoice = ({ 
  onSpeakingChange, 
  onListeningChange, 
  onTranscript 
}: ElevenLabsVoiceProps) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [agentId, setAgentId] = useState<string>("");
  const [isConfigured, setIsConfigured] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      toast({
        title: "Voice Connected",
        description: "You can now speak with MentorAI using voice."
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      onSpeakingChange(false);
      onListeningChange(false);
    },
    onMessage: (message) => {
      console.log("Message received:", message);
      if (message.source === "user" && message.message) {
        onTranscript(message.message);
      }
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      toast({
        title: "Voice Error",
        description: "There was an issue with the voice connection.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (conversation.isSpeaking !== undefined) {
      onSpeakingChange(conversation.isSpeaking);
    }
  }, [conversation.isSpeaking, onSpeakingChange]);

  // Mock configuration for demo - replace with actual API key input
  useEffect(() => {
    // In production, you would collect these from user input or environment
    const mockApiKey = "your-elevenlabs-api-key";
    const mockAgentId = "your-agent-id";
    
    if (mockApiKey && mockAgentId) {
      setApiKey(mockApiKey);
      setAgentId(mockAgentId);
      setIsConfigured(true);
    }
  }, []);

  const startConversation = async () => {
    if (!isConfigured) {
      toast({
        title: "Configuration Required",
        description: "Please configure your ElevenLabs API key and Agent ID.",
        variant: "destructive"
      });
      return;
    }

    try {
      // For demo purposes, we'll simulate the conversation
      // In production, replace with actual ElevenLabs conversation start
      console.log("Starting conversation with ElevenLabs");
      onListeningChange(true);
      
      // Mock: simulate listening for 3 seconds then stop
      setTimeout(() => {
        onListeningChange(false);
        onTranscript("Hello MentorAI, I'd like to learn about machine learning.");
      }, 3000);
      
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to ElevenLabs. Please check your configuration.",
        variant: "destructive"
      });
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      onSpeakingChange(false);
      onListeningChange(false);
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  return {
    startConversation,
    endConversation,
    status: conversation.status,
    isConfigured
  };
};