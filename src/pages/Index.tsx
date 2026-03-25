import { motion } from "framer-motion";
import { Heart, ArrowRight, Sparkles, Gift, Star, Zap, Camera, MoveRight, Flame, PlayCircle, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Neo-Brutalist shadow classes for reusability
const brutalShadow = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]";
const brutalShadowHover = "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px]";
const brutalBorder = "border-[3px] border-black";

const LandingPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-black font-body overflow-x-hidden selection:bg-[#ff90e8] selection:text-black">

      {/* Background Dot Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

      {/* Neo-brutalist Navbar */}
      <nav className={`fixed top-0 w-full z-50 bg-[#c4b5fd] ${brutalBorder} border-t-0 border-l-0 border-r-0 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-12 py-4">
          <motion.div
            whileHover={{ rotate: -5, scale: 1.05 }}
            className={`flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-full ${brutalBorder} ${brutalShadow}`}
            onClick={() => navigate("/")}
          >
            <Heart className="w-5 h-5 text-black fill-[#ff90e8]" />
            <span className="font-display text-xl font-bold tracking-tight">WishLink</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8 font-bold text-lg">
            <a href="#features" className="hover:underline decoration-4 underline-offset-4 decoration-black">Features</a>
            <a href="#templates" className="hover:underline decoration-4 underline-offset-4 decoration-black">Templates</a>
            <a href="#how" className="hover:underline decoration-4 underline-offset-4 decoration-black">How it works</a>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/profile")}
                  className="flex font-bold text-base sm:text-lg hover:underline decoration-4 underline-offset-4 decoration-black bg-transparent hover:bg-transparent text-black px-2 sm:px-4"
                >
                  Profile
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  className={`bg-white text-black font-bold uppercase ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all rounded-none h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base`}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="flex font-bold text-base sm:text-lg hover:underline decoration-4 underline-offset-4 decoration-black bg-transparent hover:bg-transparent text-black px-2 sm:px-4"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                  className={`bg-[#ff90e8] text-black font-bold uppercase tracking-widest ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all rounded-none h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base`}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">

        {/* Playful Hero Section */}
        <section className="relative flex flex-col items-center text-center px-6 max-w-6xl mx-auto min-h-[60vh] justify-center mt-12 mb-20">

          <motion.div
            initial={{ opacity: 0, y: -20, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
            className={`inline-flex items-center gap-2 px-6 py-2 bg-[#fde047] ${brutalBorder} ${brutalShadow} font-bold text-sm sm:text-base uppercase tracking-wider mb-8 -rotate-3`}
          >
            <Flame className="w-5 h-5 text-black fill-black" />
            The internet's funnest gifting app
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-[7rem] font-black leading-[0.9] tracking-tighter uppercase"
            style={{ textShadow: "4px 4px 0px #000" }}
          >
            <span className="text-[#ff90e8]">Don't text.</span>
            <br />
            <span className="text-white">Send Magic.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-xl sm:text-2xl text-black font-semibold max-w-3xl leading-snug border-black/10 p-6 bg-white/50 backdrop-blur-sm rounded-xl border-dashed border-4"
          >
            Build stunning, hyper-personalized animated web pages for Birthdays, Valentines, and Anniversaries. Drop in your photos, mash a button, and share the link instantly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <Button
              size="lg"
              onClick={() => { document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`w-full sm:w-auto h-16 px-10 bg-[#86efac] text-black text-xl font-black uppercase tracking-widest rounded-none ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all duration-200 group`}
            >
              Start Creating
              <MoveRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`w-full sm:w-auto h-16 px-10 bg-white text-black text-xl font-bold uppercase tracking-widest rounded-none ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all duration-200`}
            >
              <PlayCircle className="w-6 h-6 mr-3" />
              Watch Demo
            </Button>
          </motion.div>
        </section>

        {/* Scrolling Marquee - Brutalist style */}
        <div className={`w-full py-4 bg-[#60a5fa] ${brutalBorder} border-l-0 border-r-0 overflow-hidden flex whitespace-nowrap mb-32`}>
          <div className="flex animate-marquee min-w-max gap-8 items-center text-black font-black uppercase text-2xl tracking-widest">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-16 items-center px-8">
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
        <section id="features" className="max-w-7xl mx-auto px-6 mb-32">
          <div className="mb-16">
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter" style={{ textShadow: "3px 3px 0px #000" }}><span className="text-[#fde047]">KILLER</span> FEATURES.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Palette className="w-12 h-12" />, title: "LOUD DESIGNS", desc: "No boring minimalist crap. Every theme is designed to grab attention and melt hearts.", bg: "bg-[#ff90e8]" },
              { icon: <Zap className="w-12 h-12" />, title: "BLAZING FAST", desc: "Our engine renders your magical page in milliseconds. It's so fast it's basically time travel.", bg: "bg-[#86efac]" },
              { icon: <Camera className="w-12 h-12" />, title: "PHOTO BOMBS", desc: "Upload massive raw photos. We optimize them on the fly to keep the experience buttery smooth.", bg: "bg-[#93c5fd]" }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, rotate: i % 2 === 0 ? 2 : -2 }}
                className={`relative ${f.bg} ${brutalBorder} ${brutalShadow} p-8 flex flex-col transition-transform duration-200`}
              >
                <div className={`w-20 h-20 bg-white ${brutalBorder} flex items-center justify-center mb-8`}>
                  {f.icon}
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight mb-4">{f.title}</h3>
                <p className="text-lg font-bold leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Templates - Brutalist Cards */}
        <section id="templates" className={`max-w-7xl mx-auto px-6 mb-32 py-24 bg-[#ff90e8] ${brutalBorder} border-l-0 border-r-0`}>
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter text-white" style={{ textShadow: "4px 4px 0px #000" }}>PICK YOUR POISON.</h2>
            <p className="text-2xl font-bold mt-4 max-w-2xl mx-auto">Choose a theme that matches your vibe.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "VALENTINE", available: true, bg: "bg-white", icon: <Heart className="w-16 h-16 fill-[#ff0844]" /> },
              { label: "BIRTHDAY", available: false, bg: "bg-[#fde047]", icon: <Gift className="w-16 h-16 fill-black" /> },
              { label: "ANNIVERSARY", available: false, bg: "bg-[#c4b5fd]", icon: <Star className="w-16 h-16 fill-black" /> },
              { label: "SURPRISE", available: false, bg: "bg-[#86efac]", icon: <Sparkles className="w-16 h-16 fill-black" /> },
            ].map((t, i) => (
              <div
                key={i}
                className={`group relative ${t.bg} ${brutalBorder} ${brutalShadow} ${t.available ? brutalShadowHover : 'opacity-70 grayscale'} p-8 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[300px] text-center`}
                onClick={() => t.available && navigate(`/create?theme=${t.label.toLowerCase()}`)}
              >
                {!t.available && (
                  <div className={`absolute -top-4 -right-4 bg-black text-white px-4 py-2 font-black uppercase tracking-widest text-sm ${brutalBorder} rotate-12`}>
                    Coming Soon!
                  </div>
                )}

                <div className="mb-8 group-hover:scale-125 transition-transform duration-300">
                  {t.icon}
                </div>

                <h3 className="text-3xl font-black tracking-tight">{t.label}</h3>
                {t.available && (
                  <div className={`mt-6 bg-black text-white px-6 py-2 font-black uppercase w-full ${brutalBorder} group-hover:bg-[#ff90e8] group-hover:text-black transition-colors`}>
                    Use Theme
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* How It Works - Step by Step Brutalist Style */}
        <section id="how" className="max-w-6xl mx-auto px-6 mb-32">
          <div className="mb-16">
            <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter text-white" style={{ textShadow: "4px 4px 0px #000" }}>HOW IT WORKS.</h2>
          </div>

          <div className="space-y-8">
            {[
              { n: "1", t: "BUILD THE MAGIC", d: "Fill in names, type your heartfelt message, and drop in your favorite photos.", bg: "bg-[#fde047]" },
              { n: "2", t: "WE DO THE HEAVY LIFTING", d: "Our servers crush the data into a stunning, responsive, fully animated webpage.", bg: "bg-[#93c5fd]" },
              { n: "3", t: "SHARE THE LOVE", d: "Copy your magic link and share it anywhere. Watch their jaw drop.", bg: "bg-[#86efac]" },
            ].map((s, i) => (
              <div key={s.n} className={`flex flex-col md:flex-row items-center gap-8 ${s.bg} ${brutalBorder} ${brutalShadow} p-8 md:p-12`}>
                <div className={`w-24 h-24 shrink-0 bg-white ${brutalBorder} ${brutalShadow} flex items-center justify-center text-5xl font-black`}>
                  {s.n}
                </div>
                <div>
                  <h3 className="text-4xl font-black uppercase tracking-tight mb-4">{s.t}</h3>
                  <p className="text-xl font-bold">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Wild CTA Section */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className={`bg-black text-white ${brutalBorder} p-12 sm:p-24 text-center relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)", backgroundSize: "40px 40px" }}></div>

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-5xl sm:text-[6rem] font-black uppercase tracking-tighter leading-none mb-8 text-[#ff90e8]" style={{ textShadow: "4px 4px 0px #fff" }}>
                Ready to<br />go viral?
              </h2>
              <p className="text-2xl font-bold max-w-2xl mb-12">
                Join the hundreds of thousands of people creating digital magic.
              </p>
              <Button
                size="lg"
                onClick={() => { document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`h-20 px-12 bg-[#fde047] text-black text-2xl font-black uppercase tracking-widest rounded-none ${brutalBorder} shadow-[8px_8px_0px_#fff] hover:shadow-[2px_2px_0px_#fff] hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200`}
              >
                CREATE FOR FREE NOW
              </Button>
            </div>
          </div>
        </section>

      </main>

      {/* Brutalist Footer */}
      <footer className={`${brutalBorder} border-b-0 border-l-0 border-r-0 py-12 px-6 bg-white`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <span className="font-black text-3xl uppercase tracking-tighter">WISHLINK INC.</span>
            <p className="font-bold mt-2">Putting the fun back into gifting.</p>
          </div>
          <div className="text-xl font-black uppercase border-2 border-black px-4 py-2">
            © 2026 DO NOT STEAL
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-lg font-bold uppercase underline decoration-4 underline-offset-4">
            <a href="#" className="hover:text-[#ff90e8]">Privacy</a>
            <a href="#" className="hover:text-[#fde047]">Terms</a>
            <a href="#" className="hover:text-[#60a5fa]">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
