import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  images: string[];
}

const PhotoSlideshow = ({ images }: Props) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div
      className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden"
      style={{
        boxShadow: "0 25px 60px -15px hsl(340, 60%, 15%, 0.8), 0 0 40px hsl(340, 80%, 50%, 0.15)",
        border: "2px solid hsl(340, 50%, 30%)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      {/* Romantic overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, hsl(340, 40%, 10%, 0.4), transparent 40%)",
        }}
      />

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              animate={{
                width: i === current ? 20 : 8,
                backgroundColor: i === current ? "hsl(340, 82%, 65%)" : "hsl(340, 30%, 50%)",
              }}
              style={{ height: 8 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoSlideshow;
