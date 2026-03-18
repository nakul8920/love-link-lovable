import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, ExternalLink, RefreshCw, Copy, Check, Heart, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { WishPage } from "@/types/wish";

interface UserProfile {
  username: string;
  email: string;
}

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
      const userRes = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      } else {
        throw new Error("Failed to fetch profile");
      }

      // Fetch User Pages
      const pagesRes = await fetch("http://localhost:5000/api/page/user", {
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
      <div className="min-h-screen bg-background flex justify-center items-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Calculate Stats
  const totalLinks = pages.length;
  const paidLinks = pages.filter(p => p.content?.paymentStatus === 'success').length;
  const totalSpent = paidLinks * 49;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <User className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-foreground">My Profile</span>
          </button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* User Stats Card */}
        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center p-1 shadow-glow">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-1">{user?.username}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 w-full md:w-auto">
              <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border text-center">
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Total Links</p>
                <p className="text-2xl font-bold text-foreground">{totalLinks}</p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border text-center">
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Paid Links</p>
                <p className="text-2xl font-bold text-foreground">{paidLinks}</p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border text-center">
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Amount Spent</p>
                <p className="text-2xl font-bold text-foreground">₹{totalSpent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> My Created Links
          </h2>
          <Button onClick={() => navigate("/create")} className="gradient-primary text-primary-foreground font-medium rounded-full hidden sm:flex">
            Create New Link
          </Button>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground bg-card rounded-2xl border border-border shadow-card flex flex-col items-center justify-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-12 h-12 text-primary opacity-80" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No links created yet</h3>
            <p className="max-w-md mx-auto mb-8">Share beautiful moments with your loved ones by creating your very first WishLink.</p>
            <Button size="lg" className="gradient-primary" onClick={() => navigate("/create")}>
              Create Your First Link
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => {
              const thumbnail = page.images && page.images.length > 0 ? page.images[0] : null;

              return (
                <div key={page._id} className="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-glow transition-all duration-300 flex flex-col group">
                  {/* Card Image Area */}
                  <div className="h-40 relative bg-secondary overflow-hidden w-full">
                    {thumbnail ? (
                      <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full gradient-hero opacity-80 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-muted-foreground opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md ${
                        page.content?.paymentStatus === 'success' 
                          ? 'bg-green-500/90 text-white' 
                          : 'bg-yellow-500/90 text-white'
                      }`}>
                        {page.content?.paymentStatus === 'success' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                       <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-background/90 backdrop-blur-md text-foreground shadow-sm">
                         {page.content?.templateType || 'Standard'}
                       </span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-lg text-foreground line-clamp-1 mb-1" title={`${page.content?.senderName || 'Someone'} → ${page.content?.receiverName || 'Someone Special'}`}>
                      {page.content?.senderName || 'Someone'} <span className="text-muted-foreground text-sm font-normal mx-1">to</span> {page.content?.receiverName || 'Someone Special'}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2 mb-4 italic flex-1">
                      "{page.content?.message || 'No message provided.'}"
                    </p>

                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border">
                      <Button size="sm" className="flex-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20" onClick={() => window.open(`/p/${page.customUrlData}`, "_blank")}>
                        <ExternalLink className="w-3 h-3 mr-1.5" /> View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className={`flex-1 rounded-full text-xs font-medium transition-colors ${copiedSlug === page.customUrlData ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
                        onClick={() => handleCopy(page.customUrlData)}
                      >
                        {copiedSlug === page.customUrlData ? (
                          <><Check className="w-3 h-3 mr-1.5 text-green-600" /> Copied</>
                        ) : (
                          <><Copy className="w-3 h-3 mr-1.5" /> Copy Link</>
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
