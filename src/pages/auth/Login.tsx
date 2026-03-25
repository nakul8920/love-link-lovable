import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { Sparkles, Heart, Shield } from "lucide-react";
import { API_BASE_URL } from "@/config";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        credentials: "include",
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
            <h2 className="text-xl font-extrabold text-white tracking-tight">Welcome to Wishlink</h2>
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
                Welcome To <br /> The Magic
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
                {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-3 h-3 text-yellow-300" fill="currentColor" />)}
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
            
            <div className="w-full text-center lg:text-left mb-8 shrink-0">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Join the Magic</h1>
              <p className="text-gray-500 text-sm lg:text-base font-medium leading-snug">
                Select your registered Gmail account if you already have one. New users can simply log in with their Gmail to automatically create an account!
              </p>
            </div>

            {/* Google Signup Box */}
            <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all flex flex-col items-center justify-center space-y-4 mb-6 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
              
              <div className="relative z-10 flex flex-col items-center w-full">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100 mb-3">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-7 h-7 object-contain" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg text-center mb-1">Continue with Google</h3>
                <p className="text-xs text-gray-500 text-center mb-5 max-w-[200px] leading-snug font-medium">
                  Secure, fast, and completely spam-free logging in with Google.
                </p>
                
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_black"
                    shape="pill"
                    text="continue_with"
                    width={320}
                  />
                </div>
              </div>
            </div>

            <div className="w-full text-center mt-auto pb-2 shrink-0">
              <p className="text-[10px] text-gray-400 font-medium">
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
