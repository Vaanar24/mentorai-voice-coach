import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, HelpCircle, Lightbulb, Brain } from "lucide-react";

interface LearningContextProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    category: "Physics",
    icon: Brain,
    items: [
      "Explain quantum entanglement",
      "How do black holes work?",
      "What is the theory of relativity?"
    ]
  },
  {
    category: "Mathematics",
    icon: BookOpen,
    items: [
      "Teach me calculus basics",
      "Explain linear algebra",
      "What are derivatives?"
    ]
  },
  {
    category: "General",
    icon: Lightbulb,
    items: [
      "Give me a quick quiz",
      "How can I study more effectively?",
      "What should I learn next?"
    ]
  }
];

export const LearningContext = ({ onSuggestionClick }: LearningContextProps) => {
  return (
    <Card className="p-6 bg-gradient-card border-primary/10 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Learning Suggestions</h3>
      </div>

      <div className="space-y-4">
        {suggestions.map((category) => (
          <div key={category.category} className="space-y-2">
            <div className="flex items-center gap-2">
              <category.icon className="w-4 h-4 text-muted-foreground" />
              <Badge variant="outline" className="text-xs">
                {category.category}
              </Badge>
            </div>
            
            <div className="grid gap-2">
              {category.items.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  size="sm"
                  className="h-auto p-2 text-left justify-start text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Click any suggestion above or use the microphone to ask your own questions.
        </p>
      </div>
    </Card>
  );
};