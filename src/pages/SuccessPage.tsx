import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Copy, Share2, Heart, ExternalLink, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

// Tighter brutalist styles for mobile compatibility
const brutalBorder = "border-[3px] border-black";
const brutalShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]";
const brutalShadowHover = "hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] md:hover:translate-x-[4px] md:hover:translate-y-[4px]";

const SuccessPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const link = `${window.location.origin}/p/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("LINK SECURED! 🚀");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this special magic I made for you! ✨ ${link}`)}`, "_blank");
  };

  return (
    <div className="min-h-[100dvh] bg-[#FFFDF7] text-black font-body selection:bg-[#fde047] selection:text-black overflow-x-hidden flex flex-col">
      {/* Background Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)", backgroundSize: "32px 32px" }}></div>

      {/* Tighter Top Banner */}
      <div className={`relative z-10 w-full bg-[#ff90e8] border-b-[3px] border-black py-1.5 sm:py-2 md:py-3 flex justify-between items-center px-3 sm:px-4 md:px-6`}>
        <button 
          onClick={() => navigate("/")} 
          className={`flex items-center gap-0.5 sm:gap-1 md:gap-2 bg-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 font-black uppercase text-[10px] sm:text-xs md:text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all`}
        >
          <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-[#ff0844]" />
          <span className="hidden sm:inline">HOME</span>
        </button>
        <div className="font-black text-[10px] sm:text-xs md:text-lg uppercase tracking-wider bg-black text-white px-2 sm:px-3 md:px-4 py-0.5 sm:py-0.5 md:py-1 -rotate-0.5 sm:-rotate-1 md:-rotate-2">
          MISSION ACCOMPLISHED
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 w-full">
        
        {/* Compact Hero Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full bg-[#c4b5fd] ${brutalBorder} ${brutalShadow} p-4 sm:p-6 md:p-10 mb-4 sm:mb-6 md:mb-10 text-center relative overflow-hidden`}
        >
          {/* Decorative shapes */}
          <Sparkles className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-12 lg:w-16 lg:h-16 text-black opacity-20" />
          <Sparkles className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 lg:w-12 lg:h-12 text-black opacity-20" />
          
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.1, bounce: 0.6 }}
              className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 md:w-24 md:h-24 bg-[#fde047] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-3 sm:mb-4 md:mb-6 rotate-3`}
            >
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-12 text-black" />
            </motion.div>

            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter mb-1.5 sm:mb-2 leading-none"
              style={{ textShadow: "3px 3px 0px #fff" }}
            >
              IT'S ALIVE!
            </h1>
            <p className="text-xs sm:text-sm md:text-lg font-bold bg-black text-white px-2 sm:px-3 py-0.5 sm:py-1 inline-block rotate-0.5 sm:rotate-1">
              Your masterpiece is ready.
            </p>
          </div>
        </motion.div>

        {/* Copy Link Compact Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full mb-4 sm:mb-6 md:mb-10"
        >
          <div className={`flex flex-col sm:flex-row bg-white border-2 border-black ${brutalShadow} p-2 sm:p-3 md:p-5 items-stretch gap-2 sm:gap-3 md:gap-4`} style={{ transform: "rotate(-0.5deg)" }}>
            <div className="flex-1 bg-gray-100 border-2 border-black p-2 sm:p-3 md:p-4 flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide">
               <code className="text-xs sm:text-sm md:text-xl font-bold text-black">{link}</code>
            </div>
            <Button 
              size="lg" 
              onClick={handleCopy} 
              className={`sm:w-auto h-10 sm:h-12 md:h-auto bg-[#86efac] text-black text-sm sm:text-base md:text-xl font-black uppercase rounded-none border-2 border-black hover:bg-[#4ade80] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] md:hover:translate-x-[3px] hover:translate-y-[2px] md:hover:translate-y-[3px]`}
            >
              {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1 sm:mr-2" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1 sm:mr-2" />}
              {copied ? "COPIED!" : "COPY LINK"}
            </Button>
          </div>
        </motion.div>

        {/* Action Grid - Tightly packed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8"
        >
          {/* WhatsApp Card */}
          <div className={`bg-white ${brutalBorder} ${brutalShadow} p-3 sm:p-4 md:p-6 flex flex-col items-center text-center`} style={{ transform: "rotate(0.5deg)" }}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-16 lg:w-16 lg:h-16 bg-[#25D366] rounded-full border-2 border-black flex items-center justify-center mb-2 sm:mb-3 md:mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight mb-1">Send to target</h3>
            <p className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-600 mb-3 sm:mb-4 h-6 sm:h-8">Drop it straight in their DMs.</p>
            <Button 
              onClick={handleWhatsApp} 
              className={`w-full h-10 sm:h-12 md:h-14 bg-[#25D366] text-black text-xs sm:text-sm md:text-lg font-black uppercase tracking-widest rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] sm:hover:translate-x-[3px] hover:translate-y-[2px] sm:hover:translate-y-[3px] transition-all`}
            >
              WHATSAPP <Share2 className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            </Button>
          </div>

          {/* Preview Card */}
          <div className={`bg-white ${brutalBorder} ${brutalShadow} p-3 sm:p-4 md:p-6 flex flex-col items-center text-center`} style={{ transform: "rotate(-1deg)" }}>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-16 lg:w-16 lg:h-16 bg-[#fde047] rounded-full border-2 border-black flex items-center justify-center mb-2 sm:mb-3 md:mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-black" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight mb-1">Check it out</h3>
            <p className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-600 mb-3 sm:mb-4 h-6 sm:h-8">Preview your final creation.</p>
            <Button 
              onClick={() => navigate(`/p/${slug}`)} 
              className={`w-full h-10 sm:h-12 md:h-14 bg-black text-white text-xs sm:text-sm md:text-lg font-black uppercase tracking-widest rounded-none border-2 border-black shadow-[2px_2px_0px_0px_#ff90e8] sm:shadow-[3px_3px_0px_0px_#ff90e8] hover:shadow-none hover:translate-x-[2px] sm:hover:translate-x-[3px] hover:translate-y-[2px] sm:hover:translate-y-[3px] transition-all group`}
            >
              PREVIEW <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:scale-125 transition-transform" />
            </Button>
          </div>
        </motion.div>

        {/* Create Another - Small but punchy */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full text-center mt-auto"
        >
          <Button 
            onClick={() => navigate("/create")} 
            variant="outline"
            className={`h-10 sm:h-12 md:h-14 px-3 sm:px-4 md:px-6 lg:px-10 bg-transparent text-black text-xs sm:text-sm md:text-base font-black uppercase tracking-widest rounded-none border-2 border-black border-dashed hover:bg-[#fde047] hover:border-solid hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center mx-auto`}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> CREATE ANOTHER
          </Button>
        </motion.div>

      </div>
    </div>
  );
};

export default SuccessPage;
