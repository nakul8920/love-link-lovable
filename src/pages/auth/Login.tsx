import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { Sparkles, Heart, Shield, Mail, Lock, User } from "lucide-react";
import { API_BASE_URL_CANDIDATES } from "@/config";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigateAfterLogin = () => {
    // Only allow internal redirects.
    if (typeof next === "string" && next.startsWith("/")) {
      navigate(next);
      return;
    }
    navigate("/");
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const requestInit: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      };

      let res: Response | null = null;
      for (const baseUrl of API_BASE_URL_CANDIDATES) {
        try {
          const attempt = await fetch(`${baseUrl}/api/auth/google`, requestInit);
          // Static hosts often answer POST /api/* with 404/405; keep trying other candidates.
          if ((attempt.status === 404 || attempt.status === 405) && API_BASE_URL_CANDIDATES.length > 1) {
            continue;
          }
          res = attempt;
          break;
        } catch {
          // Try next candidate on network/DNS failure.
        }
      }

      if (!res) {
        throw new Error("Could not reach auth server");
      }

      const raw = await res.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success("Login successful!");
        navigateAfterLogin();
      } else {
        const serverMessage = data?.error || data?.message;
        toast.error(serverMessage ? `Google Error: ${serverMessage}` : "Google Login failed");
      }
    } catch (error) {
      toast.error("Login failed. Please try again in a moment.");
      console.error(error);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Login failed");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      let res: Response | null = null;
      for (const baseUrl of API_BASE_URL_CANDIDATES) {
        try {
          const attempt = await fetch(`${baseUrl}${endpoint}`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          
          if ((attempt.status === 404 || attempt.status === 405) && API_BASE_URL_CANDIDATES.length > 1) {
            continue;
          }
          res = attempt;
          break;
        } catch {
          // Try next candidate
        }
      }

      if (!res) {
        throw new Error("Could not reach auth server");
      }

      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success(isLogin ? "Login successful!" : "Registration successful!");
        navigateAfterLogin();
      } else {
        toast.error(data.message || `${isLogin ? 'Login' : 'Registration'} failed`);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-screen flex items-center justify-center bg-gray-50 overflow-hidden lg:p-4 sm:p-2 fixed inset-0">
      <div className="w-full h-full lg:h-[85dvh] lg:max-h-[600px] lg:max-w-5xl flex flex-col lg:grid lg:grid-cols-2 lg:bg-white lg:rounded-3xl lg:shadow-2xl overflow-hidden relative border-0 lg:border border-gray-100">
        
        {/* Mobile Hero */}
        <div className="lg:hidden w-full pt-6 pb-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative flex flex-col justify-center items-center px-3 overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-white opacity-10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center font-black text-lg text-white mb-2 shadow-lg border border-white/20">W</div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Welcome to Wishlink</h2>
          </div>
        </div>

        {/* Left Side (Desktop) */}
        <div className="relative hidden lg:flex flex-col justify-center p-6 sm:p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden text-white h-full">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
          
          <div className="relative z-10 space-y-6 sm:space-y-8 flex flex-col h-full justify-between py-4 sm:py-6">
            <div>
              <div className="mb-3 sm:mb-4 flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white text-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg sm:text-xl">W</div>
                <span className="font-bold text-base sm:text-lg tracking-wide">Wishlink</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                Welcome To <br /> The Magic
              </h2>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10 shrink-0">
                  <Heart className="text-white w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Send More Love</h4>
                  <p className="text-white/80 text-xs sm:text-sm font-medium">Your personalized digital envelopes await</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10 shrink-0">
                  <Shield className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Safe & Secure</h4>
                  <p className="text-white/80 text-xs sm:text-sm font-medium">Login safely with end-to-end encryption</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-3 sm:p-4 rounded-xl shadow-lg mt-4 sm:mt-6">
              <div className="flex space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-300" fill="currentColor" />)}
              </div>
              <p className="text-white font-medium italic text-xs sm:text-sm leading-snug">"The easiest way to send authentic digital gifts safely to my friends. Period."</p>
              <p className="text-white/70 text-[10px] sm:text-xs mt-1 sm:mt-2 font-semibold">— Rohan K.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="flex-1 overflow-y-auto lg:h-full w-full flex flex-col bg-white rounded-t-3xl lg:rounded-none -mt-4 lg:mt-0 px-3 sm:px-4 py-2 lg:p-8 lg:p-12 relative z-20 shadow-[0_-6px_25px_rgb(0,0,0,0.08)] lg:shadow-none">
          <div className="max-w-sm w-full mx-auto flex flex-col my-auto py-3 lg:justify-center">
            {/* Center handle for bottom sheet feel on mobile */}
            <div className="w-8 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:mb-6 lg:hidden shrink-0"></div>
            
            <div className="w-full text-center lg:text-left mb-6 sm:mb-8 shrink-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-1 sm:mb-2">
                {isLogin ? 'Welcome Back' : 'Join the Magic'}
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm lg:text-base font-medium leading-snug">
                {isLogin 
                  ? 'Sign in to your account to continue creating magical wishes.'
                  : 'Create your account and start sending digital gifts today!'
                }
              </p>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="w-full space-y-4 mb-6">
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    required={!isLogin}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Signup Box */}
            <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all flex flex-col items-center justify-center space-y-3 sm:space-y-4 mb-4 sm:mb-6 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
              
              <div className="relative z-10 flex flex-col items-center w-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100 mb-2 sm:mb-3">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                </div>
                <h3 className="text-gray-900 font-bold text-base sm:text-lg text-center mb-1">Continue with Google</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 text-center mb-4 sm:mb-5 max-w-[180px] sm:max-w-[200px] leading-snug font-medium">
                  Secure, fast, and completely spam-free logging in with Google.
                </p>
                
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_black"
                    shape="pill"
                    text="continue_with"
                    width={280}
                  />
                </div>
              </div>
            </div>

            <div className="w-full text-center mb-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="w-full text-center mt-auto pb-2 shrink-0">
              <p className="text-[8px] sm:text-[10px] text-gray-400 font-medium">
                By joining, you agree to our Terms of Service & Privacy Policy.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
