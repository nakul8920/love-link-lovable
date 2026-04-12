import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Trash2, ExternalLink, LayoutDashboard, Users, FileText, LogOut, MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const getValidImages = (page: any) => {
  let imgs: string[] = [];
  if (page.images && Array.isArray(page.images)) {
    imgs = [...imgs, ...page.images];
  }
  if (page.content?.imageUrls && Array.isArray(page.content.imageUrls)) {
    imgs = [...imgs, ...page.content.imageUrls];
  }
  if (page.content?.surpriseDetails?.sections) {
    page.content.surpriseDetails.sections.forEach((s: any) => {
      if (s.images && Array.isArray(s.images)) {
        imgs = [...imgs, ...s.images];
      }
    });
  }
  return imgs.filter(img => img && img.trim() !== "");
};

const brutalBorder = "border-[3px] border-black";
const brutalShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
const brutalShadowHover = "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]";

const ADMIN_TOKEN_KEY = "adminToken";

function feedbackImageSrc(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function AdminPage() {
  const navigate = useNavigate();
  // Tab/window close clears sessionStorage → admin must log in again next visit
  // Changed to localStorage to keep admin logged in permanently
  const [token, setToken] = useState<string>(() => localStorage.getItem(ADMIN_TOKEN_KEY) || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "pages" | "feedback" | "user_profile">("dashboard");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [stats, setStats] = useState({ totalUsers: 0, totalPages: 0, totalRevenue: 0, totalFeedback: 0 });
  const [usersList, setUsersList] = useState<any[]>([]);
  const [pagesList, setPagesList] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const raw = await res.text();
      let data: { message?: string; token?: string } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        toast.error(data.message || `Login failed (${res.status})`);
        return;
      }

      if (!data.token) {
        toast.error("Server did not return a token. Check API URL and server logs.");
        return;
      }

      setToken(data.token);
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      toast.success("Logged in successfully");
    } catch (err: unknown) {
      console.error("Admin login error:", err);
      toast.error("Network error — check VITE_API_URL, CORS (FRONTEND_URL on server), and that the API is up.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    toast.success("Logged out");
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else if (res.status === 401) {
        toast.error("Session expired — please log in again");
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setUsersList(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/pages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setPagesList(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/feedback`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setFeedbackList(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure? This deletes the user and all their pages.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("User deleted");
        fetchUsers();
        fetchStats();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!window.confirm("Delete this feedback entry?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/feedback/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Feedback removed");
        fetchFeedback();
        fetchStats();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/pages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Page deleted");
        fetchPages();
        fetchStats();
      } else {
        toast.error("Failed to delete page");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
      fetchUsers();
      fetchPages();
      fetchFeedback();
    }
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center p-4">
        <div className={`w-full max-w-sm bg-white p-8 ${brutalBorder} ${brutalShadow}`}>
          <div className="flex justify-center mb-6">
            <div className={`w-12 h-12 bg-black flex items-center justify-center rotate-3`}>
              <Heart className="w-6 h-6 text-[#ff90e8] fill-[#ff90e8]" />
            </div>
          </div>
          <h1 className="text-2xl font-black uppercase text-center mb-6">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-3 bg-gray-50 outline-none focus:bg-white ${brutalBorder} focus:shadow-[2px_2px_0px_#ff90e8] transition-all`}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 bg-gray-50 outline-none focus:bg-white ${brutalBorder} focus:shadow-[2px_2px_0px_#ff90e8] transition-all`}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-12 bg-[#86efac] text-black font-black uppercase tracking-wider rounded-none ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all`}
            >
              {loading ? "Authenticating..." : "Login"}
            </Button>
          </form>
          <button onClick={() => navigate("/")} className="mt-6 text-sm font-bold text-gray-500 hover:text-black hover:underline w-full text-center">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-black font-body selection:bg-[#ff90e8] selection:text-black">
      {/* Top Navbar */}
      <nav className={`sticky top-0 z-50 bg-[#c4b5fd] ${brutalBorder} border-t-0 border-l-0 border-r-0`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className={`p-2 bg-white ${brutalBorder} ${brutalShadowHover} transition-transform`}>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className={`p-1.5 bg-black rotate-[-5deg]`}>
                <Heart className="w-4 h-4 text-[#ff90e8] fill-[#ff90e8]" />
              </div>
              <span className="font-black text-xl tracking-tight uppercase">AdminHQ</span>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            className={`bg-white text-black font-bold uppercase rounded-none h-10 px-4 ${brutalBorder} ${brutalShadow} ${brutalShadowHover} transition-all flex items-center gap-2`}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-3">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 font-black uppercase text-sm transition-all ${brutalBorder} ${activeTab === "dashboard" ? "bg-[#fde047] translate-x-1 translate-y-1 shadow-none" : `bg-white ${brutalShadow} ${brutalShadowHover}`
              }`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 font-black uppercase text-sm transition-all ${brutalBorder} ${activeTab === "users" ? "bg-[#93c5fd] translate-x-1 translate-y-1 shadow-none" : `bg-white ${brutalShadow} ${brutalShadowHover}`
              }`}
          >
            <Users className="w-5 h-5" /> Users ({stats.totalUsers})
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`w-full flex items-center gap-3 px-4 py-3 font-black uppercase text-sm transition-all ${brutalBorder} ${activeTab === "pages" ? "bg-[#ff90e8] translate-x-1 translate-y-1 shadow-none" : `bg-white ${brutalShadow} ${brutalShadowHover}`
              }`}
          >
            <FileText className="w-5 h-5" /> Links ({stats.totalPages})
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`w-full flex items-center gap-3 px-4 py-3 font-black uppercase text-sm transition-all ${brutalBorder} ${activeTab === "feedback" ? "bg-[#86efac] translate-x-1 translate-y-1 shadow-none" : `bg-white ${brutalShadow} ${brutalShadowHover}`
              }`}
          >
            <MessageSquareHeart className="w-5 h-5" /> Feedback ({stats.totalFeedback ?? feedbackList.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Platform Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">

                <div className={`bg-[#93c5fd] p-6 ${brutalBorder} ${brutalShadow} relative overflow-hidden group`}>
                  <Users className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-black uppercase tracking-widest relative z-10">Total Users</p>
                  <p className="text-5xl font-black mt-2 relative z-10">{stats.totalUsers}</p>
                </div>

                <div className={`bg-[#ff90e8] p-6 ${brutalBorder} ${brutalShadow} relative overflow-hidden group`}>
                  <FileText className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-black uppercase tracking-widest relative z-10">Total Links</p>
                  <p className="text-5xl font-black mt-2 relative z-10">{stats.totalPages}</p>
                </div>

                <div className={`bg-[#86efac] p-6 ${brutalBorder} ${brutalShadow} relative overflow-hidden group`}>
                  <span className="absolute -right-4 -bottom-8 text-9xl opacity-20 font-black group-hover:scale-110 transition-transform">₹</span>
                  <p className="text-sm font-black uppercase tracking-widest relative z-10">Est. Revenue</p>
                  <p className="text-5xl font-black mt-2 relative z-10">₹{stats.totalRevenue}</p>
                </div>

                <div className={`bg-[#fde047] p-6 ${brutalBorder} ${brutalShadow} relative overflow-hidden group`}>
                  <MessageSquareHeart className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-black uppercase tracking-widest relative z-10">Feedback</p>
                  <p className="text-5xl font-black mt-2 relative z-10">{stats.totalFeedback ?? 0}</p>
                </div>

              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black uppercase tracking-tight">Manage Users</h2>
                <div className="bg-[#93c5fd] text-black px-3 py-1 font-black text-xs uppercase border-2 border-black">
                  {usersList.length} Accounts
                </div>
              </div>
              <div className="space-y-3">
                {usersList.length === 0 ? (
                  <p className="text-gray-500 font-bold">No users found.</p>
                ) : (
                  usersList.map((user) => (
                    <div key={user._id} className={`bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${brutalBorder} hover:bg-gray-50 transition-colors`}>
                      <div className="min-w-0">
                        <p className="font-black text-lg truncate">{user.username}</p>
                        <p className="text-sm font-bold text-gray-600 truncate">{user.email}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs font-bold text-gray-500">
                          <span>{user.pageCount} Pages Created</span>
                          <span>•</span>
                          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedUser(user);
                            setActiveTab("user_profile");
                          }}
                          className={`rounded-none bg-[#fde047] text-black font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`}
                        >
                          View Profile
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user._id)}
                          variant="destructive"
                          size="sm"
                          className={`rounded-none bg-[#ff0844] text-white font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`}
                        >
                          <Trash2 className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <h2 className="text-3xl font-black uppercase tracking-tight">User feedback</h2>
                <div className="bg-[#fde047] text-black px-3 py-1 font-black text-xs uppercase border-2 border-black">
                  {feedbackList.length} entries
                </div>
              </div>
              <div className="space-y-4">
                {feedbackList.length === 0 ? (
                  <p className="text-gray-500 font-bold">No feedback yet.</p>
                ) : (
                  feedbackList.map((fb) => {
                    const imgs: string[] = Array.isArray(fb.images) ? fb.images.filter(Boolean) : [];
                    const u = fb.user;
                    return (
                      <div key={fb._id} className={`bg-white p-4 sm:p-6 ${brutalBorder} hover:bg-gray-50 transition-colors`}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div className="min-w-0 space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                              {new Date(fb.createdAt).toLocaleString()}
                            </p>
                            <p className="font-black text-lg">
                              {fb.name?.trim() || "Anonymous"}
                              {fb.email?.trim() ? (
                                <span className="font-bold text-sm text-gray-600 block sm:inline sm:ml-2">
                                  · {fb.email.trim()}
                                </span>
                              ) : null}
                            </p>
                            {u && (
                              <p className="text-sm font-bold text-gray-600">
                                Account: {u.username || "—"} {u.email ? `(${u.email})` : ""}
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={() => handleDeleteFeedback(fb._id)}
                            variant="destructive"
                            size="sm"
                            className={`rounded-none bg-[#ff0844] text-white font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] shrink-0`}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Remove
                          </Button>
                        </div>
                        <div className={`border-l-4 border-black pl-4 py-1 mb-4 bg-[#FFFDF7]`}>
                          <p className="text-sm sm:text-base font-bold whitespace-pre-wrap break-words">{fb.message}</p>
                        </div>
                        {imgs.length > 0 && (
                          <div className="border-t-2 border-dashed border-gray-200 pt-4">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                              Images ({imgs.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {imgs.map((img: string, idx: number) => (
                                <a
                                  key={idx}
                                  href={feedbackImageSrc(img)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block"
                                >
                                  <img
                                    src={feedbackImageSrc(img)}
                                    alt=""
                                    className="w-20 h-20 sm:w-28 sm:h-28 object-cover border-2 border-black hover:opacity-90 transition-opacity"
                                  />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === "pages" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black uppercase tracking-tight">Manage Links</h2>
                <div className="bg-[#ff90e8] text-black px-3 py-1 font-black text-xs uppercase border-2 border-black">
                  {pagesList.length} Pages
                </div>
              </div>
              <div className="space-y-3">
                {pagesList.length === 0 ? (
                  <p className="text-gray-500 font-bold">No pages found.</p>
                ) : (
                  pagesList.map((page) => {
                    const pageImages = getValidImages(page);
                    return (
                      <div key={page._id} className={`bg-white p-4 flex flex-col gap-4 ${brutalBorder} hover:bg-gray-50 transition-colors`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-black text-[#fde047] text-[10px] font-black uppercase px-2 py-0.5 whitespace-nowrap">
                                {page.content?.templateType || "Unknown"}
                              </span>
                              <span className="font-black truncate block">
                                {page.content?.senderName || 'Anonymous'} → {page.content?.receiverName || 'Someone'}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-gray-600 mb-1">/{page.customUrlData}</p>
                            <p className="text-xs font-bold text-gray-500">
                              By: {page.user?.username || page.user} • Created {new Date(page.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button
                              onClick={() => window.open(`/p/${page.customUrlData}`, "_blank")}
                              className={`rounded-none bg-white text-black font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeletePage(page._id)}
                              variant="destructive"
                              className={`rounded-none bg-[#ff0844] text-white font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {pageImages.length > 0 && (
                          <div className="border-t-2 border-dashed border-gray-200 mt-2 pt-3">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Images ({pageImages.length})</p>
                            <div className="flex flex-wrap gap-2">
                              {pageImages.map((img, idx) => (
                                <a href={img} target="_blank" rel="noreferrer" key={idx}>
                                  <img src={img} className="w-12 h-12 sm:w-16 sm:h-16 object-cover border-2 border-black hover:scale-110 transition-transform" alt="thumbnail" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === "user_profile" && selectedUser && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <Button
                onClick={() => {
                  setSelectedUser(null);
                  setActiveTab("users");
                }}
                variant="outline"
                className={`mb-6 rounded-none bg-white text-black font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
              </Button>

              <div className={`bg-[#ff90e8] p-6 mb-8 ${brutalBorder} ${brutalShadow}`}>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-3 bg-black text-white px-3 py-1 inline-block -rotate-1">{selectedUser.username}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-black uppercase text-sm w-20">Email:</span>
                      <span className="font-bold border-l-[4px] border-black pl-3">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black uppercase text-sm w-20">Joined:</span>
                      <span className="font-bold border-l-[4px] border-black pl-3">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    {(() => {
                      const userPages = pagesList.filter((page) => (page.user?._id || page.user) === selectedUser._id);
                      const totalLinks = userPages.length;
                      const paidLinks = userPages.filter(p => p.content?.paymentStatus === 'success').length;
                      const totalSpent = paidLinks * 49;
                      return (
                        <>
                          <div className={`bg-white ${brutalBorder} p-3 text-center shadow-[2px_2px_0_0_#000] flex-1`}>
                            <p className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-1">Total Links</p>
                            <p className="text-xl font-black">{totalLinks}</p>
                          </div>
                          <div className={`bg-[#86efac] ${brutalBorder} p-3 text-center shadow-[2px_2px_0_0_#000] flex-1`}>
                            <p className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-1">Spent</p>
                            <p className="text-xl font-black">₹{totalSpent}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#ff90e8] fill-[#ff90e8]" /> Links created by {selectedUser.username}
              </h3>

              <div className="space-y-3">
                {pagesList.filter((page) => (page.user?._id || page.user) === selectedUser._id).length === 0 ? (
                  <p className="text-gray-500 font-bold bg-white p-4 border-2 border-dashed border-gray-300">This user hasn't created any pages yet.</p>
                ) : (
                  pagesList
                    .filter((page) => (page.user?._id || page.user) === selectedUser._id)
                    .map((page) => {
                      const pageImages = getValidImages(page);
                      return (
                        <div key={page._id} className={`bg-white p-4 flex flex-col gap-4 ${brutalBorder} hover:bg-gray-50 transition-colors`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-black text-[#fde047] text-[10px] font-black uppercase px-2 py-0.5 whitespace-nowrap">
                                  {page.content?.templateType || "Unknown"}
                                </span>
                                <span className="font-black truncate block">
                                  {page.content?.senderName || 'Anonymous'} → {page.content?.receiverName || 'Someone'}
                                </span>
                              </div>
                              <p className="text-sm font-bold text-gray-600 mb-1">/{page.customUrlData}</p>
                              <p className="text-xs font-bold text-gray-500">
                                By: {page.user?.username || page.user} • Created {new Date(page.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button
                                onClick={() => window.open(`/p/${page.customUrlData}`, "_blank")}
                                className={`rounded-none bg-white text-black font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeletePage(page._id)}
                                variant="destructive"
                                className={`rounded-none bg-[#ff0844] text-white font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {pageImages.length > 0 && (
                            <div className="border-t-2 border-dashed border-gray-200 mt-2 pt-3">
                              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Images ({pageImages.length})</p>
                              <div className="flex flex-wrap gap-2">
                                {pageImages.map((img, idx) => (
                                  <a href={img} target="_blank" rel="noreferrer" key={idx}>
                                    <img src={img} className="w-12 h-12 sm:w-16 sm:h-16 object-cover border-2 border-black hover:scale-110 transition-transform" alt="thumbnail" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
