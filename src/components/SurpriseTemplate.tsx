import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WishPage } from "@/types/wish";
import ConfettiOverlay from "./animations/ConfettiOverlay";
import FloatingBalloons from "./animations/FloatingBalloons";
import FloatingHearts from "./animations/FloatingHearts";
import SparkleOverlay from "./animations/SparkleOverlay";
import SnowOverlay from "./animations/SnowOverlay";
import FireflyOverlay from "./animations/FireflyOverlay";
import RainOverlay from "./animations/RainOverlay";
import MatrixOverlay from "./animations/MatrixOverlay";
import { Heart, Quote, Play, Clock, Music } from "lucide-react";

interface Props {
  page: WishPage;
  previewMode?: boolean;
}

const themeStyles: Record<string, any> = {
  brutalist: {
    bg: "bg-[#FFFDF7]",
    card: "bg-white border-[6px] border-black shadow-[16px_16px_0px_#fde047]",
    text: "text-black",
    title: "font-black uppercase tracking-tighter text-3xl md:text-[5rem] drop-shadow-[2px_2px_0_#ff90e8] md:drop-shadow-[4px_4px_0_#ff90e8] leading-none mb-4 md:mb-6",
    message: "font-bold text-base md:text-3xl border-l-[4px] md:border-l-[6px] border-black pl-4 md:pl-8 py-2 w-full leading-relaxed bg-[#fde047]/10",
    quote: "font-black italic text-xl md:text-5xl text-center border-[3px] md:border-[4px] border-black p-4 md:p-8 bg-[#86efac] shadow-[4px_4px_0_#000] md:shadow-[8px_8px_0_#000]",
    secondaryText: "font-black tracking-widest uppercase bg-black text-white px-2 py-1 md:px-4 text-[10px] md:text-sm inline-block rotate-2",
    frame: "border-[4px] md:border-[6px] border-black shadow-[4px_4px_0px_#ff90e8] md:shadow-[8px_8px_0px_#ff90e8] bg-white",
  },
  neon: {
    bg: "bg-gray-950",
    card: "bg-gray-900 border-[2px] border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)] md:shadow-[0_0_30px_rgba(217,70,239,0.3)] rounded-xl",
    text: "text-fuchsia-50",
    title: "font-sans uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 text-3xl md:text-[4rem] drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] md:drop-shadow-[0_0_10px_rgba(217,70,239,0.8)] mb-4 md:mb-6",
    message: "font-medium text-base md:text-2xl text-cyan-50 w-full leading-relaxed font-mono opacity-90 p-4 md:p-6 bg-cyan-900/20 border-l-2 md:border-l-4 border-cyan-400",
    quote: "font-mono italic text-xl md:text-4xl text-center text-fuchsia-300 border-[1px] md:border-[2px] border-fuchsia-500 p-4 md:p-8 shadow-[0_0_10px_rgba(217,70,239,0.5)] md:shadow-[0_0_20px_rgba(217,70,239,0.5)] bg-black",
    secondaryText: "font-mono text-cyan-400 tracking-[0.2em] uppercase text-[10px] md:text-sm border border-cyan-400 px-2 py-0.5 md:px-4 md:py-1 rounded shadow-[0_0_4px_rgba(34,211,238,0.5)]",
    frame: "border border-cyan-400 rounded-lg md:rounded-xl overflow-hidden shadow-[0_0_10px_rgba(34,211,238,0.3)] bg-gray-900",
  },
  elegant: {
    bg: "bg-slate-50",
    card: "bg-white shadow-xl md:shadow-2xl rounded-2xl md:rounded-[3rem]",
    text: "text-slate-800",
    title: "font-serif tracking-wide text-3xl md:text-6xl font-light text-slate-800 mb-4 md:mb-6",
    message: "font-serif text-base md:text-2xl text-slate-600 w-full leading-relaxed md:leading-loose font-light p-4 md:p-8",
    quote: "font-serif italic text-xl md:text-5xl text-center text-slate-400 px-6 py-4 md:px-12 md:py-8",
    secondaryText: "font-serif text-slate-400 tracking-widest uppercase text-[10px] md:text-sm",
    frame: "rounded-xl md:rounded-2xl shadow-md md:shadow-xl overflow-hidden border border-slate-100",
  },
  romantic: {
    bg: "bg-pink-50/50",
    card: "bg-white/60 backdrop-blur-md rounded-2xl md:rounded-[3rem] border border-pink-100 shadow-sm md:shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
    text: "text-rose-800",
    title: "font-serif italic text-4xl md:text-[5rem] text-rose-500 mb-4 md:mb-6",
    message: "font-medium text-base md:text-3xl text-rose-700/80 w-full leading-relaxed font-serif p-4 md:p-8 bg-white/50 rounded-xl md:rounded-2xl",
    quote: "font-serif italic text-xl md:text-4xl text-center text-rose-400 p-4 md:p-8 border-y border-pink-200",
    secondaryText: "font-serif italic text-rose-400 text-sm md:text-lg",
    frame: "rounded-xl md:rounded-[2rem] border-4 md:border-8 border-white shadow-md md:shadow-xl shadow-pink-100 overflow-hidden",
  },
  vintage: {
    bg: "bg-[#f4ebd0]",
    card: "bg-[#fdfaee] border border-[#a18c72] shadow-sm md:shadow-md relative before:content-[''] before:absolute before:inset-1 md:before:inset-2 before:border before:border-[#d7c9a9] before:pointer-events-none p-3 md:p-6 rounded-sm",
    text: "text-[#5e4b3c]",
    title: "font-serif tracking-widest text-3xl md:text-6xl text-[#4a3b2f] mb-4 md:mb-6 uppercase border-b border-[#a18c72] pb-2 md:pb-4 inline-block",
    message: "font-serif text-base md:text-xl text-[#3d2f24] leading-relaxed p-4 md:p-6 bg-[#f4ebd0]/50 italic",
    quote: "font-serif italic text-xl md:text-4xl text-center text-[#735d48] px-6 py-4 md:px-10 md:py-6 border-y border-[#a18c72]/40",
    secondaryText: "font-mono tracking-widest text-[10px] md:text-sm text-[#8c7661] uppercase",
    frame: "border-[4px] md:border-[10px] border-[#fdfaee] shadow-sm md:shadow-lg rounded-sm sepia-[0.3]",
  },
  cyberpunk: {
    bg: "bg-[#050505]",
    card: "bg-black border-l-2 md:border-l-4 border-[#ff003c] shadow-md relative p-4 md:p-6 before:content-[''] before:absolute before:w-2 md:before:w-4 before:h-2 md:before:h-4 before:bg-[#ff003c] before:-top-2 md:before:-top-4 before:-left-2 md:before:-left-4",
    text: "text-[#dcdcdc]",
    title: "font-black uppercase text-4xl md:text-[5rem] text-transparent bg-clip-text bg-gradient-to-br from-[#00ffff] to-[#0000ff] drop-shadow-[1px_1px_0_#ff003c] md:drop-shadow-[2px_2px_0_#ff003c] mb-4 md:mb-6 tracking-tighter",
    message: "font-mono text-sm md:text-xl text-[#00ffff] bg-[#ff003c]/10 p-4 md:p-6 border border-[#ff003c]/30 leading-relaxed shadow-[inset_0_0_10px_rgba(255,0,60,0.1)]",
    quote: "font-bold italic text-xl md:text-4xl text-center text-[#ff003c] border-x-2 md:border-x-4 border-[#00ffff] p-4 md:p-6 bg-black",
    secondaryText: "font-mono font-bold text-[#ff003c] uppercase tracking-widest text-[10px] md:text-xs bg-[#00ffff]/10 px-2 md:px-3 py-1",
    frame: "border md:border-2 border-[#00ffff] shadow-[0_0_5px_#00ffff] bg-black p-0.5 md:p-1",
  },
  minimalist: {
    bg: "bg-white",
    card: "bg-white border text-left p-4 md:p-6",
    text: "text-black text-left",
    title: "font-sans font-light tracking-tighter text-3xl md:text-[5rem] text-black mb-6 md:mb-10 pb-2 md:pb-4 border-b border-black",
    message: "font-sans text-base md:text-2xl text-gray-800 leading-relaxed md:leading-[1.8] font-light max-w-2xl mx-auto",
    quote: "font-sans font-light text-xl md:text-5xl text-center text-black px-4 py-6 md:px-8 md:py-12",
    secondaryText: "font-sans text-[10px] md:text-xs text-gray-400 tracking-widest uppercase",
    frame: "border border-gray-200 p-1 md:p-2 bg-gray-50",
  },
  space: {
    bg: "bg-[#0b0c10]",
    card: "bg-[#1f2833]/50 backdrop-blur-xl border border-[#45a29e]/30 shadow-[0_0_15px_rgba(69,162,158,0.1)] rounded-[1rem] md:rounded-[2rem] p-4 md:p-8",
    text: "text-[#c5c6c7]",
    title: "font-sans uppercase text-3xl md:text-6xl text-white tracking-[0.2em] md:tracking-[0.3em] font-light drop-shadow-[0_0_8px_#66fcf1] mb-4 md:mb-6",
    message: "font-sans text-base md:text-2xl text-[#c5c6c7] p-4 md:p-8 leading-relaxed md:leading-loose font-light bg-gradient-to-b from-[#1f2833] to-transparent rounded-[1rem] md:rounded-[2rem]",
    quote: "font-sans font-light italic text-lg md:text-4xl text-center text-[#66fcf1] p-6 md:p-10",
    secondaryText: "font-sans text-[#45a29e] tracking-[0.1em] md:tracking-[0.2em] uppercase text-[10px] md:text-xs",
    frame: "rounded-full border border-[#45a29e] shadow-[0_0_10px_rgba(102,252,241,0.2)] bg-[#0b0c10] p-0.5 md:p-1 overflow-hidden scale-95 hover:scale-100 transition-transform",
  }
};

  
const getYoutubeId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};

const SurpriseTemplate = ({ page, previewMode = false }: Props) => {
  const { surpriseDetails, senderName, receiverName } = page;
  
  if (!surpriseDetails) return null;

  const themeName = surpriseDetails.theme || 'brutalist';
  const style = themeStyles[themeName];
  const sections = surpriseDetails.sections || [];

  return (
    <div className={`relative min-h-[100vh] w-full overflow-x-hidden ${style.bg} ${style.text} transition-colors duration-1000 flex flex-col`}>
      {themeName === 'neon' && (
        <div className="fixed inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #d946ef 0%, transparent 50%), radial-gradient(circle at 100% 0%, #22d3ee 0%, transparent 50%)" }} />
      )}
      {themeName === 'brutalist' && (
        <div className="fixed inset-0 pointer-events-none opacity-10" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "40px 40px" }} />
      )}
      {themeName === 'cyberpunk' && (
        <div className="fixed inset-0 pointer-events-none opacity-10" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00ffff 2px, #00ffff 4px)" }} />
      )}
      {themeName === 'space' && (
        <div className="fixed inset-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: "radial-gradient(1.5px 1.5px at 10px 10px, #fff 100%, transparent), radial-gradient(2px 2px at 40px 50px, #fff 100%, transparent)", backgroundSize: "100px 100px" }} />
      )}

      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {surpriseDetails.animationStyle === 'confetti' && <ConfettiOverlay />}
        {surpriseDetails.animationStyle === 'sparkles' && <SparkleOverlay />}
        {surpriseDetails.animationStyle === 'hearts' && <FloatingHearts />}
        {surpriseDetails.animationStyle === 'balloons' && <FloatingBalloons />}
        {surpriseDetails.animationStyle === 'snow' && <SnowOverlay />}
        {surpriseDetails.animationStyle === 'fireflies' && <FireflyOverlay />}
        {surpriseDetails.animationStyle === 'rain' && <RainOverlay />}
        {surpriseDetails.animationStyle === 'matrix' && <MatrixOverlay />}
      </div>

      <div className="relative z-20 flex-1 flex flex-col items-center max-w-5xl mx-auto p-3 sm:p-8 pt-10 md:pt-20 pb-20 md:pb-32 w-full space-y-8 md:space-y-16">
        
        <motion.div
           initial={previewMode ? false : { opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center w-full"
        >
           <span className={`${style.secondaryText} mb-6`}>For {receiverName}</span>
           <h1 className={`${style.title} mt-6`}>{surpriseDetails.pageTitle}</h1>
        </motion.div>

        {sections.map((section, idx) => {
           let sectionTitle = section.title || "";
           if (!sectionTitle) {
              if (section.type === 'gallery') sectionTitle = "Memories";
              else if (section.type === 'timeline') sectionTitle = "Our Story";
              else if (section.type === 'video') sectionTitle = "Special Video";
              else if (section.type === 'quote') sectionTitle = "Words to Remember";
              else if (section.type === 'paragraph') sectionTitle = "A Message for You";
           }

           let ViewComponent = null;

           if (section.type === 'hero') {
             ViewComponent = (
               <h2 className={`${style.title} text-center w-full`}>{section.title}</h2>
             );
           } 
           else if (section.type === 'paragraph') {
             ViewComponent = (
               <div className={`${style.card} w-full`}>
                 <p className={`${style.message} whitespace-pre-wrap`}>{section.content}</p>
               </div>
             );
           }
           else if (section.type === 'quote') {
             ViewComponent = (
               <div className="w-full py-4 md:py-8 flex flex-col items-center justify-center">
                 <Quote className={`w-12 h-12 mb-4 opacity-50`} />
                 <p className={`${style.quote} whitespace-pre-wrap w-full max-w-3xl`}>"{section.content}"</p>
               </div>
             );
           }
           else if (section.type === 'video') {
             const ytId = section.content ? getYoutubeId(section.content) : null;
             ViewComponent = (
               <div className={`${style.frame} w-full max-w-3xl aspect-video flex items-center justify-center bg-black/10`}>
                 {ytId ? (
                   <iframe
                     src={`https://www.youtube.com/embed/${ytId}`}
                     className="w-full h-full border-0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                   ></iframe>
                 ) : (
                   <div className="flex flex-col items-center text-gray-500 opacity-50 p-8 text-center font-bold">
                      <Play className="w-12 h-12 mb-2" />
                      <span>Valid YouTube URL Required</span>
                   </div>
                 )}
               </div>
             );
            }
           else if (section.type === 'timeline') {
             ViewComponent = (
                <div className="w-full max-w-4xl flex flex-col relative py-4 md:py-8 mx-auto">
                   <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-current opacity-20 -translate-x-1/2" />
                   {section.events?.map((ev, i) => (
                      <div key={i} className={`relative flex items-center mb-8 md:mb-16 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:w-full items-start md:items-center`}>
                         <div className={`absolute left-6 md:left-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full z-10 box-content border-[3px] md:border-[4px] -translate-x-1/2 ${themeName === 'brutalist' ? 'bg-[#ff90e8] border-black' : themeName === 'neon' ? 'bg-fuchsia-500 border-black shadow-[0_0_10px_#d946ef]' : 'bg-current border-white'}`} style={{ top: '24px' }} />
                         <div className={`w-[calc(100%-3.5rem)] md:w-[45%] ml-14 md:ml-0 ${i % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                            <div className={`${style.card} p-4 md:p-8 text-left w-full h-full`}>
                               <span className={`${style.secondaryText} mb-2 md:mb-3 inline-block font-bold text-xs md:text-sm`}>{ev.date}</span>
                               <h3 className={`text-xl md:text-3xl font-black mb-2 md:mb-3 leading-tight uppercase`}>{ev.title}</h3>
                               <p className="opacity-80 leading-relaxed font-medium text-sm md:text-base border-t border-current pt-3 mt-3">{ev.description}</p>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             );
           }
           else if (section.type === 'gallery') {
              // Custom gallery layouts per theme
              if (!section.images || section.images.length === 0) {
                 ViewComponent = <div className="text-center opacity-50 py-10 font-bold border-2 border-dashed w-full">(Empty Gallery)</div>;
              } else {
                 if (themeName === 'brutalist') {
                    ViewComponent = (
                       <div className="w-full flex flex-wrap justify-center gap-4 md:gap-8 py-4 md:py-8">
                         {section.images.map((img, i) => (
                           <div key={i} className={`w-48 h-56 sm:w-64 sm:h-72 border-[8px] bg-[#FFFDF7] p-2 pb-12 border-black shadow-[8px_8px_0_0_#93c5fd] hover:z-10 hover:shadow-[16px_16px_0_0_#ff90e8] hover:scale-105 transition-transform duration-300 ${i % 3 === 0 ? 'rotate-3' : i % 2 === 0 ? '-rotate-6' : 'rotate-6'}`}>
                              <img src={img} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500" />
                              <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-200 opacity-80 rotate-[-4deg] shadow-sm"></div>
                           </div>
                         ))}
                       </div>
                    );
                 } else if (themeName === 'romantic' || themeName === 'elegant') {
                    ViewComponent = (
                       <div className="w-full columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                         {section.images.map((img, i) => (
                           <div key={i} className={`break-inside-avoid relative overflow-hidden group ${style.frame}`}>
                              <img src={img} className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-[2s]" />
                           </div>
                         ))}
                       </div>
                    );
                 } else if (themeName === 'neon' || themeName === 'cyberpunk') {
                    ViewComponent = (
                       <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4">
                         {section.images.map((img, i) => (
                           <div key={i} className={`aspect-square overflow-hidden relative group ${style.frame} ${i % 4 === 0 && 'md:col-span-2 md:row-span-2'}`}>
                              <img src={img} className="w-full h-full object-cover filter contrast-[1.2] saturate-[1.5] mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                 <span className="font-mono text-cyan-400 text-xs tracking-widest uppercase block border border-cyan-500/50 px-2 py-1 bg-black/50">DATA_SET_{i.toString().padStart(2,'0')}</span>
                              </div>
                           </div>
                         ))}
                       </div>
                    );
                 } else if (themeName === 'vintage') {
                    ViewComponent = (
                       <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-[#3d2f24] rounded-lg shadow-inner relative before:absolute before:inset-2 before:border before:border-dashed before:border-[#5e4b3c]">
                         {section.images.map((img, i) => (
                           <div key={i} className={`aspect-square p-2 bg-[#fdfaee] shadow-[2px_2px_5px_rgba(0,0,0,0.5)] transform hover:scale-110 transition-transform z-10 ${i % 2 === 0 ? 'rotate-[-2deg]' : 'rotate-[2deg]'}`}>
                              <img src={img} className="w-full h-full object-cover sepia-[0.6] contrast-[1.1]" />
                           </div>
                         ))}
                       </div>
                    );
                 } else {
                    // Minimalist / Space / Fallback
                    ViewComponent = (
                       <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                         {section.images.map((img, i) => (
                           <div key={i} className={`${style.frame} overflow-hidden aspect-[4/5] relative group`}>
                              <img src={img} className="w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 transition-all duration-700" />
                           </div>
                         ))}
                       </div>
                    );
                 }
              }
           }

           if (!ViewComponent) return null;

           const HeadingElement = () => {
             if (section.type === 'hero' || !sectionTitle) return null;
             // Different heading styles for different themes
             if (themeName === 'brutalist') {
               return <h3 className="font-black uppercase text-3xl md:text-5xl text-black bg-[#86efac] border-[4px] border-black shadow-[6px_6px_0_#000] inline-block px-6 py-2 mb-10 -rotate-2">{sectionTitle}</h3>;
             }
             if (themeName === 'neon' || themeName === 'cyberpunk') {
               return <h3 className="font-mono uppercase text-2xl text-cyan-400 tracking-[0.3em] border-b-2 border-fuchsia-500 pb-2 mb-10 shadow-[0_4px_10px_-4px_#d946ef]">{sectionTitle}</h3>;
             }
             if (themeName === 'elegant') {
               return <h3 className="font-serif text-3xl md:text-5xl text-slate-800 font-light italic mb-10 opacity-80">{sectionTitle}</h3>;
             }
             return <h3 className={`${style.title} text-2xl md:text-4xl text-center w-full mb-8 opacity-90`}>{sectionTitle}</h3>;
           };

           return (
             <motion.div 
               key={section.id} 
               className="w-full flex flex-col items-center justify-center my-8"
               initial={previewMode ? false : { opacity: 0, scale: 0.95, y: 30 }}
               whileInView={{ opacity: 1, scale: 1, y: 0 }}
               viewport={{ once: true, margin: "-10%" }}
               transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
             >
               <HeadingElement />
               {ViewComponent}
             </motion.div>
           );
        })}

        {sections.length > 0 && (
          <motion.div 
             initial={previewMode ? false : { opacity: 0 }} 
             whileInView={{ opacity: 1 }} 
             className="w-full flex justify-end mt-16"
          >
             <div className={`${style.card} p-4 max-w-md inline-flex items-center gap-4`}>
                <Heart className={`w-8 h-8 ${themeName === 'neon' ? 'text-fuchsia-500 fill-fuchsia-500 shadow-fuchsia-vivid' : 'text-red-500 fill-red-500'}`} />
                <span className={`${style.secondaryText} font-bold text-xl`}>{senderName}</span>
             </div>
          </motion.div>
        )}

      </div>

      <div className="w-full flex justify-center pb-8 mt-auto z-20 relative px-4">
         <div className={`px-6 py-3 w-full max-w-sm cursor-pointer hover:opacity-80 transition-opacity ${style.card} text-center ${themeName === 'brutalist' ? 'rotate-2' : ''}`} onClick={() => window.open('https://wishlink.space', '_blank')}>
            <span className={`${themeName === 'neon' || themeName === 'cyberpunk' ? 'text-cyan-400 font-mono tracking-widest' : 'font-bold uppercase tracking-widest opacity-70'} text-xs md:text-sm`}>
               Create your own <Heart className={`inline w-4 h-4 mx-1 ${themeName === 'neon' || themeName === 'cyberpunk' ? 'text-fuchsia-500' : 'text-red-500 fill-red-500'}`} /> Wishlink
            </span>
         </div>
      </div>

    </div>
  );
};

export default SurpriseTemplate;
