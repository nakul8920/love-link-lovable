import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { TemplateType } from "@/types/wish";
import FloatingHearts from "@/components/animations/FloatingHearts";
import LoveLetterReveal from "@/components/animations/LoveLetterReveal";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import HeartDivider from "@/components/animations/HeartDivider";
import FloatingRoses from "@/components/animations/FloatingRoses";
import SparkleOverlay from "@/components/animations/SparkleOverlay";

interface AnimatedTemplateProps {
  type: TemplateType;
  senderName: string;
  receiverName: string;
  message: string;
  imageUrls: string[];
}

const AnimatedTemplate = ({ type, senderName, receiverName, message, imageUrls }: AnimatedTemplateProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[hsl(340,70%,15%)] via-[hsl(340,60%,20%)] to-[hsl(340,50%,10%)]">
      {/* Animated backgrounds */}
      <FloatingHearts />
      <FloatingRoses />
      <SparkleOverlay />

      {/* Main content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 py-8 sm:py-12"
          >
            {/* Top decorative heart */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3, duration: 1 }}
              className="mb-6"
            >
              <svg width="60" height="60" viewBox="0 0 24 24" fill="hsl(340, 82%, 52%)" className="drop-shadow-[0_0_20px_hsl(340,82%,52%,0.6)]">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>

            {/* "For You" label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-2"
            >
              <span className="text-[hsl(340,80%,75%)] text-sm font-body tracking-[0.3em] uppercase">
                A special message for
              </span>
            </motion.div>

            {/* Receiver name - Hero */}
            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
              className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-center mb-2 leading-tight"
              style={{
                background: "linear-gradient(135deg, hsl(340, 90%, 70%), hsl(350, 100%, 85%), hsl(20, 100%, 80%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px hsl(340, 82%, 52%, 0.3))",
              }}
            >
              {receiverName}
            </motion.h1>

            <HeartDivider delay={1} />

            {/* Love Letter Card */}
            <LoveLetterReveal message={message} delay={1.3} />

            {/* Photo Section */}
            {imageUrls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="w-full max-w-md mx-auto mb-8"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                  className="text-center text-[hsl(340,70%,70%)] text-sm font-body tracking-widest uppercase mb-4"
                >
                  Our Memories ♥
                </motion.p>
                <PhotoSlideshow images={imageUrls} />
              </motion.div>
            )}

            <HeartDivider delay={2.5} />

            {/* Sender signature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8 }}
              className="text-center mt-4 mb-8"
            >
              <p className="text-[hsl(340,60%,60%)] font-body text-sm mb-1">Forever yours,</p>
              <p
                className="text-2xl sm:text-3xl font-display font-bold"
                style={{
                  background: "linear-gradient(135deg, hsl(340, 90%, 70%), hsl(350, 100%, 85%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {senderName}
              </p>
            </motion.div>

            {/* Animated beating heart at bottom */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
              className="mt-4"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="hsl(340, 82%, 52%)" className="drop-shadow-[0_0_15px_hsl(340,82%,52%,0.5)]">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>

            {/* WishLink branding */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 3.5 }}
              className="mt-8 text-xs text-[hsl(340,40%,50%)] font-body"
            >
              Made with ♥ on WishLink
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedTemplate;
