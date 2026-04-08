import { motion } from "framer-motion";
import { useMemo } from "react";

// Soft pastel & vibrant birthday colors
const confettiColors = ["#ff0844", "#ff90e8", "#fca5a5", "#fda4af", "#fecdd3", "#c084fc", "#fde047", "#86efac", "#60a5fa"];
const shapes = ["star", "heart", "sparkle"];

const ConfettiOverlay = () => {
  const pieces = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100, // random start X %
    y: -10 - Math.random() * 20, // initial Y above screen
    size: 12 + Math.random() * 20, // larger size for visible birthday shapes
    delay: Math.random() * 10,
    duration: 6 + Math.random() * 6,
    rot: Math.random() * 360,
    sway: (Math.random() - 0.5) * 50,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {pieces.map((p, index) => (
        <motion.div
          key={p.id}
          initial={{ y: `${p.y}vh`, x: `${p.x}vw`, opacity: 0, rotate: p.rot }}
          animate={{
            y: "110vh",
            x: [`${p.x}vw`, `${p.x + p.sway / 100 * 20}vw`, `${p.x - p.sway / 100 * 10}vw`],
            opacity: [0, 1, 1, 0],
            rotate: [p.rot, p.rot + 180, p.rot + 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className={`absolute ${index % 3 !== 0 ? 'hidden sm:block' : ''}`}
        >
          {p.shape === "star" && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color} style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          )}
          {p.shape === "heart" && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color} style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          )}
          {p.shape === "sparkle" && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color} style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.15))" }}>
              <path d="M12 2l2.4 7.6H22l-6 4.8 2.4 7.6-6-4.8-6 4.8 2.4-7.6-6-4.8h7.6L12 2z"/>
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ConfettiOverlay;
