import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { Sparkles, Heart, Shield, Gift, ArrowRight } from "lucide-react";
import { API_BASE_URL } from "@/config";

const Signup = () => {
  const navigate = useNavigate();

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
        toast.success("Account created & logged in successfully!");
        navigate("/create");
      } else {
        toast.error(data.error ? `Google Auth Error: ${data.error}` : (data.message || "Google Signup failed"));
      }
    } catch (error) {
      toast.error("Network error.");
      console.error(error);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Signup failed");
  };

  return (
    <div className="h-[100dvh] w-screen flex items-center justify-center bg-gray-50 overflow-hidden lg:p-6 fixed inset-0">
      <div className="w-full h-full lg:h-[85dvh] lg:max-h-[650px] lg:max-w-5xl flex flex-col lg:grid lg:grid-cols-2 lg:bg-white lg:rounded-3xl lg:shadow-2xl overflow-hidden relative border-0 lg:border border-gray-100">
        
        {/* Mobile Hero */}
        <div className="lg:hidden w-full h-[30%] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative flex flex-col justify-center items-center p-4 overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-white opacity-10 blur-xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-blue-400 opacity-20 blur-xl"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-black text-2xl text-white mb-2 shadow-lg border border-white/20">W</div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Wishlink Magic</h2>
            <p className="text-white/90 text-sm mt-1 font-medium">Send unforgettable digital envelopes.</p>
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
                Create Magic For <br /> Your Loved Ones
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10 shrink-0">
                  <Heart className="text-white w-6 h-6" fill="currentColor" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Send Love Anywhere</h4>
                  <p className="text-white/80 text-xs font-medium">Personalized beautiful digital envelopes</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10 shrink-0">
                  <Shield className="text-white w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base">100% Authentic</h4>
                  <p className="text-white/80 text-xs font-medium">Verified accounts & encrypted privacy</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-xl shadow-lg mt-8">
              <div className="flex space-x-1 mb-2">
                {[1,2,3,4,5].map(i => <Sparkles key={i} className="w-3 h-3 text-yellow-300" fill="currentColor" />)}
              </div>
              <p className="text-white font-medium italic text-sm leading-snug">"Made my sister's birthday feel so special even when I was miles away."</p>
              <p className="text-white/70 text-xs mt-2 font-semibold">— Sneha R.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="h-[70%] lg:h-full w-full flex flex-col bg-white rounded-t-3xl lg:rounded-none -mt-4 lg:mt-0 p-6 lg:p-12 relative z-20 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] lg:shadow-none justify-center">
          <div className="max-w-sm w-full mx-auto flex flex-col items-center h-full justify-center">
            {/* Center handle for bottom sheet feel on mobile */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6 lg:hidden shrink-0"></div>
            
            <div className="w-full text-center lg:text-left mb-6">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                Join the Magic
              </h1>
              <p className="text-gray-500 text-sm lg:text-base font-medium leading-snug">
                Sign up quickly using your authentic Google account to get started. No manual passwords to remember.
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
                  We require a real Google email to keep our platform completely spam-free and secure.
                </p>
                
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    theme="filled_black"
                    shape="pill"
                    text="signup_with"
                  />
                </div>
              </div>
            </div>

            <div className="w-full text-center mt-auto pb-2 shrink-0">
              <p className="text-gray-600 font-medium text-sm mb-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-colors inline-flex items-center group"
                >
                  Sign in <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
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

export default Signup;
