import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Sparkles, Heart, Shield, ArrowRight } from "lucide-react";
import { API_BASE_URL } from "@/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error("Network error.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(data.error ? `Google Error: ${data.error}` : "Google Login failed");
      }
    } catch (error) {
      toast.error("Network error.");
      console.error(error);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Login failed");
  };

  return (
    <div className="h-[100dvh] w-screen flex items-center justify-center bg-gray-50 overflow-hidden lg:p-6 fixed inset-0">
      <div className="w-full h-full lg:h-[85dvh] lg:max-h-[650px] lg:max-w-5xl flex flex-col lg:grid lg:grid-cols-2 lg:bg-white lg:rounded-3xl lg:shadow-2xl overflow-hidden relative border-0 lg:border border-gray-100">
        
        {/* Mobile Hero */}
        <div className="lg:hidden w-full pt-8 pb-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative flex flex-col justify-center items-center px-4 overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-white opacity-10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center font-black text-xl text-white mb-2 shadow-lg border border-white/20">W</div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          </div>
        </div>

        {/* Left Side (Desktop) */}
        <div className="relative hidden lg:flex flex-col justify-center p-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden text-white h-full">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
          
          <div className="relative z-10 space-y-8 flex flex-col h-full justify-between py-6">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="w-8 h-8 bg-white text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl">W</div>
                <span className="font-bold text-lg tracking-wide">Wishlink</span>
              </div>
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
                Welcome Back <br /> To The Magic
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10 shrink-0">
                  <Heart className="text-white w-6 h-6" fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Send More Love</h4>
                  <p className="text-white/80 text-xs font-medium">Your personalized digital envelopes await</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10 shrink-0">
                  <Shield className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Safe & Secure</h4>
                  <p className="text-white/80 text-xs font-medium">Login safely with end-to-end encryption</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-xl shadow-lg mt-8">
              <div className="flex space-x-1 mb-2">
                {[1,2,3,4,5].map(i => <Sparkles key={i} className="w-3 h-3 text-yellow-300" fill="currentColor" />)}
              </div>
              <p className="text-white font-medium italic text-sm leading-snug">"The easiest way to send authentic digital gifts safely to my friends. Period."</p>
              <p className="text-white/70 text-xs mt-2 font-semibold">— Rohan K.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="flex-1 overflow-y-auto lg:h-full w-full flex flex-col bg-white rounded-t-3xl lg:rounded-none -mt-5 lg:mt-0 px-5 py-2 lg:p-12 relative z-20 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] lg:shadow-none">
          <div className="max-w-sm w-full mx-auto flex flex-col my-auto py-4 lg:justify-center">
            {/* Center handle for bottom sheet feel on mobile */}
            <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 lg:hidden shrink-0"></div>
            
            <div className="w-full text-center lg:text-left mb-4 shrink-0">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Sign In</h1>
              <p className="text-gray-500 text-xs lg:text-sm font-medium">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 shrink-0">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-[11px] text-indigo-600 font-bold hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none pr-9 text-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 mt-2 rounded-lg text-white font-bold text-sm transition-all shadow-md ${loading ? "bg-gray-400 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-indigo-600 to-purple-600"}`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-4 mb-4 flex items-center justify-center space-x-3 shrink-0">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-gray-400 text-[10px] font-semibold tracking-wide uppercase">Or</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="w-full flex justify-center shrink-0 mb-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                shape="rectangular"
                text="signin_with"
                width="100%"
              />
            </div>

            <div className="w-full text-center mt-auto pb-1 shrink-0">
              <p className="text-gray-600 font-medium text-xs">
                New to Wishlink?{" "}
                <Link to="/signup" className="text-indigo-600 font-bold hover:underline inline-flex items-center">
                  Create an account <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
