import React, { useEffect, useState } from "react";

const FireflyOverlay = () => {
  const [flies, setFlies] = useState<any[]>([]);

  useEffect(() => {
    const f = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: `${Math.random() * 4 + 2}px`,
    }));
    setFlies(f);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen">
      {flies.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full bg-yellow-300"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            boxShadow: "0 0 10px 2px #fde047",
            animation: `firefly-drift ${f.animationDuration} ease-in-out infinite alternate, firefly-flash ${f.animationDuration} ease-in-out infinite alternate`,
            animationDelay: f.animationDelay,
          }}
        />
      ))}
      <style>{`
        @keyframes firefly-drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
        }
        @keyframes firefly-flash {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
export default FireflyOverlay;
