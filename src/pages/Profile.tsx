import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, ExternalLink, RefreshCw, Copy, Check, Heart, Sparkles, Image as ImageIcon, Flame, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { WishPage } from "@/types/wish";
import { API_BASE_URL } from "@/config";

interface UserProfile {
  username: string;
  email: string;
}

// Neo-Brutalist utility classes
const brutalBorder = "border-[3px] border-black";
const brutalShadow = "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]";
const brutalShadowHover = "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px]";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to view your profile");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      // Fetch User Info
      const userRes = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      } else {
        throw new Error("Failed to fetch profile");
      }

      // Fetch User Pages
      const pagesRes = await fetch(`${API_BASE_URL}/api/page/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (pagesRes.ok) {
        const pagesData = await pagesRes.json();
        setPages(pagesData);
      } else {
        throw new Error("Failed to fetch pages");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex justify-center items-center">
        <RefreshCw className="w-12 h-12 text-black animate-spin" />
      </div>
    );
  }

  // Calculate Stats
  const totalLinks = pages.length;
  const paidLinks = pages.filter(p => p.content?.paymentStatus === 'success').length;
  const totalSpent = paidLinks * 49;

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-body text-black selection:bg-[#ff90e8] selection:text-black">
      {/* Background Dot Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

      {/* Neo-brutalist Header */}
      <nav className={`relative z-10 w-full bg-[#c4b5fd] ${brutalBorder} border-t-0 border-l-0 border-r-0`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")} 
            className={`flex items-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 ${brutalBorder} ${brutalShadowHover} transition-all duration-200 cursor-pointer text-black`}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
            <span className="font-display font-black text-lg sm:text-xl md:text-2xl tracking-tight uppercase">Home</span>
          </button>
          
          <div className="flex gap-4">
            <Button 
               onClick={() => navigate("/create")}
               className={`hidden sm:flex bg-[#fde047] text-black font-black uppercase tracking-widest ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all rounded-none h-10 sm:h-12 px-3 sm:px-4 md:px-6 text-sm`}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> CREATE NEW
            </Button>
            <Button 
               onClick={handleLogout}
               className={`bg-white text-black font-black uppercase tracking-widest ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all rounded-none h-10 sm:h-12 px-3 sm:px-4 md:px-6 text-sm`}
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-black" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-12">
        {/* User Stats Brutalist Block */}
        <div className={`bg-[#ff90e8] p-3 sm:p-5 md:p-8 lg:p-12 mb-6 sm:mb-10 lg:mb-16 ${brutalBorder} ${brutalShadow} relative overflow-hidden`}>
           {/* Decorative corner element */}
           <div className={`absolute -right-6 sm:-right-8 -top-6 sm:-top-8 w-16 sm:w-20 lg:w-32 h-16 sm:h-20 lg:h-32 bg-[#fde047] rounded-full ${brutalBorder}`}></div>

           <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-10 items-start md:items-center justify-between relative z-10">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              <div className={`w-10 sm:w-14 md:w-20 lg:w-24 h-10 sm:h-14 md:h-20 lg:h-24 bg-white ${brutalBorder} ${brutalShadow} flex items-center justify-center rotate-3`}>
                <User className="w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 lg:w-12 lg:h-12 text-black" />
              </div>
              <div className="bg-white/50 backdrop-blur-sm p-1.5 sm:p-2 md:p-3 lg:p-4 w-fit border-2 border-black border-dashed">
                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-1" style={{ textShadow: "2px 2px 0px #fff" }}>{user?.username}</h1>
                <p className="font-bold text-xs sm:text-sm md:text-base lg:text-lg">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-4 lg:gap-6 w-full md:w-auto mt-2 md:mt-0">
              {[
                { label: "Total Links", value: totalLinks, bg: "bg-white", rotate: "-rotate-2" },
                { label: "Paid Links", value: paidLinks, bg: "bg-[#86efac]", rotate: "rotate-2" },
                { label: "Amount Spent", value: `₹${totalSpent}`, bg: "bg-[#93c5fd]", rotate: "-rotate-1" }
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} ${brutalBorder} p-1.5 sm:p-2 md:p-4 text-center ${brutalShadow} ${stat.rotate} transition-transform hover:rotate-0`}>
                  <p className="text-[8px] sm:text-xs font-black uppercase tracking-widest mb-1 sm:mb-2 px-1 sm:px-2 border-b-2 border-black pb-1">{stat.label}</p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Links Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter flex items-center gap-2 sm:gap-3" style={{ textShadow: "2px 2px 0px #000", color: "#fde047" }}>
             <Flame className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 fill-current text-current shrink-0" /> 
             My Magic Links
          </h2>
          <Button 
            onClick={() => navigate("/create")} 
            className={`w-full sm:w-auto md:hidden bg-[#fde047] text-black font-black uppercase tracking-widest ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all rounded-none text-sm`}
          >
            CREATE
          </Button>
        </div>

        {/* Empty State vs Grid */}
        {pages.length === 0 ? (
          <div className={`bg-[#93c5fd] p-8 sm:p-12 lg:p-16 text-center flex flex-col items-center justify-center ${brutalBorder} ${brutalShadow}`}>
            <div className={`w-20 sm:w-24 lg:w-32 h-20 sm:h-24 lg:h-32 mb-6 sm:mb-8 bg-white ${brutalBorder} ${brutalShadow} flex items-center justify-center -rotate-6`}>
              <Heart className="w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 text-black fill-[#ff0844]" />
            </div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-3 sm:mb-4" style={{ textShadow: "2px 2px 0px #fff" }}>No links created yet!</h3>
            <p className="text-base sm:text-lg md:text-xl font-bold max-w-md mx-auto mb-6 sm:mb-8 lg:mb-10">Start sharing beautiful, personalized web pages with your loved ones.</p>
            <Button size="lg" className={`bg-[#fde047] text-black text-sm sm:text-base lg:text-xl font-black uppercase tracking-widest rounded-none h-12 sm:h-14 lg:h-16 px-6 sm:px-8 lg:px-10 ${brutalBorder} ${brutalShadow} ${brutalShadowHover}`} onClick={() => navigate("/create")}>
               CREATE YOUR FIRST LINK
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-4 sm:mt-6 lg:mt-0">
            {pages.map((page) => {
              const thumbnail = page.images && page.images.length > 0 ? page.images[0] : null;
              
              const isPaid = page.content?.paymentStatus === 'success';

              return (
                <div key={page._id} className={`bg-white ${brutalBorder} ${brutalShadow} transition-all duration-300 flex flex-col group`}>
                  {/* Card Image Area */}
                  <div className={`h-20 sm:h-32 lg:h-48 relative overflow-hidden w-full ${brutalBorder} border-t-0 border-l-0 border-r-0`}>
                    {thumbnail ? (
                      <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-[#c4b5fd] flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 sm:w-10 sm:h-12 lg:w-16 lg:h-16 text-black opacity-30" />
                      </div>
                    )}
                    
                    {/* Tags */}
                    <div className="absolute top-1.5 sm:top-2 lg:top-4 right-1.5 sm:right-2 lg:right-4 flex flex-col gap-1 sm:gap-2">
                      <span className={`px-1.5 sm:px-2 lg:px-4 py-0.5 sm:py-1 text-[8px] sm:text-xs lg:text-sm font-black uppercase ${brutalBorder} ${
                        isPaid ? 'bg-[#86efac] text-black' : 'bg-[#fde047] text-black'
                      }`}>
                        {isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div className="absolute top-1.5 sm:top-2 lg:top-4 left-1.5 sm:left-2 lg:left-4">
                       <span className={`px-1.5 sm:px-2 lg:px-4 py-0.5 sm:py-1 text-[8px] sm:text-xs lg:text-sm font-black uppercase ${brutalBorder} bg-white text-black`}>
                         {page.content?.templateType || 'Standard'}
                       </span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-2 sm:p-4 lg:p-6 flex flex-col flex-1 bg-[#FFFDF7]">
                    <h3 className="font-display font-black text-[10px] sm:text-lg lg:text-2xl uppercase tracking-tight text-black line-clamp-1 mb-1 sm:mb-2">
                      {page.content?.senderName || 'Someone'} <span className="text-[8px] sm:text-lg lg:text-xl text-black font-bold mx-0.5 sm:mx-1 lowercase">to</span> {page.content?.receiverName || 'Someone Special'}
                    </h3>
                    
                    <div className="w-full h-[1.5px] sm:h-1 bg-black mb-1.5 sm:mb-2 lg:mb-4"></div>

                    <p className="text-[8px] sm:text-base lg:text-lg font-bold text-black/80 line-clamp-2 mt-1 sm:mt-2 mb-2 sm:mb-4 lg:mb-8 bg-white p-1.5 sm:p-3 border-2 border-dashed border-black">
                      "{page.content?.message || 'No message provided.'}"
                    </p>

                    <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-1.5 sm:gap-2 lg:gap-4 mt-auto">
                      <Button 
                         className={`flex-1 h-6 sm:h-10 lg:h-12 bg-white text-black font-black uppercase tracking-tight sm:tracking-widest rounded-none border-[1.5px] sm:border-[2px] lg:${brutalBorder} hover:bg-[#86efac] transition-colors p-0 sm:px-4 text-[8px] sm:text-xs lg:text-sm`} 
                         onClick={() => window.open(`/p/${page.customUrlData}`, "_blank")}
                      >
                         <ExternalLink className="w-2.5 h-2.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" /> View
                      </Button>
                      <Button 
                        className={`flex-1 h-6 sm:h-10 lg:h-12 text-black font-black uppercase tracking-tight sm:tracking-widest rounded-none transition-colors border-[1.5px] sm:border-[2px] lg:${brutalBorder} ${copiedSlug === page.customUrlData ? 'bg-[#86efac]' : 'bg-[#93c5fd] hover:bg-[#fde047]'} p-0 sm:px-4 text-[8px] sm:text-xs lg:text-sm`}
                        onClick={() => handleCopy(page.customUrlData)}
                      >
                        {copiedSlug === page.customUrlData ? (
                          <><Check className="w-2.5 h-2.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" /> Copied</>
                        ) : (
                          <><Copy className="w-2.5 h-2.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" /> Copy</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
