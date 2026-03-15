import { motion } from "framer-motion";
import { Heart, ArrowRight, Sparkles, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-primary/10"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-40 right-[15%] w-10 h-10 rounded-full bg-accent/10"
        />
        <motion.div
          animate={{ y: [-15, 25, -15] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-40 left-[20%] w-12 h-12 rounded-full bg-primary/8"
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-5">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" />
          <span className="font-display text-xl font-bold text-foreground">WishLink</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin")}
          className="rounded-full border-border text-muted-foreground hover:text-foreground"
        >
          Admin
        </Button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center text-center px-6 pt-16 sm:pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> Create magical wishes
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight max-w-4xl"
        >
          Send personalized{" "}
          <span className="text-gradient">animated wishes</span>{" "}
          to your loved ones
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed"
        >
          Create beautiful animated pages for birthdays, valentines, anniversaries & surprises — with photos, messages, and a shareable link.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10"
        >
          <Button
            size="lg"
            onClick={() => navigate("/create")}
            className="h-14 px-8 rounded-full gradient-primary text-primary-foreground text-lg font-semibold shadow-glow hover:opacity-90 transition-opacity group"
          >
            Create Your Wish Page
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Template Previews */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl w-full"
        >
          {[
            { label: "Valentine", gradient: "gradient-romantic", icon: <Heart className="w-8 h-8" />, available: true },
            { label: "Birthday", gradient: "gradient-birthday", icon: <Gift className="w-8 h-8" />, available: false },
            { label: "Anniversary", gradient: "gradient-anniversary", icon: <Sparkles className="w-8 h-8" />, available: false },
            { label: "Surprise", gradient: "gradient-surprise", icon: <Gift className="w-8 h-8" />, available: false },
          ].map((t, i) => (
            <motion.div
              key={t.label}
              whileHover={t.available ? { y: -8, scale: 1.02 } : {}}
              className={`${t.gradient} rounded-2xl p-6 text-primary-foreground text-center shadow-card relative ${
                t.available ? "cursor-pointer" : "cursor-not-allowed opacity-50 grayscale"
              }`}
              onClick={() => t.available && navigate("/create")}
            >
              {!t.available && (
                <span className="absolute top-2 right-2 bg-background/80 text-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              )}
              <div className="mb-3 flex justify-center">{t.icon}</div>
              <span className="font-display font-semibold text-sm">{t.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 max-w-3xl w-full"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-10">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create", desc: "Choose a template, add names, message & photos" },
              { step: "2", title: "Pay", desc: "Complete a small payment to generate your page" },
              { step: "3", title: "Share", desc: "Get a unique link and share it instantly" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full gradient-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6 text-center text-sm text-muted-foreground">
        © 2026 WishLink. Made with <Heart className="w-3 h-3 inline text-primary fill-primary" /> 
      </footer>
    </div>
  );
};

export default LandingPage;
