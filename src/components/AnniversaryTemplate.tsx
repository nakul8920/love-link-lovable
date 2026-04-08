import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnniversaryDetails } from "@/types/wish";
import { Heart, Sparkles, Star, Quote } from "lucide-react";

interface AnniversaryTemplateProps {
  senderName: string;
  receiverName: string;
  message: string;
  imageUrls: string[];
  anniversaryDetails: AnniversaryDetails;
}

const FloatingDecor = ({ delay, left, size, Component, rotateOffset }: { delay: number; left: string, size: number, Component: any, rotateOffset: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left }}
    initial={{ y: "110vh", rotate: 0, opacity: 0 }}
    animate={{ 
      y: "-10vh", 
      rotate: 360 + rotateOffset,
      opacity: [0, 0.6, 0] 
    }}
    transition={{ 
      duration: 18 + Math.random() * 10,
      repeat: Infinity,
      delay,
      ease: "linear"
    }}
  >
    <Component size={size} className="text-rose-400/30 fill-rose-300/10 drop-shadow-md" />
  </motion.div>
);

const OrnateDivider = () => (
    <div className="flex items-center justify-center gap-4 py-8">
        <div className="hidden sm:block w-32 h-[1px] bg-gradient-to-l from-rose-300 to-transparent"></div>
        <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-300" />
            <Heart className="w-6 h-6 text-rose-500 fill-rose-200" />
            <Sparkles className="w-4 h-4 text-rose-300" />
        </div>
        <div className="hidden sm:block w-32 h-[1px] bg-gradient-to-r from-rose-300 to-transparent"></div>
    </div>
);

const parseDate = (dateStr: string) => {
  if (!dateStr) return new Date(NaN);
  
  // Safely parse both dd-mm-yyyy and yyyy-mm-dd to LOCAL time
  const [p1, p2, p3] = dateStr.includes('-') ? dateStr.split('-') : dateStr.split('/');
  if (p1 && p2 && p3) {
    if (p1.length === 2) {
       // dd-mm-yyyy -> yyyy/mm/dd
       return new Date(`${p3}/${p2}/${p1}`);
    } else {
       // yyyy-mm-dd -> yyyy/mm/dd
       return new Date(`${p1}/${p2}/${p3}`);
    }
  }
  return new Date(dateStr);
};

const TimeCounter = ({ dateString }: { dateString: string }) => {
  const [timePassed, setTimePassed] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isValid, setIsValid] = useState(true);
  const [isFuture, setIsFuture] = useState(false);

  useEffect(() => {
    if (!dateString) {
      setIsValid(false);
      return;
    }
    
    const start = parseDate(dateString).getTime();
    if (isNaN(start)) {
      setIsValid(false);
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      let diff = now.getTime() - start;
      const future = diff < 0;
      setIsFuture(future);
      
      let d1 = future ? now : parseDate(dateString);
      let d2 = future ? parseDate(dateString) : now;

      let years = d2.getFullYear() - d1.getFullYear();
      let months = d2.getMonth() - d1.getMonth();
      let days = d2.getDate() - d1.getDate();
      
      let hours = d2.getHours() - d1.getHours();
      let minutes = d2.getMinutes() - d1.getMinutes();
      let seconds = d2.getSeconds() - d1.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      setTimePassed({ years, months, days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [dateString]);

  if (!isValid) return null;

  const CounterBox = ({ label, value }: { label: string, value: number }) => (
    <div className="flex flex-col items-center justify-center bg-white/60 backdrop-blur-md rounded-xl border border-rose-100 p-2 sm:p-3 shadow-[0_4px_15px_rgba(225,29,72,0.05)] w-[70px] sm:w-[90px]">
       <span className="font-cormorant font-bold text-2xl sm:text-4xl text-rose-700 leading-none">{value.toString().padStart(2, '0')}</span>
       <span className="text-[8px] sm:text-[10px] font-cinzel font-bold tracking-widest text-rose-900/60 uppercase mt-1">{label}</span>
    </div>
  );

  return (
     <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center shrink-0"
     >
        <div className="text-xs sm:text-sm font-cinzel font-bold tracking-[0.2em] uppercase mb-4 text-rose-800/80 bg-rose-50/50 px-4 py-1.5 rounded-full border border-rose-200/50 shadow-sm">
           {isFuture ? "Countdown" : "Time Together"}
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
           <CounterBox label="Years" value={timePassed.years} />
           <CounterBox label="Months" value={timePassed.months} />
           <CounterBox label="Days" value={timePassed.days} />
           <CounterBox label="Hours" value={timePassed.hours} />
           <CounterBox label="Mins" value={timePassed.minutes} />
           <CounterBox label="Secs" value={timePassed.seconds} />
        </div>
     </motion.div>
  );
};

const AnniversaryTemplate = ({ imageUrls, anniversaryDetails, message, senderName }: AnniversaryTemplateProps) => {
  useEffect(() => {
    if (!anniversaryDetails?.date) return;
    // Just force a re-render or keep empty if we removed countdown logic
  }, [anniversaryDetails?.date]);

  // Calculate Years Together
  const computedYears = () => {
    if (!anniversaryDetails?.date) return 0;
    const origDate = parseDate(anniversaryDetails.date);
    if (isNaN(origDate.getTime())) return 0;
    const now = new Date();
    if (now.getTime() < origDate.getTime()) return 0;
    
    let y = now.getFullYear() - origDate.getFullYear();
    const m = now.getMonth() - origDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < origDate.getDate())) {
        y--;
    }
    return y;
  };

  if (!anniversaryDetails) return null;

  const displayDate = () => {
    if (!anniversaryDetails?.date) return "";
    const parsed = parseDate(anniversaryDetails.date);
    if (isNaN(parsed.getTime())) return anniversaryDetails.date;
    return `${parsed.getDate().toString().padStart(2, '0')}-${(parsed.getMonth() + 1).toString().padStart(2, '0')}-${parsed.getFullYear()}`;
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Great+Vibes&family=Cinzel+Decorative:wght@400;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
          
          .font-vibes { font-family: 'Great Vibes', cursive; text-shadow: 2px 2px 4px rgba(225, 29, 72, 0.1); }
          .font-cormorant { font-family: 'Cormorant Garamond', serif; }
          .font-lora { font-family: 'Lora', serif; }
          .font-cinzel { font-family: 'Cinzel Decorative', serif; }
          
          .glass-panel-ornate {
            background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,241,242,0.6));
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 228, 230, 0.8);
            box-shadow: 0 10px 40px -10px rgba(225, 29, 72, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.8);
          }
          
          .gold-gradient-text {
            background: linear-gradient(to right, #b48545, #dfb776, #b48545);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .rose-gradient-border {
            border: 2px solid transparent;
            background-image: linear-gradient(white, white), linear-gradient(135deg, #fecdd3, #f43f5e, #fecdd3);
            background-origin: border-box;
            background-clip: padding-box, border-box;
          }
        `}
      </style>
      
      <div className="min-h-screen bg-[#FFF0F2] font-lora text-rose-950 selection:bg-rose-400 selection:text-white pb-10 overflow-hidden relative">
        
        {/* Animated Ornate Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60 mix-blend-multiply"></div>
          {/* Subtle floral watermark effect */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-200/40 rounded-full blur-[100px] mix-blend-multiply"></div>
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-pink-300/30 rounded-full blur-[120px] mix-blend-multiply"></div>
          <div className="absolute bottom-0 left-1/4 w-[60%] h-96 bg-red-200/20 rounded-full blur-[150px] mix-blend-multiply"></div>
          
          {/* Falling Petals / Hearts */}
          <FloatingDecor delay={0} left="15%" size={28} Component={Heart} rotateOffset={45} />
          <FloatingDecor delay={3} left="80%" size={20} Component={Star} rotateOffset={90} />
          <FloatingDecor delay={5} left="45%" size={24} Component={Heart} rotateOffset={15} />
          <FloatingDecor delay={8} left="65%" size={18} Component={Sparkles} rotateOffset={60} />
          <FloatingDecor delay={11} left="25%" size={32} Component={Heart} rotateOffset={30} />
          <FloatingDecor delay={15} left="8%" size={16} Component={Heart} rotateOffset={0} />
          <FloatingDecor delay={18} left="90%" size={24} Component={Heart} rotateOffset={75} />
        </div>

        {/* HERO SECTION */}
        <section className="relative pt-20 sm:pt-24 pb-8 sm:pb-16 w-full max-w-7xl mx-auto px-2 sm:px-4 z-10">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 w-full mt-4 sm:mt-8">
                {/* The Main Plaque */}
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9, y: 30 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="relative w-[85%] sm:max-w-md lg:max-w-lg shrink-0"
                >
                    {/* Decorative majestic frame behind */}
                    <div className="absolute -inset-1 sm:-inset-4 bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 rounded-[1.5rem] sm:rounded-[3rem] blur-md sm:blur-2xl opacity-60"></div>
                    
                    <div className="relative rounded-t-[3rem] sm:rounded-t-[5rem] rounded-b-xl sm:rounded-b-3xl bg-white/90 backdrop-blur-xl border sm:border-4 border-rose-100 flex flex-col items-center justify-center text-rose-950 text-center px-4 py-8 sm:px-10 sm:py-16 shadow-[0_5px_15px_rgba(225,29,72,0.1)] sm:shadow-[0_10px_30px_rgba(225,29,72,0.15)] overflow-hidden">
                        
                        {/* Inner golden/rose line detail */}
                        <div className="absolute inset-1 sm:inset-3 border border-rose-200 rounded-t-[2.5rem] sm:rounded-t-[4.5rem] rounded-b-lg sm:rounded-b-2xl pointer-events-none border-dashed opacity-70"></div>
                        
                        {/* Top Ornaments */}
                        <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2">
                             <div className="w-8 sm:w-12 h-[1px] bg-rose-300"></div>
                             <Heart className="w-3 h-3 sm:w-5 sm:h-5 text-rose-500 fill-rose-100" />
                             <div className="w-8 sm:w-12 h-[1px] bg-rose-300"></div>
                        </div>

                        <div className="text-[7px] sm:text-xs font-cinzel font-bold tracking-[0.2em] sm:tracking-[0.4em] uppercase mb-2 sm:mb-4 mt-4 sm:mt-4 text-rose-800/80 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                            {anniversaryDetails.gotMarriedLabel || "A CELEBRATION OF LOVE"}
                        </div>
                        
                        <div className="font-vibes text-5xl sm:text-7xl leading-none mb-4 sm:mb-6 text-rose-700 relative z-10 p-2 sm:p-4">
                            {computedYears()} <br/>
                            <span className="text-3xl sm:text-5xl text-rose-900 font-cormorant italic font-medium -mt-1 sm:-mt-2 block">Glorious Years</span>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 sm:gap-3 w-full mb-3 sm:mb-4 px-4">
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-rose-300"></div>
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400" />
                            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-rose-300"></div>
                        </div>

                        <div className="text-[10px] sm:text-base font-cinzel font-bold tracking-[0.1em] sm:tracking-[0.2em] text-rose-900 uppercase">
                             {displayDate()}
                        </div>

                        {/* Faint elegant background watermark inside card */}
                        <div className="absolute -bottom-4 -right-4 sm:-bottom-10 sm:-right-10 opacity-[0.03] pointer-events-none">
                            <Heart className="w-32 h-32 sm:w-64 sm:h-64 fill-rose-900" />
                        </div>
                    </div>
                </motion.div>

                {/* The Time Counter */}
                <TimeCounter dateString={anniversaryDetails.date} />
            </div>
        </section>

        {anniversaryDetails.husbandName && anniversaryDetails.wifeName && (
        <>
            <OrnateDivider />
            {/* HAPPY COUPLE SECTION */}
            <section className="py-16 w-full max-w-6xl mx-auto px-4 relative z-10 overflow-hidden">
            {/* Massive faint "Love" watermark in background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] sm:text-[15vw] lg:text-[12vw] font-cormorant italic font-bold text-rose-900/[0.04] pointer-events-none whitespace-nowrap z-0 select-none tracking-widest">
               Soulmate
            </div>

            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="font-vibes text-4xl sm:text-6xl md:text-7xl text-rose-800 text-center mb-12 sm:mb-20 relative z-10 whitespace-nowrap"
            >
                {anniversaryDetails.happyCoupleLabel || "The Happy Couple"}
            </motion.h2>

            <div className="flex flex-col md:flex-row gap-6 sm:gap-20 justify-center items-center relative z-10">
                
                {/* Partner 1 (Ornate Oval Frame) */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-center text-center flex-1 w-full max-w-sm"
                >
                    <div className="relative mb-6 sm:mb-8 group p-1 sm:p-2">
                        {/* Multiple ornate borders */}
                        <div className="absolute inset-0 border-2 border-rose-300 rounded-full scale-105 opacity-50 group-hover:rotate-12 transition-transform duration-700"></div>
                        <div className="absolute inset-0 border border-dashed border-rose-400 rounded-full scale-110 opacity-30 group-hover:-rotate-12 transition-transform duration-700"></div>
                        
                        <div className="w-40 h-52 sm:w-64 sm:h-80 rounded-full overflow-hidden border-2 sm:border-4 border-white shadow-[0_10px_30px_rgba(251,113,133,0.2)] relative z-10">
                          <div className="absolute inset-0 bg-rose-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                          <img 
                              src={imageUrls[0] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80'} 
                              alt={anniversaryDetails.husbandName}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                        </div>
                        
                        
                    </div>
                    <h3 className="font-cormorant font-bold italic text-3xl sm:text-4xl text-rose-900 mt-2 sm:mt-4 mb-1 sm:mb-2">{anniversaryDetails.husbandName}</h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 justify-center w-full mb-2 sm:mb-4 opacity-70">
                        <div className="w-8 sm:w-12 h-[1px] bg-rose-300"></div>
                        <Star className="w-2 h-2 sm:w-3 sm:h-3 text-rose-400 fill-rose-100" />
                        <div className="w-8 sm:w-12 h-[1px] bg-rose-300"></div>
                    </div>
                    <p className="text-sm sm:text-base text-rose-800/80 leading-relaxed font-lora px-4 sm:px-0">
                        {anniversaryDetails.husbandBio}
                    </p>
                </motion.div>



                {/* Partner 2 */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="flex flex-col items-center text-center flex-1 w-full max-w-sm"
                >
                    <div className="relative mb-6 sm:mb-8 group p-1 sm:p-2">
                        {/* Multiple ornate borders */}
                        <div className="absolute inset-0 border-2 border-rose-300 rounded-full scale-105 opacity-50 group-hover:-rotate-12 transition-transform duration-700"></div>
                        <div className="absolute inset-0 border border-dashed border-rose-400 rounded-full scale-110 opacity-30 group-hover:rotate-12 transition-transform duration-700"></div>
                        
                        <div className="w-40 h-52 sm:w-64 sm:h-80 rounded-full overflow-hidden border-2 sm:border-4 border-white shadow-[0_10px_30px_rgba(251,113,133,0.2)] relative z-10">
                          <div className="absolute inset-0 bg-rose-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                          <img 
                              src={imageUrls[1] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'} 
                              alt={anniversaryDetails.wifeName}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                        </div>
                        
                        
                    </div>
                    <h3 className="font-cormorant font-bold italic text-3xl sm:text-4xl text-rose-900 mt-2 sm:mt-4 mb-1 sm:mb-2">{anniversaryDetails.wifeName}</h3>
                    <div className="flex items-center gap-1.5 sm:gap-2 justify-center w-full mb-2 sm:mb-4 opacity-70">
                        <div className="w-8 sm:w-12 h-[1px] bg-rose-300"></div>
                        <Star className="w-2 h-2 sm:w-3 sm:h-3 text-rose-400 fill-rose-100" />
                        <div className="w-8 sm:w-12 h-[1px] bg-rose-300"></div>
                    </div>
                    <p className="text-sm sm:text-base text-rose-800/80 leading-relaxed font-lora px-4 sm:px-0">
                        {anniversaryDetails.wifeBio}
                    </p>
                </motion.div>
            </div>
        </section>
        </>
        )}

        {/* OUR LOVE STORY TIMELINE */}
        {anniversaryDetails.timeline && anniversaryDetails.timeline.length > 0 && (
        <>
        <OrnateDivider />
        <section className="py-24 relative z-10 overflow-hidden">
            {/* Decorative Ribbon Background Stripe */}
            <div className="absolute top-1/4 bottom-1/4 -left-10 w-[120%] bg-gradient-to-r from-rose-50/10 via-rose-100/40 to-rose-50/10 -rotate-3 blur-3xl -z-10"></div>
            
            <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-vibes text-6xl sm:text-7xl md:text-8xl text-rose-800 text-center mb-20 sm:mb-32 flex flex-col items-center gap-4 relative"
                >
                    <span className="absolute -top-4 sm:-top-16 opacity-[0.04] font-cormorant text-[20vw] sm:text-[15vw] lg:text-[12rem] tracking-[0.1em] leading-none z-0 whitespace-nowrap">Journey</span>
                    <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-rose-400 opacity-80 z-10 relative mb-2" />
                    <span className="relative z-10 text-4xl sm:text-6xl">{anniversaryDetails.loveStoryLabel || "Our Love Story"}</span>
                </motion.h2>

                <div className="relative pt-4 sm:pt-10 max-w-5xl mx-auto">
                    {/* Classic Center Dotted Line */}
                    <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-rose-200 via-rose-300 to-rose-200 -translate-x-1/2 opacity-70"></div>
                    
                    <div className="flex flex-col gap-16 sm:gap-24">
                        {anniversaryDetails.timeline.map((event, idx) => (
                            <div key={idx} className={`relative flex flex-col md:flex-row items-center justify-center w-full group ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                                
                                {/* Center Ornament */}
                                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-rose-100 shadow-[0_0_20px_rgba(251,113,133,0.3)] z-30 items-center justify-center transition-all duration-700 group-hover:scale-125 group-hover:border-rose-300">
                                   <Heart className="w-5 h-5 text-rose-500 fill-rose-200 transition-colors duration-500 group-hover:fill-rose-400" />
                                </div>

                                {/* Connecting Horizontal Line (Desktop) */}
                                <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-[calc(50%-20px)] h-[2px] bg-gradient-to-r ${idx % 2 === 0 ? 'from-transparent to-rose-200 right-[50%]' : 'from-rose-200 to-transparent left-[50%]'} z-10 opacity-30 group-hover:opacity-100 transition-opacity duration-700`}></div>
                                
                                {/* Refined Card Layout */}
                                <motion.div 
                                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50, y: 30 }}
                                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`w-full md:w-[45%] flex flex-col relative z-20 ${idx % 2 === 0 ? 'items-center md:items-end' : 'items-center md:items-start'}`}
                                >
                                    <div className={`w-[92%] sm:w-full bg-white/95 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] border border-rose-100/80 shadow-[0_10px_40px_rgba(225,29,72,0.08)] transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(225,29,72,0.15)] relative overflow-hidden group-hover:border-rose-300/50 ${idx % 2 === 0 ? 'md:rounded-tr-sm md:rounded-br-[4rem]' : 'md:rounded-tl-sm md:rounded-bl-[4rem]'}`}>
                                        
                                        {/* Faint Background Decor inside card */}
                                        <div className={`absolute top-0 opacity-[0.03] pointer-events-none transform scale-150 transition-transform duration-1000 group-hover:scale-125 group-hover:opacity-[0.05] ${idx % 2 === 0 ? '-right-10' : '-left-10'}`}>
                                            <Heart className="w-40 h-40 fill-rose-900" />
                                        </div>

                                        <div className={`flex flex-col ${idx % 2 === 0 ? 'items-center md:items-end text-center md:text-right' : 'items-center md:items-start text-center md:text-left'} w-full relative z-10`}>
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-rose-200/60 rounded-full bg-rose-50/80 text-[10px] sm:text-xs font-cinzel font-bold tracking-[0.2em] text-rose-700 mb-5 shadow-sm">
                                              <Star className="w-3 h-3 text-rose-400 fill-rose-200" />
                                              {event.date}
                                            </div>
                                            
                                            {/* Optional Image */}
                                            {imageUrls[2 + idx] && (
                                              <div className="w-full h-48 sm:h-64 mb-6 rounded-2xl overflow-hidden shadow-md border-2 border-white relative group/img">
                                                <div className="absolute inset-0 bg-rose-900/10 group-hover/img:opacity-0 transition-opacity duration-500 z-10"></div>
                                                <img 
                                                    src={imageUrls[2 + idx]} 
                                                    alt={event.title}
                                                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover/img:scale-110"
                                                />
                                              </div>
                                            )}

                                            <h3 className="font-vibes text-4xl sm:text-5xl text-rose-800 mb-3 leading-tight tracking-wide">
                                                {event.title}
                                            </h3>
                                            
                                            <div className={`w-12 h-0.5 bg-rose-200 mb-4 ${idx % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}></div>

                                            <p className="text-sm sm:text-base text-rose-900/75 leading-relaxed font-lora">
                                                {event.description}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Small connecting dot on the card edge */}
                                    <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-rose-200 z-30 ${idx % 2 === 0 ? '-right-[8px]' : '-left-[8px]'}`}></div>
                                </motion.div>
                                
                                <div className="md:w-[55%] hidden md:block"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        </>
        )}

        {imageUrls.slice(5, 17).some(url => url) && (
            <>
            <OrnateDivider />
            {/* OUR GALLERY - ETHEREAL LIGHT THEME */}
            <section className="py-24 w-full relative z-10 bg-gradient-to-b from-white via-rose-50/30 to-white overflow-hidden shadow-[0_-20px_50px_rgba(255,228,230,0.5)]">
                {/* Soft Textures and Lighting */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-textile.png')] opacity-40 mix-blend-multiply"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-100/50 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-100/50 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                    <motion.h2 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="font-vibes text-3xl sm:text-5xl md:text-7xl text-rose-800 text-center mb-16 sm:mb-24 relative whitespace-nowrap"
                    >
                        <span className="absolute -top-4 sm:-top-10 left-1/2 -translate-x-1/2 opacity-5 font-cormorant text-[18vw] lg:text-[10rem] tracking-widest leading-none z-0 text-rose-900">Memories</span>
                        <div className="flex items-center justify-center gap-4 relative z-10 w-full mb-2">
                           <div className="h-[1px] bg-gradient-to-l from-rose-300 to-transparent flex-1 max-w-[150px]"></div>
                           <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-300 fill-rose-100 drop-shadow-sm" />
                           <div className="h-[1px] bg-gradient-to-r from-rose-300 to-transparent flex-1 max-w-[150px]"></div>
                        </div>
                        <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-rose-400">{(anniversaryDetails as any).galleryLabel || "Our Beautiful Moments"}</span>
                    </motion.h2>

                    <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-12 space-y-3 sm:space-y-12 py-8">
                        {imageUrls.slice(5, 17).map((url, idx) => {
                            if (!url) return null;
                            const tilt = idx % 3 === 0 ? 'rotate-1' : (idx % 2 === 0 ? '-rotate-1' : 'rotate-2');
                            
                            return (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 1, delay: (idx % 4) * 0.1, type: "spring", bounce: 0.5 }}
                                    className={`inline-block w-full break-inside-avoid relative group cursor-pointer ${tilt}`}
                                >
                                    {/* Elegantly Crafted French Matting Frame */}
                                    <div className="relative p-5 md:p-6 bg-white shadow-[0_20px_50px_rgba(255,192,203,0.3)] border border-rose-50 transition-all duration-700 ease-in-out group-hover:shadow-[0_30px_70px_rgba(225,29,72,0.25)] group-hover:-translate-y-4">
                                        
                                        {/* Outer delicate lined border */}
                                        <div className="absolute inset-3 border border-rose-200/50 pointer-events-none z-20"></div>
                                        
                                        {/* Inner delicate lined border */}
                                        <div className="absolute inset-4 border border-rose-100 pointer-events-none z-20"></div>

                                        {/* Golden Corner Dots for French Matting look */}
                                        <div className="absolute top-[10px] left-[10px] w-1.5 h-1.5 rounded-full bg-rose-300 shadow-sm z-30"></div>
                                        <div className="absolute top-[10px] right-[10px] w-1.5 h-1.5 rounded-full bg-rose-300 shadow-sm z-30"></div>
                                        <div className="absolute bottom-[10px] left-[10px] w-1.5 h-1.5 rounded-full bg-rose-300 shadow-sm z-30"></div>
                                        <div className="absolute bottom-[10px] right-[10px] w-1.5 h-1.5 rounded-full bg-rose-300 shadow-sm z-30"></div>

                                        <div className="relative w-full overflow-hidden bg-rose-50 border border-rose-100 shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] z-10">
                                            <img 
                                                src={url} 
                                                alt={`Gallery ${idx + 1}`}
                                                className="w-full h-auto max-h-[450px] object-cover filter contrast-[0.95] sepia-[0.1] brightness-105 transition-all duration-[2000ms] group-hover:scale-110 group-hover:sepia-0 group-hover:contrast-100 group-hover:brightness-[1.1]"
                                            />
                                        </div>
                                        
                                        {/* Floating soft aura behind the frame */}
                                        <div className="absolute inset-0 bg-rose-200 blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-1000 -z-10 rounded-sm"></div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
            </>
        )}

        {message && (
            <>
            <OrnateDivider />
            {/* FINAL MESSAGE - Majestic Letter Envelope */}
        <section className="py-4 sm:py-10 max-w-md sm:max-w-lg mx-auto text-center px-4 relative z-10">
             <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="glass-panel-ornate p-4 sm:p-8 rounded-2xl relative shadow-lg"
             >
                 {/* Elegant corner flourishes using SVGs or icons */}
                 <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex rotate-45 opacity-50"><Heart className="w-2 h-2 text-rose-400"/><div className="w-4 sm:w-6 h-px bg-rose-400 mt-1"></div></div>
                 <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex -rotate-45 opacity-50"><div className="w-4 sm:w-6 h-px bg-rose-400 mt-1"></div><Heart className="w-2 h-2 text-rose-400"/></div>
                 <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex -rotate-45 opacity-50"><Heart className="w-2 h-2 text-rose-400"/><div className="w-4 sm:w-6 h-px bg-rose-400 mt-1"></div></div>
                 <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex rotate-45 opacity-50"><div className="w-4 sm:w-6 h-px bg-rose-400 mt-1"></div><Heart className="w-2 h-2 text-rose-400"/></div>

                 <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-rose-200 mx-auto mb-2 sm:mb-4 opacity-60" />
                 
                 <p className="font-cormorant italic font-medium text-lg sm:text-2xl text-rose-950 leading-relaxed mb-4 sm:mb-6 mx-auto relative z-10 px-2 sm:px-0">
                     {message}
                 </p>
                 
                 <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6 w-full max-w-[120px] sm:max-w-[160px] mx-auto">
                    <div className="flex-1 h-px bg-rose-300"></div>
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500 fill-rose-300" />
                    <div className="flex-1 h-px bg-rose-300"></div>
                 </div>
                 
                 <h3 className="font-vibes text-2xl sm:text-3xl text-rose-700">
                     With all my love,<br/>
                     <span className="text-3xl sm:text-4xl text-rose-900 mt-1 block">{senderName}</span>
                 </h3>
             </motion.div>
        </section>
            </>
        )}

        {/* FOOTER WAX SEAL */}
        <div className="flex justify-center mb-16 relative z-10 mt-12">
            <motion.div 
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, type: "spring", bounce: 0.5 }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-600 to-red-800 shadow-[0_10px_20px_rgba(159,18,57,0.4)] flex items-center justify-center border-4 border-rose-300/30 relative"
            >
                {/* Wax seal inner rim */}
                <div className="absolute inset-2 border-2 border-dashed border-rose-400/50 rounded-full"></div>
                <div className="font-cinzel text-xs tracking-widest font-bold text-rose-100 uppercase text-center relative z-10">
                    {anniversaryDetails.thankYouLabel || "Thank You"}
                </div>
            </motion.div>
        </div>
        
        <div className="text-center font-lora text-xs text-rose-900/40 pb-8 uppercase tracking-widest">
           An Anniversary Masterpiece by Wishlink Express
        </div>

      </div>
    </>
  );
};

export default AnniversaryTemplate;
