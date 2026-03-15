import { motion } from "framer-motion";
import { useMemo } from "react";

const FloatingHearts = () => {
  const hearts = useMemo(() => Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 10 + Math.random() * 28,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 6,
    opacity: 0.15 + Math.random() * 0.35,
    sway: (Math.random() - 0.5) * 80,
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ y: "110vh", x: `${h.x}vw`, opacity: 0 }}
          animate={{
            y: "-10vh",
            x: [`${h.x}vw`, `${h.x + h.sway / 100 * 10}vw`, `${h.x}vw`],
            opacity: [0, h.opacity, h.opacity, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute"
        >
          <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill="hsl(340, 82%, 52%)">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
