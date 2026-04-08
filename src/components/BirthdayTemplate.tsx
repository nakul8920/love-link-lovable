import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import FloatingBalloons from "@/components/animations/FloatingBalloons";
import ConfettiOverlay from "@/components/animations/ConfettiOverlay";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";
import { Heart, Star, Sparkles, Award, Plane } from "lucide-react";

interface BirthdayTemplateProps {
  senderName: string;
  receiverName: string;
  message: string;
  imageUrls: string[];
}

const BirthdayTemplate = ({ senderName, receiverName, message, imageUrls }: BirthdayTemplateProps) => {
  const [stage, setStage] = useState<'start' | 'envelope' | 'opened'>('start');
  const [isOpening, setIsOpening] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);

  const handleOpenEnvelope = () => {
    setIsOpening(true);
    setTimeout(() => {
      setStage('opened');
    }, 1800); // Increased time for gorgeous zoom animation
  };

  return (
    <>
      {/* Import elegant fonts for the birthday theme */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Outfit:wght@300;400;600;800&display=swap');
          
          .font-script {
            font-family: 'Dancing Script', cursive;
          }
          .font-outfit {
            font-family: 'Outfit', sans-serif;
          }
        `}
      </style>

      <div className="min-h-[100dvh] relative overflow-hidden font-outfit selection:bg-pink-300 selection:text-black transition-colors duration-1000"
        style={{
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' // Bright festive pink/pastel birthday theme
        }}>

        {/* Subtle animated floating particles in the background for start screen */}
        {(stage === 'start' || stage === 'envelope') && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute bg-white rounded-full ${i % 2 !== 0 ? 'hidden sm:block' : ''}`}
                style={{
                  width: Math.random() * 4 + 2 + 'px',
                  height: Math.random() * 4 + 2 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STAGE 1: START SCREEN */}
          {stage === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6"
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 p-10 rounded-[2.5rem] shadow-[0_15px_40px_rgba(244,63,94,0.15)] text-center relative overflow-hidden"
              >
                {/* Decorative header icon */}
                <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-rose-400 to-pink-300 rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-white">
                  <span className="text-4xl text-white">🎁</span>
                </div>

                <h1 className="font-script text-5xl sm:text-6xl text-rose-600 drop-shadow-sm mb-4">
                  You've got a surprise!
                </h1>

                <p className="text-gray-700 text-lg sm:text-xl font-medium mb-10 px-4">
                  Tap below to uncover your birthday gift...
                </p>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(244, 63, 94, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStage('envelope')}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg transition-all"
                >
                  Start the Celebration!
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* STAGE 2: THE ENVELOPE */}
          {stage === 'envelope' && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4"
            >
              <div className="relative cursor-pointer group" onClick={handleOpenEnvelope}>

                <motion.div
                  animate={isOpening ? { scale: 3, opacity: 0, filter: "blur(10px)" } : { scale: 1, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, ease: "easeIn", delay: 0.9 }}
                  className="relative flex flex-col items-center origin-center"
                >
                  {/* CSS ENVELOPE */}
                  <div className="w-[300px] sm:w-[400px] h-[200px] sm:h-[260px] bg-[#fdf2f8] rounded-md shadow-2xl relative overflow-visible mt-20">

                    {/* Envelope Back/Inside (shows when flap opens) */}
                    <div className="absolute inset-0 bg-[#fbcfe8] rounded-md"></div>

                    {/* The Letter inside sliding up */}
                    <motion.div
                      className="absolute left-[5%] right-[5%] bottom-0 bg-white rounded-t-md shadow-inner flex flex-col items-center pt-8 px-4"
                      animate={isOpening ? { height: '180%', y: -80, opacity: 1 } : { height: '90%', y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: isOpening ? 0.4 : 0 }}
                      style={{ bottom: 0, zIndex: 10 }}
                    >
                      <Heart className="text-rose-400 w-12 h-12 opacity-50 mb-4" />
                      <p className="font-script text-3xl text-gray-800">For You</p>
                    </motion.div>

                    {/* Bottom Flap */}
                    <div className="absolute bottom-0 left-0 w-full h-[70%] bg-[#fce7f3] rounded-b-md z-20 shadow-[-5px_-5px_10px_rgba(0,0,0,0.03)]"
                      style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}></div>

                    {/* Left Flap */}
                    <div className="absolute top-0 left-0 w-[55%] h-full bg-[#fdf2f8] rounded-l-md z-20 shadow-[5px_0_10px_rgba(0,0,0,0.03)]"
                      style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>

                    {/* Right Flap */}
                    <div className="absolute top-0 right-0 w-[55%] h-full bg-[#fdf2f8] rounded-r-md z-20 shadow-[-5px_0_10px_rgba(0,0,0,0.03)]"
                      style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}></div>

                    {/* Top Flap (Animated) */}
                    <motion.div
                      className="absolute top-0 left-0 w-full h-[65%] bg-[#fbcfe8] rounded-t-md z-30 origin-top shadow-[0_5px_10px_rgba(0,0,0,0.08)]"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                      animate={isOpening ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 30 }}
                      transition={{ duration: 0.5, ease: "easeInOut", delay: isOpening ? 0.1 : 0 }}
                    />

                    {/* Wax Seal */}
                    <motion.div
                      className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-rose-500 rounded-full shadow-md z-40 flex items-center justify-center border-2 border-rose-600"
                      animate={isOpening ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Heart className="w-8 h-8 text-white fill-white" />
                    </motion.div>

                  </div>

                  {!isOpening && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="mt-12 text-center text-rose-600 font-semibold tracking-widest uppercase text-sm bg-white/60 px-6 py-2 rounded-full border border-rose-100 shadow-sm"
                    >
                      Tap the envelope to open
                    </motion.p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* STAGE 3: OPENED CONTENT */}
          {stage === 'opened' && (
            <motion.main
              key="content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative z-10 min-h-[100dvh] flex flex-col items-center py-16 px-4 sm:px-6 text-gray-800"
            >
              <FloatingBalloons />
              <ConfettiOverlay />

              {/* Soft decorative header */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-6 flex items-center gap-3"
              >
                <div className="h-[1px] w-12 bg-rose-300"></div>
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                <div className="h-[1px] w-12 bg-rose-300"></div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-center mb-12 flex flex-col items-center"
              >
                <span className="font-outfit font-bold tracking-widest uppercase text-rose-500 text-lg sm:text-xl mb-2">
                  Happy Birthday
                </span>
                <span className="font-script text-6xl sm:text-8xl md:text-9xl text-gray-800 drop-shadow-sm px-4">
                  {receiverName}
                </span>
              </motion.h1>

              {/* Interactive Responsive 3D Greeting Card */}
              <div className="w-full flex justify-center mb-24 mt-4 sm:mt-8" style={{ perspective: '2000px', touchAction: 'pan-y' }}>
                <style>{`
                  .book-wrapper {
                    transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1);
                    transform-style: preserve-3d;
                  }
                  .book-wrapper.closed {
                    transform: translateX(0) rotateY(5deg) scale(0.95);
                  }
                  /* Mobile: Less translate, scale down to prevent horizontal overflow */
                  .book-wrapper.open {
                    transform: translateX(10%) rotateY(-5deg) rotateX(2deg) scale(0.85);
                  }
                  /* Tablet/Desktop: Normal translate and scale */
                  @media (min-width: 640px) {
                    .book-wrapper.open {
                      transform: translateX(25%) rotateY(-5deg) rotateX(2deg) scale(1);
                    }
                  }

                  .book-cover {
                    transform-origin: left center;
                    transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
                    transform-style: preserve-3d;
                  }
                  .book-cover.closed {
                    transform: rotateY(0deg);
                  }
                  /* Less wide angle on mobile so it doesn't break the left screen edge */
                  .book-cover.open {
                    transform: rotateY(-130deg);
                  }
                  @media (min-width: 640px) {
                    .book-cover.open {
                      transform: rotateY(-165deg);
                    }
                  }
                `}</style>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className={`relative w-[280px] sm:w-full sm:max-w-[340px] aspect-[1/1.4] book-wrapper ${isCardOpen ? 'open' : 'closed'}`}
                >
                  {/* Front Cover (Rotates Open) */}
                  <div 
                    className={`absolute inset-0 w-full h-full cursor-pointer z-20 book-cover ${isCardOpen ? 'open' : 'closed'}`}
                    onClick={() => setIsCardOpen(!isCardOpen)}
                  >
                    {/* Front Outer Face */}
                    <div 
                      className="absolute inset-0 w-full h-full bg-gradient-to-br from-rose-400 to-pink-600 rounded-r-2xl rounded-l-[4px] flex flex-col items-center justify-center p-5 sm:p-6 border-l-[12px] border-rose-800/20"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        boxShadow: isCardOpen ? '-10px 10px 20px rgba(0,0,0,0.1)' : '5px 15px 30px rgba(0,0,0,0.15)'
                      }}
                    >
                      <div className="border border-white/40 w-full h-full rounded-r-xl outline outline-[1px] outline-offset-4 outline-white/20 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-[40px]"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-[40px]"></div>
                        
                        <h3 className="font-script text-5xl sm:text-6xl text-white text-center leading-tight drop-shadow-md z-10 px-2 pb-4">
                          For You,<br/><span className="text-4xl sm:text-5xl">{receiverName}</span>
                        </h3>
                        
                        {!isCardOpen && (
                          <div className="absolute bottom-6 animate-bounce bg-white/20 backdrop-blur-md px-5 py-2 rounded-full border border-white/40 z-10 shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
                            <span className="font-outfit text-white text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">Tap to Open</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Front Inner Face (Back of the cover) */}
                    <div 
                      className="absolute inset-0 w-full h-full bg-pink-50 rounded-l-2xl rounded-r-[4px] shadow-inner overflow-hidden border border-pink-200"
                      style={{ 
                        backfaceVisibility: 'hidden', 
                        transform: 'rotateY(180deg)' 
                      }}
                    >
                      <div className="w-full h-full flex flex-col items-center justify-center opacity-[0.35] pointer-events-none">
                        <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-rose-400 fill-rose-200 mb-6" />
                        <span className="font-script text-3xl sm:text-4xl text-rose-500 origin-center -rotate-12 px-6 text-center">Happy Birthday</span>
                      </div>
                    </div>
                  </div>

                  {/* Inside Right Page (The Message) */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-white rounded-r-2xl rounded-l-[4px] shadow-[15px_20px_40px_rgba(0,0,0,0.12)] flex flex-col z-10 border border-gray-100/50 before:content-[''] before:absolute before:left-0 before:top-0 before:w-8 before:h-full before:bg-gradient-to-r before:from-gray-200 before:via-gray-50 before:to-transparent before:opacity-70"
                    style={{ transform: 'translateZ(-1px)' }}
                  >
                    <div className="p-6 sm:p-8 h-full flex flex-col relative z-10">
                      <div className="font-script text-4xl text-rose-500 mb-4 sm:mb-5 border-b border-rose-100 pb-3 shrink-0 flex items-center justify-between">
                        <span>Happy Birthday</span>
                        <span className="text-2xl">🍰</span>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto pr-2 sm:pr-3 custom-scrollbar">
                        <p className="font-outfit text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                          {message}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-5 pt-3 border-t border-gray-100 text-right shrink-0">
                        <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-gray-400 mb-1">With deepest love,</p>
                        <p className="font-script font-bold text-2xl sm:text-3xl text-rose-400">{senderName}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Photos - Elegant Gallery */}
              {imageUrls.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                  className="w-full mx-auto mb-20 flex flex-col items-center"
                >
                  <h3 className="font-script text-4xl text-rose-500 font-bold mb-4">Memories</h3>
                  <div className="w-full">
                    <PhotoSlideshow images={imageUrls} />
                  </div>
                </motion.div>
              )}

              {/* Reasons You're Amazing Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="w-full max-w-4xl mx-auto mb-20 relative px-4 sm:px-0"
              >
                <div className="mb-8 text-center flex flex-col items-center">
                  <h3 className="font-script text-3xl sm:text-4xl text-rose-500 font-bold mb-3 drop-shadow-sm">Why You're Special</h3>
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-rose-300 to-transparent rounded-full mb-3"></div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                  
                  {/* Card 1 */}
                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="flex-1 bg-white/60 backdrop-blur-md rounded-[1.25rem] p-4 sm:p-5 flex items-center gap-4 sm:gap-5 shadow-[0_8px_30px_rgba(244,63,94,0.04)] border border-white/60 relative overflow-hidden group transition-transform duration-300"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-gradient-to-br from-rose-100 to-pink-50 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
                    </div>
                    <div>
                      <h4 className="font-script text-2xl sm:text-3xl text-gray-800 mb-0.5 sm:mb-1">Your Vibe</h4>
                      <p className="font-outfit text-[11px] sm:text-xs text-gray-500 leading-relaxed">A unique light that brightens every room you enter.</p>
                    </div>
                  </motion.div>

                  {/* Card 2 */}
                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="flex-1 bg-white/60 backdrop-blur-md rounded-[1.25rem] p-4 sm:p-5 flex items-center gap-4 sm:gap-5 shadow-[0_8px_30px_rgba(244,63,94,0.04)] border border-white/60 relative overflow-hidden group transition-transform duration-300"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-gradient-to-br from-pink-100 to-purple-50 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner group-hover:-rotate-12 transition-transform duration-500">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                    </div>
                    <div>
                      <h4 className="font-script text-2xl sm:text-3xl text-gray-800 mb-0.5 sm:mb-1">Your Heart</h4>
                      <p className="font-outfit text-[11px] sm:text-xs text-gray-500 leading-relaxed">A rare and deeply beautiful gift to everyone around.</p>
                    </div>
                  </motion.div>

                  {/* Card 3 */}
                  <motion.div 
                    whileHover={{ y: -3 }}
                    className="flex-1 bg-white/60 backdrop-blur-md rounded-[1.25rem] p-4 sm:p-5 flex items-center gap-4 sm:gap-5 shadow-[0_8px_30px_rgba(244,63,94,0.04)] border border-white/60 relative overflow-hidden group transition-transform duration-300"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-gradient-to-br from-purple-100 to-rose-50 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    </div>
                    <div>
                        <h4 className="font-script text-2xl sm:text-3xl text-gray-800 mb-0.5 sm:mb-1">Your Spirit</h4>
                        <p className="font-outfit text-[11px] sm:text-xs text-gray-500 leading-relaxed">Fierce, resilient, and totally unstoppable.</p>
                    </div>
                  </motion.div>

                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="mt-auto text-xs font-outfit uppercase tracking-widest text-gray-400 flex flex-col items-center gap-2"
              >
                <div className="w-8 h-[1px] bg-gray-300"></div>
                Created beautifully on Wishlink
              </motion.div>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default BirthdayTemplate;
