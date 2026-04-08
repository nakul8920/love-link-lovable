import { motion } from "framer-motion";
import { useMemo } from "react";

const balloonColors = ["#ff0844", "#ff90e8", "#fca5a5", "#fda4af", "#fecdd3"];

const FloatingBalloons = () => {
  const balloons = useMemo(() => Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 20 + Math.random() * 40,
    delay: Math.random() * 8,
    duration: 8 + Math.random() * 8,
    opacity: 0.6 + Math.random() * 0.4,
    sway: (Math.random() - 0.5) * 60,
    color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {balloons.map((b, index) => (
        <motion.div
          key={b.id}
          initial={{ y: "110vh", x: `${b.x}vw`, opacity: 0 }}
          animate={{
            y: "-15vh",
            x: [`${b.x}vw`, `${b.x + b.sway / 100 * 15}vw`, `${b.x}vw`],
            opacity: [0, b.opacity, b.opacity, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className={`absolute ${index % 2 !== 0 ? 'hidden sm:block' : ''}`}
        >
          <svg width={b.size} height={b.size * 1.5} viewBox="0 0 24 36" fill="none">
            {/* Balloon String */}
            <path d="M12 23 C10 26, 14 28, 12 32 C10 35, 12 36, 12 36" stroke="gray" strokeWidth="1" fill="none" />
            
            {/* Balloon Body */}
            <path d="M12 2C7 2 3 6.5 3 12.5C3 18.5 8 22 12 24C16 22 21 18.5 21 12.5C21 6.5 17 2 12 2Z" fill={b.color} stroke="black" strokeWidth="2" />
            
            {/* Balloon Highlight */}
            <path d="M8 6C9 5 10.5 4.5 12 4.5C10 5 8 7 8 10C8 8.5 8 7 8 6Z" fill="white" opacity="0.4" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingBalloons;
