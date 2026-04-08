import { motion } from "framer-motion";
import { Heart, ArrowRight, Sparkles, Gift, Star, Zap, Camera, MoveRight, Flame, PlayCircle, Palette, Menu, X, UserRound, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const supportEmail =
  (import.meta.env.VITE_SUPPORT_EMAIL as string | undefined)?.trim() || "hello@codequil.com";

// Neo-Brutalist shadow classes for reusability
const brutalShadow = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]";
const brutalShadowHover = "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px]";
const brutalBorder = "border-[3px] border-black";

const LandingPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-black font-body overflow-x-hidden selection:bg-[#ff90e8] selection:text-black">

      {/* Background Dot Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

      {/* Neo-brutalist Navbar */}
      <nav className={`fixed top-0 w-full z-50 bg-[#c4b5fd] ${brutalBorder} border-t-0 border-l-0 border-r-0 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 md:px-12 py-2 sm:py-3 md:py-4">
          <motion.div
            whileHover={{ rotate: -5, scale: 1.05 }}
            className={`flex items-center gap-1 sm:gap-2 cursor-pointer bg-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full ${brutalBorder} ${brutalShadow}`}
            onClick={() => navigate("/")}
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-black fill-[#ff90e8]" />
            <span className="font-display text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-tight">WishLink</span>
          </motion.div>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-bold text-sm md:text-lg">
            <a href="#features" className="hover:underline decoration-2 sm:decoration-4 underline-offset-2 sm:underline-offset-4 decoration-black text-sm md:text-base">Features</a>
            <a href="#templates" className="hover:underline decoration-2 sm:decoration-4 underline-offset-2 sm:underline-offset-4 decoration-black text-sm md:text-base">Templates</a>
            <a href="#how" className="hover:underline decoration-2 sm:decoration-4 underline-offset-2 sm:underline-offset-4 decoration-black text-sm md:text-base">How it works</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop auth buttons */}
            <div className="hidden lg:flex items-center gap-2 sm:gap-4">
              {isLoggedIn ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/profile")}
                    className="flex font-bold text-xs sm:text-sm md:text-base lg:text-lg hover:underline decoration-2 sm:decoration-4 underline-offset-2 sm:underline-offset-4 decoration-black bg-transparent hover:bg-transparent text-black px-1 sm:px-2 md:px-4 items-center gap-1 sm:gap-2"
                  >
                    <UserRound className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-black" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                  <Button
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                    className={`bg-transparent hover:bg-transparent text-black font-bold uppercase ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all rounded-none h-8 sm:h-10 md:h-12 px-2 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base inline-flex items-center gap-1 sm:gap-2`}
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-black" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/login")}
                    className={`bg-[#ff90e8] text-black font-black uppercase tracking-widest ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all rounded-none h-8 sm:h-10 md:h-12 px-2 sm:px-3 md:px-6 text-[10px] sm:text-xs md:text-sm lg:text-base inline-flex items-center gap-1 sm:gap-2`}
                  >
                    <UserRound strokeWidth={3} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <span className="font-black text-[10px] sm:text-xs md:text-sm lg:text-base leading-none whitespace-nowrap">
                      <span className="hidden sm:inline">Login / Sign Up</span>
                      <span className="sm:hidden">Login</span>
                    </span>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="lg:hidden flex items-center gap-1 sm:gap-1.5">
              {isLoggedIn ? (
                <Button
                  onClick={() => navigate("/profile")}
                  className={`bg-white text-black font-bold uppercase ${brutalBorder} ${brutalShadowHover} transition-all rounded-none h-7 sm:h-8 md:h-9 px-1.5 sm:px-2 text-[10px] sm:text-xs inline-flex items-center gap-1`}
                >
                  <UserRound className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              ) : (
                  <Button
                    onClick={() => navigate("/login")}
                    className={`bg-[#ff90e8] text-black font-black uppercase tracking-widest ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all rounded-none h-7 sm:h-8 md:h-9 px-1 sm:px-1.5 text-[8px] sm:text-[10px] inline-flex items-center gap-1`}
                  >
                    <UserRound strokeWidth={3} className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="font-black text-[8px] sm:text-[10px] leading-none whitespace-nowrap">
                      Login
                    </span>
                  </Button>
              )}

              <Button
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Open menu"
                className={`bg-white text-black ${brutalBorder} ${brutalShadow} ${brutalShadowHover} rounded-none w-8 h-7 sm:w-9 sm:h-8 md:w-10 md:h-9 p-0`}
              >
                {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="relative mx-4 mt-16 mb-4 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-black fill-[#ff90e8]" />
                <span className="font-black tracking-tight">WishLink</span>
              </div>
              <Button
                onClick={() => setMobileMenuOpen(false)}
                className={`bg-[#ff90e8] text-black font-bold uppercase tracking-widest ${brutalBorder} ${brutalShadow} rounded-none h-9 px-3`}
              >
                Close
              </Button>
            </div>

            <div className="p-4 space-y-3">
              <a
                href="#features"
                className="block px-3 py-2 font-bold uppercase tracking-widest hover:underline decoration-4 underline-offset-4 decoration-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#templates"
                className="block px-3 py-2 font-bold uppercase tracking-widest hover:underline decoration-4 underline-offset-4 decoration-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                Templates
              </a>
              <a
                href="#how"
                className="block px-3 py-2 font-bold uppercase tracking-widest hover:underline decoration-4 underline-offset-4 decoration-black"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it works
              </a>

              <div className="pt-2 border-t border-gray-100" />

              {isLoggedIn ? (
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/profile");
                    }}
                    className={`w-full bg-white text-black font-bold uppercase ${brutalBorder} ${brutalShadowHover} transition-all rounded-none h-12 inline-flex items-center justify-center gap-3`}
                  >
                    <UserRound className="w-5 h-5 text-black" />
                    Profile
                  </Button>
                  <Button
                    onClick={() => {
                      localStorage.removeItem("token");
                      setMobileMenuOpen(false);
                      navigate("/login");
                    }}
                    className={`w-full bg-transparent hover:bg-transparent text-black font-bold uppercase ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all rounded-none h-12 inline-flex items-center justify-center gap-3`}
                  >
                    <LogOut className="w-5 h-5 text-black" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/login");
                    }}
                    className={`w-full bg-[#ff90e8] text-black font-black uppercase tracking-widest ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all rounded-none h-12 inline-flex items-center justify-center gap-2`}
                  >
                    <UserRound strokeWidth={3} className="w-4 h-4" />
                    <span className="font-black text-sm leading-none whitespace-nowrap">
                      Login / Sign Up
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <main className="relative z-10 pt-20 sm:pt-28 pb-12 sm:pb-20">

        {/* Playful Hero Section */}
        <section className="relative flex flex-col items-center text-center px-4 sm:px-6 max-w-6xl mx-auto min-h-[44vh] sm:min-h-[60vh] justify-center mt-8 sm:mt-12 mb-14 sm:mb-20">

          <motion.div
            initial={{ opacity: 0, y: -20, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
            className={`inline-flex items-center gap-2 px-3 sm:px-6 py-1.5 sm:py-2 bg-[#fde047] ${brutalBorder} ${brutalShadow} font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-5 sm:mb-8 -rotate-3`}
          >
            <Flame className="w-5 h-5 text-black fill-black" />
            The internet's most delightful gifting app
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7rem] font-black leading-[1.2] sm:leading-[0.9] tracking-tighter uppercase"
            style={{ 
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              textShadow: "none",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              transform: "translateZ(0)"
            }}
          >
            <span className="text-[#ff90e8] block mb-2 sm:mb-0">Don't text</span>
            <span className="text-black block">Send Magic.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 sm:mt-8 text-base sm:text-xl text-black font-semibold max-w-3xl leading-snug border-black/10 p-4 sm:p-6 bg-white/50 backdrop-blur-sm rounded-xl border-dashed border-4"
          >
            Build stunning, hyper-personalized animated web pages for Birthdays, Valentines, and Anniversaries. Drop in your photos, mash a button, and share the link instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.6 }}
            className="mt-8 sm:mt-12 flex flex-row gap-2 sm:gap-4 lg:gap-6 w-full justify-center"
          >
            <Button
              size="lg"
              onClick={() => { document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`flex-1 sm:flex-none h-10 sm:h-12 lg:h-16 px-2 sm:px-6 lg:px-10 bg-[#86efac] text-black hover:text-black text-xs sm:text-sm lg:text-xl font-black uppercase tracking-widest rounded-none ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all duration-200 group`}
            >
              <span className="font-black text-xs sm:text-sm lg:text-xl leading-none whitespace-nowrap">
                Start Creating
              </span>
              <MoveRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 ml-1 sm:ml-2 lg:ml-3 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`flex-1 sm:flex-none h-10 sm:h-12 lg:h-16 px-2 sm:px-6 lg:px-10 bg-white text-xs sm:text-sm lg:text-xl font-bold uppercase tracking-widest rounded-none ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all duration-200`}
            >
              <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 mr-1 sm:mr-2 lg:mr-3" />
              <span className="font-bold text-xs sm:text-sm lg:text-xl">Watch Demo</span>
            </Button>
          </motion.div>
        </section>

        {/* Scrolling Marquee - Brutalist style */}
        <div className={`w-full py-3 sm:py-4 bg-[#60a5fa] ${brutalBorder} border-l-0 border-r-0 overflow-hidden flex whitespace-nowrap mb-20 sm:mb-32`}>
          <div className="flex animate-marquee min-w-max gap-4 sm:gap-8 items-center text-black font-black uppercase text-lg sm:text-2xl tracking-widest">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-10 sm:gap-16 items-center px-4 sm:px-8">
                <span>★ NO MORE BORING CARDS</span>
                <span>★ 100% PERSONALIZED</span>
                <span>★ INSTANT DEPLOYMENT</span>
                <span>★ BREATHTAKING ANIMATIONS</span>
                <span>★ NO MORE BORING CARDS</span>
                <span>★ 100% PERSONALIZED</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hardcore Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 mb-20 sm:mb-32">
          <div className="mb-10 sm:mb-16">
            <motion.h2 
              initial={{ rotate: -2 }}
              whileInView={{ rotate: 0 }}
              className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none" 
              style={{ 
                textShadow: "none",
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              <span className="text-[#fde047]">KILLER</span><br className="sm:hidden" /> FEATURES.
            </motion.h2>
          </div>

          {/* Desktop: Creative Bento Box. Mobile: Compact staggered list */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-4 lg:gap-8 relative">
            
            {[
              { 
                icon: Palette, 
                title: "LOUD DESIGNS", 
                desc: "No boring minimalist crap. Every theme is designed to grab attention and melt hearts.", 
                bg: "bg-[#ff90e8]",
                layoutClass: "lg:col-span-2 lg:row-span-1 lg:flex-row lg:items-center",
                sticker: "RAD",
                iconSize: "lg:w-28 lg:h-28",
                iconSvg: "lg:w-14 lg:h-14"
              },
              { 
                icon: Zap, 
                title: "BLAZING FAST", 
                desc: "Our engine renders your magical page in milliseconds. It's so fast it's basically time travel.", 
                bg: "bg-[#86efac]",
                layoutClass: "lg:col-span-1 lg:row-span-2 lg:flex-col lg:justify-center lg:items-center lg:text-center",
                sticker: "WOW",
                iconSize: "lg:w-32 lg:h-32 mb-0 lg:mb-8",
                iconSvg: "lg:w-16 lg:h-16"
              },
              { 
                icon: Camera, 
                title: "PHOTO BOMBS", 
                desc: "Upload massive raw photos. We optimize them on the fly to keep the experience buttery smooth.", 
                bg: "bg-[#93c5fd]",
                layoutClass: "lg:col-span-2 lg:row-span-1 lg:flex-row lg:items-center",
                sticker: "PRO",
                iconSize: "lg:w-28 lg:h-28",
                iconSvg: "lg:w-14 lg:h-14"
              }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
              <motion.div
                key={i}
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.1, type: "spring" }}
                className={`group relative z-10 ${f.bg} ${brutalBorder} ${brutalShadow} p-4 sm:p-6 lg:p-10 flex flex-row items-start gap-4 lg:gap-8 hover:z-20 rounded-xl lg:rounded-none ${f.layoutClass}`}
              >
                <div className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 ${f.iconSize} bg-white ${brutalBorder} rounded-full lg:rounded-none flex items-center justify-center ${i % 2 === 0 ? "rotate-3" : "-rotate-3"} group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_#000]`}>
                  <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${f.iconSvg} text-black fill-transparent group-hover:scale-110 transition-transform`} />
                </div>
                <div className="flex flex-col pt-1 lg:pt-0">
                  <h3 className={`text-xl sm:text-2xl lg:text-4xl font-black uppercase tracking-tight mb-0.5 lg:mb-4 leading-none ${f.layoutClass.includes("flex-col") ? "lg:text-center" : ""}`}>{f.title}</h3>
                  <p className={`text-xs sm:text-sm lg:text-xl font-bold leading-tight lg:leading-relaxed opacity-90 ${f.layoutClass.includes("flex-col") ? "lg:text-center mt-2" : ""}`}>{f.desc}</p>
                </div>
                {/* Decorative Sticker visible on all devices now */}
                <div className={`absolute -top-3 lg:-top-5 -right-2 lg:-right-4 bg-black text-white text-[10px] lg:text-sm uppercase font-black px-2 lg:px-4 py-0.5 lg:py-1 border-2 border-white ${i % 2 === 0 ? "-rotate-6" : "rotate-12"} shadow-[2px_2px_0px_#fff]`}>
                  {f.sticker}
                </div>
              </motion.div>
            )})}
          </div>
        </section>

        {/* Templates - Brutalist Cards */}
        <section
          id="templates"
          className={`max-w-7xl mx-auto px-4 sm:px-6 mb-20 sm:mb-24 py-16 sm:py-20 bg-[#ff90e8] ${brutalBorder} border-l-0 border-r-0`}
        >
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl md:text-7xl font-black uppercase tracking-tighter text-white"
              style={{ 
                textShadow: "none",
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              PICK YOUR POISON.
            </h2>
            <p className="text-lg sm:text-2xl font-bold mt-3 sm:mt-4 max-w-2xl mx-auto">
              Choose a theme that matches your vibe.
            </p>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6">
            {[
              { label: "VALENTINE", theme: "valentine", available: true, bg: "bg-white", icon: <Heart className="w-10 h-10 sm:w-14 sm:h-14 fill-[#ff0844]" /> },
              { label: "BIRTHDAY", theme: "birthday", available: true, bg: "bg-[#fde047]", icon: <Gift className="w-10 h-10 sm:w-14 sm:h-14 fill-black" /> },
              { label: "ANNIVERSARY", theme: "anniversary", available: true, bg: "bg-[#c4b5fd]", icon: <Star className="w-10 h-10 sm:w-14 sm:h-14 fill-black" /> },
              { label: "CUSTOM", theme: "surprise", available: true, bg: "bg-[#86efac]", icon: <Sparkles className="w-10 h-10 sm:w-14 sm:h-14 fill-black" /> },
            ].map((t, i) => (
              <div
                key={i}
                className={`group relative ${t.bg} ${brutalBorder} ${brutalShadow} ${
                  t.available ? brutalShadowHover : "opacity-70 grayscale"
                } p-2 sm:p-3 lg:p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[120px] xs:min-h-[140px] sm:min-h-[160px] md:min-h-[185px] lg:min-h-[260px] text-center`}
                onClick={() => t.available && navigate(`/create?theme=${t.theme}`)}
              >
                {!t.available && (
                  <div className={`absolute -top-2 -right-2 bg-black text-white px-2 py-0.5 font-black uppercase tracking-widest text-[10px] sm:text-xs ${brutalBorder} rotate-12`}>
                    Coming Soon!
                  </div>
                )}

                <div className="mb-2 sm:mb-3 lg:mb-5 group-hover:scale-125 transition-transform duration-300">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center">
                    {t.icon}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base lg:text-xl md:text-lg font-black tracking-tight leading-none">{t.label}</h3>
                {t.available && (
                  <div
                    className={`mt-1 sm:mt-2 lg:mt-4 bg-black text-white px-1.5 sm:px-2 lg:px-4 py-0.5 sm:py-1 text-[8px] sm:text-[10px] lg:text-sm font-black uppercase w-full ${brutalBorder} group-hover:bg-[#ff90e8] group-hover:text-black transition-colors`}>
                    Use Theme
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* How It Works - New Brutalist Cards */}
        <section id="how" className="max-w-6xl mx-auto px-4 sm:px-6 mb-28 sm:mb-36">
          <div className="mb-10 sm:mb-14">
            <h2
              className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-[#fde047] leading-none"
              style={{ 
                textShadow: "none",
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              HOW IT WORKS.
            </h2>
            <p className="mt-3 text-sm sm:text-base font-bold max-w-3xl text-black/90">
              Three brutal steps from blank to shareable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {[
              {
                n: "1",
                t: "BUILD THE MAGIC",
                d: "Fill in names, type your heartfelt message, and drop in your favorite photos.",
                bg: "bg-[#fde047]",
                icon: Sparkles,
                accentRgb: "253,224,71",
              },
              {
                n: "2",
                t: "WE DO THE HEAVY LIFTING",
                d: "Our servers crush the data into a stunning, responsive, fully animated webpage.",
                bg: "bg-[#93c5fd]",
                icon: Zap,
                accentRgb: "147,197,253",
              },
              {
                n: "3",
                t: "SHARE THE LOVE",
                d: "Copy your magic link and share it anywhere. Watch their jaw drop.",
                bg: "bg-[#86efac]",
                icon: Heart,
                accentRgb: "134,239,172",
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.n}
                  className={`relative group ${brutalBorder} ${brutalShadow} bg-[#FFFDF7] overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className={`h-1 ${s.bg}`} />

                  {/* Subtle texture (removes "blank white" feel) */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(0,0,0,0.22) 0 6px, transparent 6px 16px)",
                    }}
                    aria-hidden="true"
                  />

                  {/* Colored glow blob */}
                  <div
                    className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full pointer-events-none"
                    style={{ backgroundColor: `rgba(${s.accentRgb}, 0.12)` }}
                    aria-hidden="true"
                  />

                  {i < 2 && (
                    <div
                      className="hidden md:block absolute -right-6 top-14 w-12 h-[3px] bg-black/50"
                      aria-hidden="true"
                    />
                  )}

                  <div className="relative p-3 sm:p-4 lg:p-6">
                    <div className="absolute right-2 top-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black/10 leading-none select-none">
                      {s.n}
                    </div>

                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className={`inline-flex items-center gap-2 px-2 py-1 ${s.bg} ${brutalBorder}`}>
                        <span className="font-black uppercase tracking-widest text-[10px]">Step {s.n}</span>
                      </div>
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 ${brutalBorder} ${s.bg} flex items-center justify-center shadow-[3px_3px_0px_#000]`}>
                        <Icon className="w-4 h-4 text-black" />
                      </div>
                    </div>

                    <h3 className="mt-3 sm:mt-5 text-lg sm:text-xl lg:text-2xl font-black uppercase tracking-tight leading-tight max-w-[90%]">
                      {s.t}
                    </h3>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-bold leading-relaxed text-black/85 pr-2">
                      {s.d}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Wild CTA Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
          <div className={`bg-black text-white ${brutalBorder} p-8 sm:p-12 md:p-16 lg:p-24 text-center relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)", backgroundSize: "40px 40px" }}></div>

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6 text-[#ff90e8]" style={{ 
                textShadow: "none",
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                Ready to<br />go viral?
              </h2>
              <p className="text-base sm:text-xl md:text-2xl font-bold max-w-2xl mb-8 sm:mb-10">
                Join the hundreds of thousands of people creating digital magic.
              </p>
              <Button
                size="lg"
                onClick={() => { document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`h-12 sm:h-16 lg:h-20 px-6 sm:px-10 lg:px-12 bg-[#fde047] text-black text-base sm:text-lg lg:text-2xl font-black uppercase tracking-widest rounded-none ${brutalBorder} shadow-[8px_8px_0px_#fff] hover:shadow-[2px_2px_0px_#fff] hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200`}
              >
                CREATE NOW
              </Button>
            </div>
          </div>
        </section>

      </main>

      {/* Enhanced Footer */}
      <footer className={`${brutalBorder} border-b-0 border-l-0 border-r-0 bg-[#FFFDF7] text-black relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "28px 28px" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#ff90e8]/10 via-transparent to-[#86efac]/10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 lg:py-12 relative z-10">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-2 sm:gap-3 lg:gap-6 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-4">
              <div className={`${brutalBorder} ${brutalShadow} bg-gradient-to-br from-[#ff90e8]/20 to-[#86efac]/20 backdrop-blur-sm p-4 sm:p-6 rounded-2xl`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${brutalBorder} bg-gradient-to-br from-[#ff90e8] to-[#fde047] flex items-center justify-center shadow-[4px_4px_0px_#000] rounded-xl`}>
                    <Heart className="w-5 h-5 text-black fill-[#ff90e8]" />
                  </div>
                  <div>
                    <div className="font-black text-xl uppercase tracking-tighter leading-none text-black">Wishlink</div>
                    <div className="font-bold text-xs text-[#ff90e8]/80">Codequil agency tool</div>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm font-medium leading-relaxed text-black/90">
                  Build animated gifting pages and share your magic link instantly.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    className="text-xs font-black uppercase tracking-widest bg-[#ff90e8] text-black px-3 py-1.5 rounded-lg ${brutalBorder} hover:bg-[#fde047] transition-colors"
                    href="#templates"
                  >
                    Templates
                  </a>
                  <a
                    className="text-xs font-black uppercase tracking-widest bg-[#86efac] text-black px-3 py-1.5 rounded-lg ${brutalBorder} hover:bg-[#fde047] transition-colors"
                    href="#how"
                  >
                    How it works
                  </a>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="lg:col-span-8 md:col-span-2 sm:col-span-2">
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 lg:gap-6">
                <div>
                  <h3 className="font-black uppercase tracking-widest text-[10px] sm:text-xs md:text-base mb-1 sm:mb-2 lg:mb-4 text-[#ff90e8]">Product</h3>
                  <ul className="space-y-1 sm:space-y-2">
                    <li><a className="text-black font-medium hover:text-[#fde047] transition-colors text-xs sm:text-sm" href="#features">Features</a></li>
                    <li><a className="text-black font-medium hover:text-[#fde047] transition-colors text-xs sm:text-sm" href="#templates">Templates</a></li>
                    <li><a className="text-black font-medium hover:text-[#fde047] transition-colors text-xs sm:text-sm" href="/create">Create</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-black uppercase tracking-widest text-[10px] sm:text-xs md:text-base mb-1 sm:mb-2 lg:mb-4 text-[#86efac]">Resources</h3>
                  <ul className="space-y-1 sm:space-y-2">
                    <li><a className="text-black font-medium hover:text-[#fde047] transition-colors text-xs sm:text-sm" href="/profile">My pages</a></li>
                    <li><a className="text-black font-medium hover:text-[#fde047] transition-colors text-xs sm:text-sm" href="/login">Login</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-black uppercase tracking-widest text-[10px] sm:text-xs md:text-base mb-1 sm:mb-2 lg:mb-4 text-[#fde047]">Company</h3>
                  <ul className="space-y-1 sm:space-y-2">
                    <li>
                      <a className="text-black font-medium hover:text-[#fde047] transition-colors text-xs sm:text-sm" href="https://codequil.vercel.app/" target="_blank" rel="noreferrer">
                        Codequil
                      </a>
                    </li>
                    <li><a className="text-black font-medium hover:text-[#fde047] transition-colors text-xs sm:text-sm" href="#">Privacy</a></li>
                    <li><a className="text-black font-medium hover:text-[#fde047] transition-colors text-xs sm:text-sm" href="#">Terms</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-black uppercase tracking-widest text-[10px] sm:text-xs md:text-base mb-1 sm:mb-2 lg:mb-4 text-black">Contact</h3>
                  <ul className="space-y-1 sm:space-y-2">
                    <li className="text-black/80 font-medium text-xs sm:text-sm">
                      Email:{" "}
                      <span className="text-[#ff90e8] font-bold">{supportEmail}</span>
                    </li>
                    <li className="text-black/80 font-medium text-xs sm:text-sm">Hours: <span className="font-bold text-[#86efac]">Mon–Sat</span></li>
                    <li>
                      <Link
                        className="text-black font-medium hover:text-[#fde047] transition-colors text-xs sm:text-sm underline underline-offset-2"
                        to="/support"
                      >
                        Support
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-black/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="font-black uppercase tracking-widest text-xs text-black/60">
              © 2026 Wishlink Express
            </div>
            <div className="font-bold text-xs text-black/80">
              Built by{" "}
              <a
                className="text-[#ff90e8] font-black hover:text-[#fde047] transition-colors"
                href="https://codequil.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                Codequil
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
