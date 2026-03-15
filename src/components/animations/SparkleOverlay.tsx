import { motion } from "framer-motion";
import { useMemo } from "react";

const SparkleOverlay = () => {
  const sparkles = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 3,
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
            background: "hsl(340, 80%, 80%)",
            boxShadow: `0 0 ${s.size * 3}px hsl(340, 80%, 70%)`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

export default SparkleOverlay;
