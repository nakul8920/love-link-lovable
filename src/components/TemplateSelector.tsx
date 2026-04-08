import { motion } from "framer-motion";
import { Heart, Cake, Sparkles, Gift, Lock } from "lucide-react";
import { TemplateType } from "@/types/wish";

const templates: { type: TemplateType; label: string; icon: React.ReactNode; gradient: string; description: string; available: boolean }[] = [
  { type: "valentine", label: "Valentine", icon: <Heart className="w-8 h-8" />, gradient: "gradient-romantic", description: "Floating hearts & romance", available: true },
  { type: "birthday", label: "Birthday", icon: <Cake className="w-8 h-8" />, gradient: "gradient-birthday", description: "Confetti & balloons", available: true },
  { type: "anniversary", label: "Anniversary", icon: <Sparkles className="w-8 h-8" />, gradient: "gradient-anniversary", description: "Romantic particles & glow", available: true },
  { type: "surprise", label: "Surprise", icon: <Gift className="w-8 h-8" />, gradient: "gradient-surprise", description: "Fun animated reveal", available: true },
];

interface Props {
  selected: TemplateType | null;
  onSelect: (type: TemplateType) => void;
}

const TemplateSelector = ({ selected, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {templates.map((t, i) => (
        <motion.button
          key={t.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => t.available && onSelect(t.type)}
          disabled={!t.available}
          className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
            !t.available
              ? "border-border bg-muted/50 cursor-not-allowed opacity-60"
              : selected === t.type
              ? "border-primary shadow-glow bg-card"
              : "border-border bg-card hover:border-primary/40 hover:shadow-card-hover"
          }`}
        >
          {!t.available && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              <Lock className="w-3 h-3" />
              Coming Soon
            </div>
          )}
          <div className={`w-14 h-14 rounded-xl ${t.gradient} flex items-center justify-center mb-4 text-primary-foreground ${!t.available ? "grayscale" : ""}`}>
            {t.icon}
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">{t.label}</h3>
          <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
          {t.available && selected === t.type && (
            <motion.div
              layoutId="selected-check"
              className="absolute top-3 right-3 w-6 h-6 rounded-full gradient-primary flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default TemplateSelector;
