import React, { useEffect, useState } from "react";

const SnowOverlay = () => {
  const [flakes, setFlakes] = useState<any[]>([]);

  useEffect(() => {
    const snow = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: `${Math.random() * 0.5 + 0.2}rem`,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setFlakes(snow);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="absolute top-[-10%] rounded-full bg-white blur-[1px]"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animation: `snow-fall ${f.animationDuration} linear infinite`,
            animationDelay: f.animationDelay,
          }}
        />
      ))}
      <style>{`
        @keyframes snow-fall {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(50vh) translateX(20px); }
          100% { transform: translateY(110vh) translateX(-20px); }
        }
      `}</style>
    </div>
  );
};
export default SnowOverlay;
