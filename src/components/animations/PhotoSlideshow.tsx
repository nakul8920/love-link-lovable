import { motion } from "framer-motion";

interface Props {
  images: string[];
}

const PhotoSlideshow = ({ images }: Props) => {
  if (images.length === 0) return null;

  const captions = [
    "Sweet",
    "Beautiful",
    "Forever",
    "Smile!",
    "Memory",
    "Precious"
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-1 sm:px-6 py-6 sm:py-12">
      <div className="grid grid-cols-4 gap-2 sm:gap-6 md:gap-8 lg:gap-10 place-items-center w-full mx-auto pb-4">
        {images.map((img, i) => {
          const rotation = i % 2 === 0 ? "rotate-[-2deg] sm:rotate-[-3deg]" : "rotate-[2deg] sm:rotate-[3deg]";
          const tapeColor = i % 2 === 0 ? "bg-rose-200/80" : "bg-orange-100/80";
          const caption = captions[i % captions.length];
          
          return (
            <motion.div
              key={i}
              className={`relative bg-[#fcfcfc] p-1 pb-7 sm:p-2 sm:pb-12 lg:p-3 lg:pb-16 rounded-sm shadow-[0_5px_15px_-5px_rgba(0,0,0,0.15)] sm:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 hover:z-30 w-full cursor-pointer ${rotation} hover:rotate-0 hover:scale-110 group`}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              {/* Decorative Washi Tape */}
              <div 
                className={`absolute -top-1.5 sm:-top-3 left-1/2 -translate-x-1/2 w-8 sm:w-16 lg:w-20 h-2 sm:h-5 lg:h-6 ${tapeColor} shadow-sm backdrop-blur-sm transform rotate-[-4deg] z-20 mix-blend-multiply border border-white/20`}
                style={{ clipPath: 'polygon(0% 10%, 100% 0%, 95% 90%, 5% 100%)' }}
              />
              
              {/* Photo Image Container */}
              <div 
                className="w-full overflow-hidden relative shadow-inner bg-gray-100 rounded-[1px] ring-1 ring-black/5"
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src={img}
                  alt="Memory"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              
              {/* Cute handwriting-style caption */}
              <div className="absolute bottom-[2px] sm:bottom-2 left-0 w-full flex flex-col items-center justify-center pointer-events-none">
                 <p className="font-serif italic text-[8px] sm:text-xs md:text-sm lg:text-base text-gray-800 tracking-wide font-medium truncate w-full px-0.5 text-center leading-tight">
                    {caption}
                 </p>
                 <div className="flex gap-1 mt-0 sm:mt-0.5 text-rose-400/60">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[6px] h-[6px] sm:w-[10px] sm:h-[10px] lg:w-[12px] lg:h-[12px]">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                 </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PhotoSlideshow;
