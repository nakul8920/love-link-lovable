import React, { useEffect, useState } from "react";

const RainOverlay = () => {
  const [drops, setDrops] = useState<any[]>([]);

  useEffect(() => {
    const r = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 0.5 + 0.5}s`,
      animationDelay: `${Math.random() * 2}s`,
      height: `${Math.random() * 20 + 20}px`,
      opacity: Math.random() * 0.4 + 0.1
    }));
    setDrops(r);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen bg-blue-900/10">
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute top-[-10%] bg-white rounded-full w-[2px]"
          style={{
            left: d.left,
            height: d.height,
            opacity: d.opacity,
            animation: `rain-fall ${d.animationDuration} linear infinite`,
            animationDelay: d.animationDelay,
          }}
        />
      ))}
      <style>{`
        @keyframes rain-fall {
          0% { transform: translateY(0) rotate(15deg); }
          100% { transform: translateY(110vh) rotate(15deg); }
        }
      `}</style>
    </div>
  );
};
export default RainOverlay;
