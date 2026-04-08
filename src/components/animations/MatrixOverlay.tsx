import React, { useEffect, useState } from "react";

const MatrixOverlay = () => {
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    const cols = Array.from({ length: Math.floor(window.innerWidth / 20) }).map((_, i) => ({
      id: i,
      left: `${i * 20}px`,
      animationDuration: `${Math.random() * 5 + 3}s`,
      animationDelay: `${Math.random() * 5}s`,
      chars: Array.from({ length: 20 }).map(() => chars[Math.floor(Math.random() * chars.length)]).join('\n')
    }));
    setColumns(cols);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50 bg-black/20">
      {columns.map((col) => (
        <div
          key={col.id}
          className="absolute top-[-50%] text-green-500 font-mono text-sm whitespace-pre-wrap leading-[1em] tracking-[0.2em]"
          style={{
            left: col.left,
            animation: `matrix-fall ${col.animationDuration} linear infinite`,
            animationDelay: col.animationDelay,
            textShadow: "0 0 5px #22c55e",
            opacity: Math.random() * 0.5 + 0.3
          }}
        >
          {col.chars}
        </div>
      ))}
      <style>{`
        @keyframes matrix-fall {
          0% { transform: translateY(0); }
          100% { transform: translateY(150vh); }
        }
      `}</style>
    </div>
  );
};
export default MatrixOverlay;
