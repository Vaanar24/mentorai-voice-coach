import React, { useEffect, useState } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Text-to-Speech using Web Speech API as fallback
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.onstart = () => {
        onSpeakingChange(true);
      };
      
      utterance.onend = () => {
        onSpeakingChange(false);
      };
      
      utterance.onerror = () => {
        onSpeakingChange(false);
        toast({
          title: "Speech Error",
          description: "Unable to play voice. Please check your browser settings.",
          variant: "destructive"
        });
      };

      // Configure voice settings
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech Not Supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive"
      });
    }
  };

  // Speech-to-Text using Web Speech API
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        onListeningChange(true);
        toast({
          title: "Listening",
          description: "Speak now..."
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        onListeningChange(false);
      };

      recognition.onerror = (event: any) => {
        onListeningChange(false);
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'not-allowed') {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use voice features.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Speech Recognition Error",
            description: `Error: ${event.error}`,
            variant: "destructive"
          });
        }
      };

      recognition.onend = () => {
        onListeningChange(false);
      };

      recognition.start();
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        try {
          recognition.stop();
        } catch (e) {
          // Recognition may already be stopped
        }
      }, 10000);
      
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    // Initialize speech synthesis voices
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          setIsInitialized(true);
        }
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  return {
    speak,
    startListening,
    isInitialized
  };
};