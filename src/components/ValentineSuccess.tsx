import { motion } from "framer-motion";
import React from "react";
import FloatingHearts from "@/components/animations/FloatingHearts";
import FloatingRoses from "@/components/animations/FloatingRoses";
import SparkleOverlay from "@/components/animations/SparkleOverlay";
import PhotoSlideshow from "@/components/animations/PhotoSlideshow";

interface ValentineSuccessProps {
  senderName: string;
  receiverName: string;
  message: string;
  imageUrls: string[];
}

const ValentineSuccess = ({ senderName, receiverName, message, imageUrls }: ValentineSuccessProps) => {
  const [isEnvelopeOpened, setIsEnvelopeOpened] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const isLightboxOpen = lightboxIndex !== null && imageUrls.length > 0;
  const safeIndex =
    !isLightboxOpen || lightboxIndex === null
      ? 0
      : ((lightboxIndex % imageUrls.length) + imageUrls.length) % imageUrls.length;

  React.useEffect(() => {
    if (!isLightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev === null ? 0 : prev - 1));
      if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev === null ? 0 : prev + 1));
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isLightboxOpen]);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => (prev === null ? 0 : prev - 1));
  const nextImage = () => setLightboxIndex((prev) => (prev === null ? 0 : prev + 1));

  const captions = React.useMemo(
    () => ["Every moment with you", "Your beautiful smile", "You light up my life", "My favorite memory", "Always, you", "Us, forever"],
    []
  );

  React.useEffect(() => {
    const title = receiverName?.trim()
      ? `${receiverName} — A Valentine from ${senderName || "someone special"}`
      : "A Valentine for You";

    const baseDescription =
      message?.trim()
        ? message.trim().replace(/\s+/g, " ")
        : `A sweet valentine page from ${senderName || "someone special"}.`;

    const description = baseDescription.length > 160 ? `${baseDescription.slice(0, 157)}...` : baseDescription;

    document.title = title;

    const upsertMeta = (selector: string, attrs: Record<string, string>) => {
      const head = document.head;
      let el = head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        head.appendChild(el);
      }
      return el;
    };

    // Standard meta
    const desc = document.head.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (desc) desc.setAttribute("content", description);
    else upsertMeta('meta[name="description"]', { name: "description", content: description });

    const author = document.head.querySelector('meta[name="author"]') as HTMLMetaElement | null;
    if (author) author.setAttribute("content", senderName || "Wishlink Express");
    else upsertMeta('meta[name="author"]', { name: "author", content: senderName || "Wishlink Express" });

    // OpenGraph + Twitter
    const ogTitle = document.head.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitle) ogTitle.setAttribute("content", title);
    else upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });

    const ogDesc = document.head.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (ogDesc) ogDesc.setAttribute("content", description);
    else upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });

    const twTitle = document.head.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null;
    if (twTitle) twTitle.setAttribute("content", title);
    else upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });

    const twDesc = document.head.querySelector('meta[name="twitter:description"]') as HTMLMetaElement | null;
    if (twDesc) twDesc.setAttribute("content", description);
    else upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  }, [receiverName, senderName, message]);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-b from-pink-50 via-pink-100 to-pink-50 selection:bg-pink-300 selection:text-white">
      {/* Background elements */}
      <FloatingHearts />
      <FloatingRoses />
      <SparkleOverlay />

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center">
        {/* Hero Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="flex flex-col items-center text-center mb-24 w-full"
        >
          <div className="bg-white/80 backdrop-blur-sm px-6 py-1.5 rounded-full mb-6 shadow-sm border border-pink-100">
            <span className="text-pink-600 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase">
              Happy Valentine's Day
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-bold text-pink-900 mb-6 drop-shadow-sm px-4">
            {receiverName}
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-pink-800/90 max-w-lg font-medium px-4">
             Every word on this page is just for you, straight from the heart of <span className="font-bold text-pink-900">{senderName}</span>.
          </p>
        </motion.div>

        {/* Letter Section with Envelope Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="w-full mb-24 flex flex-col items-center px-2 sm:px-4"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-pink-800/90 mb-8 text-center drop-shadow-sm">
            A Love Letter For You
          </h2>

          {/* Closed envelope */}
          {!isEnvelopeOpened && (
            <motion.button
              aria-label="Open the love letter"
              onClick={() => setIsEnvelopeOpened(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 160, damping: 18 }}
              className="relative w-full max-w-md aspect-[4/3] rounded-[1.75rem] shadow-xl shadow-pink-200/60 border border-white/70 overflow-hidden bg-gradient-to-br from-pink-200 via-pink-100 to-rose-200 flex items-center justify-center"
            >
              {/* Envelope body */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200" />
              {/* Envelope flap */}
              <motion.div
                initial={false}
                animate={{ rotateX: 0, y: 0 }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="absolute top-0 left-0 right-0 h-1/2 origin-top bg-gradient-to-b from-pink-300 to-pink-200 shadow-md"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
              {/* Inner letter hint */}
              <div className="absolute inset-x-6 top-8 h-16 rounded-2xl bg-white/90 shadow-md shadow-pink-200/60 border border-pink-100 flex flex-col items-center justify-center">
                <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-pink-500">
                  Open this
                </span>
                <span className="mt-1 text-[10px] sm:text-xs text-pink-400">
                  A special message is waiting inside
                </span>
              </div>
              {/* Envelope edges */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border border-white/70 rounded-[1.5rem]" />
              </div>
            </motion.button>
          )}

          {/* Revealed letter */}
          {isEnvelopeOpened && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: -4, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 140, damping: 18 }}
              className="w-full max-w-2xl mt-4"
            >
              <div className="bg-white/75 backdrop-blur-md p-6 sm:p-10 md:p-12 rounded-[2rem] shadow-xl shadow-pink-200/50 border border-white relative">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-200 to-transparent opacity-40 rounded-br-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-pink-200 to-transparent opacity-40 rounded-tl-full pointer-events-none" />

                <div className="relative z-10 flex flex-col">
                  <p className="text-pink-900/60 font-medium mb-6 text-lg">My Dearest,</p>
                  <p className="text-pink-900 leading-relaxed whitespace-pre-wrap font-body text-base sm:text-lg md:text-xl">
                    {message}
                  </p>
                  <p className="text-right text-pink-500/80 text-xs sm:text-sm font-bold tracking-widest uppercase mt-12">
                    WITH ALL MY LOVE.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Why I Love You */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1 }}
           className="w-full max-w-3xl mb-24 flex flex-col items-center px-4"
        >
          <h2 className="text-3xl sm:text-4xl font-display text-pink-800 mb-12 text-center drop-shadow-sm">
             Why I <span className="italic font-light">Love</span> You
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 w-full">
            <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-[2rem] shadow-lg shadow-pink-200/40 border border-white relative text-center flex flex-col items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-200/60 group">
               <div className="absolute -top-5 w-10 h-10 bg-pink-400 text-white rounded-full flex items-center justify-center text-base font-bold shadow-lg shadow-pink-300 group-hover:scale-110 transition-transform">1</div>
               <span className="text-3xl mb-4 opacity-80 group-hover:scale-110 transition-transform">🤍</span>
               <p className="text-pink-900 font-medium text-lg leading-relaxed">You are my forever Valentine, today and always! 💖</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-[2rem] shadow-lg shadow-pink-200/40 border border-white relative text-center flex flex-col items-center justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-200/60 group sm:translate-y-8">
               <div className="absolute -top-5 w-10 h-10 bg-pink-400 text-white rounded-full flex items-center justify-center text-base font-bold shadow-lg shadow-pink-300 group-hover:scale-110 transition-transform">2</div>
               <span className="text-3xl mb-4 opacity-80 group-hover:scale-110 transition-transform">🤍</span>
               <p className="text-pink-900 font-medium text-lg leading-relaxed">With you, every day feels like Valentine's Day.</p>
            </div>
          </div>
        </motion.div>

        {/* Our Memories Section */}
        {imageUrls && imageUrls.length > 0 && (
          <motion.div
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 1 }}
             className="w-full mb-32 flex flex-col items-center px-4"
          >
            <h2 className="text-3xl sm:text-4xl font-display text-pink-800 mb-10 text-center drop-shadow-sm">
              Our Journey Visualized
            </h2>
            <div className="w-full max-w-5xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {imageUrls.slice(0, 12).map((src, idx) => (
                  <motion.button
                    key={`${src}-polaroid-${idx}`}
                    type="button"
                    onClick={() => openLightbox(idx)}
                    whileHover={{ y: -3, rotate: idx % 2 === 0 ? -0.6 : 0.6 }}
                    whileTap={{ scale: 0.99 }}
                    className={[
                      "group w-full text-left focus:outline-none",
                      "rounded-[1.75rem] bg-white/90 border border-white shadow-xl shadow-pink-200/40",
                      "p-3 sm:p-3.5",
                      idx % 3 === 0 ? "rotate-[-0.6deg]" : idx % 3 === 1 ? "rotate-[0.4deg]" : "rotate-[-0.2deg]",
                    ].join(" ")}
                    aria-label={`Open memory ${idx + 1}`}
                  >
                    <div className="overflow-hidden rounded-[1.25rem] bg-pink-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Memory ${idx + 1}`}
                        className="w-full h-56 sm:h-52 lg:h-56 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="pt-4 pb-2 px-2">
                      <p className="font-display text-lg sm:text-base lg:text-lg text-pink-900/80">
                        {captions[idx % captions.length]}
                      </p>
                      <p className="mt-1 text-xs text-pink-500/70 font-medium">Tap to view</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Our Journey Timeline */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1 }}
           className="w-full max-w-3xl mb-32 flex flex-col items-center relative px-4"
        >
          <div className="relative mb-20 text-center w-full">
            <h2 className="text-3xl sm:text-4xl font-display text-pink-800 relative z-10 drop-shadow-sm">Our Journey</h2>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl sm:text-8xl md:text-9xl font-display text-pink-200/40 whitespace-nowrap z-0 pointer-events-none select-none">Love Story</span>
          </div>

          <div className="relative w-full">
            {/* Vertical Line */}
            <div className="absolute left-[36px] sm:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-200 via-pink-300 to-pink-400 sm:-translate-x-1/2 rounded-full" />

            {/* Timeline Item 1 */}
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center w-full mb-16 pl-24 sm:pl-0 group">
               <div className="hidden sm:flex flex-1 justify-end pr-12">
                 <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl rounded-tr-none shadow-md shadow-pink-200/40 border border-white text-right w-full max-w-sm group-hover:-translate-y-1 transition-transform">
                   <p className="text-pink-900/80 text-sm md:text-base leading-relaxed">Sometimes I look at "HI" and "I love you", my heart quickly chose you... and it has never stopped since.</p>
                 </div>
               </div>
               
               <div className="absolute left-[16px] sm:left-1/2 sm:-translate-x-1/2 w-12 h-12 bg-pink-400 rounded-full border-4 border-pink-100 flex items-center justify-center shadow-lg shadow-pink-300/50 z-10 group-hover:scale-110 transition-transform duration-300">
                 <span className="text-white text-sm">🤍</span>
               </div>
               
               <div className="flex-1 sm:pl-12 w-full">
                 <h3 className="text-pink-700 font-display text-xl sm:text-2xl mb-3">The Beginning</h3>
                 <div className="sm:hidden bg-white/90 backdrop-blur-md p-5 rounded-2xl rounded-tl-none shadow-md shadow-pink-200/40 border border-white text-left w-full group-hover:-translate-y-1 transition-transform">
                   <p className="text-pink-900/80 text-sm leading-relaxed">Sometimes I look at "HI" and "I love you", my heart quickly chose you... and it has never stopped since.</p>
                 </div>
               </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center w-full mb-16 pl-24 sm:pl-0 group">
               <div className="hidden sm:flex flex-1 justify-end pr-12">
                 <h3 className="text-pink-700 font-display text-xl sm:text-2xl mb-3 text-right">Magic Moments</h3>
               </div>
               
               <div className="absolute left-[16px] sm:left-1/2 sm:-translate-x-1/2 w-12 h-12 bg-pink-400 rounded-full border-4 border-pink-100 flex items-center justify-center shadow-lg shadow-pink-300/50 z-10 group-hover:scale-110 transition-transform duration-300">
                 <span className="text-white text-sm">🤍</span>
               </div>
               
               <div className="flex-1 sm:pl-12 w-full">
                 <h3 className="sm:hidden text-pink-700 font-display text-xl mb-3">Magic Moments</h3>
                 <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl sm:rounded-tl-none shadow-md shadow-pink-200/40 border border-white text-left w-full max-w-sm group-hover:-translate-y-1 transition-transform">
                   <p className="text-pink-900/80 text-sm md:text-base leading-relaxed">Late night talks, endless goofy laughs, staying up all night... all weaving the most beautiful story of us.</p>
                 </div>
               </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center w-full pl-24 sm:pl-0 group">
               <div className="hidden sm:flex flex-1 justify-end pr-12">
                 <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl rounded-br-none shadow-md shadow-pink-200/40 border border-white text-right w-full max-w-sm group-hover:-translate-y-1 transition-transform">
                   <p className="text-pink-900/80 text-sm md:text-base leading-relaxed">Today is just one page, but my heart wants to write a whole library of "us" with you.</p>
                 </div>
               </div>
               
               <div className="absolute left-[16px] sm:left-1/2 sm:-translate-x-1/2 w-12 h-12 bg-pink-500 rounded-full border-4 border-pink-100 flex items-center justify-center shadow-xl shadow-pink-400/50 z-10 group-hover:scale-125 transition-transform duration-300">
                 <span className="text-white text-sm">❤️</span>
               </div>
               
               <div className="flex-1 sm:pl-12 w-full">
                 <h3 className="text-pink-700 font-display text-xl sm:text-2xl mb-3">Forever</h3>
                 <div className="sm:hidden bg-white/90 backdrop-blur-md p-5 rounded-2xl rounded-bl-none shadow-md shadow-pink-200/40 border border-white text-left w-full group-hover:-translate-y-1 transition-transform">
                   <p className="text-pink-900/80 text-sm leading-relaxed">Today is just one page, but my heart wants to write a whole library of "us" with you.</p>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 0.8 }}
           className="w-full flex flex-col items-center text-center mt-8 mb-12 px-4"
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-display text-pink-900 mb-6 drop-shadow-sm">I Love You,</h2>
          <p className="text-sm sm:text-base md:text-lg text-pink-800/90 max-w-md mx-auto mb-10 font-medium leading-relaxed">
            Happy Valentine's Day, my love! You complete me in every way 💖✨
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/90 backdrop-blur-sm hover:bg-white text-pink-600 font-bold py-4 px-10 rounded-full shadow-xl shadow-pink-200/60 border border-pink-100 transition-colors flex items-center gap-3 text-lg"
          >
            <span className="animate-pulse">❤️</span> Forever Yours
          </motion.button>
        </motion.div>
      </main>

      {/* Lightbox */}
      {isLightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6"
          aria-modal="true"
          role="dialog"
        >
          <button
            type="button"
            aria-label="Close image viewer"
            onClick={closeLightbox}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
            className="relative w-full max-w-5xl"
          >
            <div className="relative rounded-[2rem] bg-white/90 border border-white shadow-2xl shadow-black/30 overflow-hidden">
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="rounded-full bg-white/85 hover:bg-white text-pink-600 border border-pink-100 shadow-md shadow-pink-200/40 px-3 py-2 text-sm font-bold"
                >
                  Close
                </button>
              </div>

              <div className="bg-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrls[safeIndex]}
                  alt={`Memory ${safeIndex + 1}`}
                  className="w-full max-h-[72vh] object-contain bg-black/5"
                  decoding="async"
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
                <button
                  type="button"
                  onClick={prevImage}
                  className="rounded-full bg-white hover:bg-white text-pink-700 border border-pink-100 shadow-md shadow-pink-200/40 px-4 py-2 text-sm font-bold"
                  aria-label="Previous image"
                >
                  ← Prev
                </button>
                <p className="text-xs sm:text-sm text-pink-700/80 font-medium">
                  {safeIndex + 1} / {imageUrls.length}
                </p>
                <button
                  type="button"
                  onClick={nextImage}
                  className="rounded-full bg-white hover:bg-white text-pink-700 border border-pink-100 shadow-md shadow-pink-200/40 px-4 py-2 text-sm font-bold"
                  aria-label="Next image"
                >
                  Next →
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ValentineSuccess;
