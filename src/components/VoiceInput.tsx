import React, { useState, useRef } from "react";
import { Mic, MicOff, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isLoading?: boolean;
}

export const VoiceInput = ({ onTranscript, isLoading = false }: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      console.error("Microphone permission denied:", error);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      // First check if we have permission
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        alert("Microphone access is required for voice interaction. Please allow microphone access and try again.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        
        // Mock transcription for demo - replace with actual speech-to-text service
        setTimeout(() => {
          onTranscript("Hello MentorAI, can you help me understand quantum physics?");
          setIsProcessing(false);
        }, 1500);

        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Unable to access microphone. Please check your browser permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const isDisabled = isLoading || isProcessing;

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={toggleRecording}
        disabled={isDisabled}
        variant="outline"
        size="lg"
        className={cn(
          "w-16 h-16 rounded-full border-2 transition-all duration-300",
          "hover:scale-105 active:scale-95",
          isRecording && "animate-recording-pulse shadow-user",
          isProcessing && "animate-pulse-glow",
          !isRecording && !isProcessing && "shadow-card hover:shadow-ai"
        )}
      >
        {isProcessing ? (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : isRecording ? (
          <Square className="w-6 h-6 text-secondary" />
        ) : (
          <Mic className="w-6 h-6 text-primary" />
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {isProcessing ? (
            "Processing your voice..."
          ) : isRecording ? (
            "Recording... Click to stop"
          ) : (
            "Click to speak with MentorAI"
          )}
        </p>
        {isRecording && (
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
            <div className="w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>
    </div>
  );
};