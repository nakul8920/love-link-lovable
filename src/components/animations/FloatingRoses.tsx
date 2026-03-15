import { motion } from "framer-motion";
import { useMemo } from "react";

const FloatingRoses = () => {
  const petals = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 8 + Math.random() * 16,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 6,
    rotate: Math.random() * 360,
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "-5vh", x: `${p.x}vw`, opacity: 0, rotate: p.rotate }}
          animate={{
            y: "110vh",
            opacity: [0, 0.4, 0.4, 0],
            rotate: p.rotate + 360,
            x: [`${p.x}vw`, `${p.x + 5}vw`, `${p.x - 3}vw`, `${p.x + 2}vw`],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute"
        >
          <div
            className="rounded-full"
            style={{
              width: p.size,
              height: p.size * 1.3,
              background: `radial-gradient(ellipse, hsl(340, 70%, 55%), hsl(350, 60%, 40%))`,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingRoses;
