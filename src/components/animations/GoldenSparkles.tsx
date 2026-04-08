import { motion } from "framer-motion";
import { useMemo } from "react";

const GoldenSparkles = () => {
  const sparkles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() > 0.8 ? 4 + Math.random() * 4 : 2 + Math.random() * 3, // some larger, mostly smaller
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 4,
    color: Math.random() > 0.5 ? "hsl(45, 100%, 60%)" : "hsl(35, 100%, 75%)",
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: `0 0 ${s.size * 4}px ${s.color}`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0],
            y: [0, -40, 0] // floating slightly up
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default GoldenSparkles;
