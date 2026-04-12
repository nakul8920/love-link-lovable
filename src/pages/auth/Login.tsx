import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { Sparkles, Heart, Shield } from "lucide-react";
import { API_BASE_URL } from "@/config";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next");

  const navigateAfterLogin = () => {
    if (typeof next === "string" && next.startsWith("/")) {
      navigate(next);
      return;
    }
    navigate("/");
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    try {
      const requestInit: RequestInit = {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      };

      let res: Response | null = null;
      try {
        res = await fetch(`${API_BASE_URL}/api/auth/google`, requestInit);
      } catch {
        // network error
      }

      if (!res) {
        throw new Error("Could not reach auth server");
      }

      const raw = await res.text();
      let data: {
        token?: string;
        isNewUser?: boolean;
        error?: string;
        message?: string;
      } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));
        if (data.isNewUser) {
          toast.success("Account created — you're logged in!");
        } else {
          toast.success("Welcome back!");
        }
        navigateAfterLogin();
      } else {
        const serverMessage = data?.error || data?.message;
        toast.error(serverMessage ? `Google: ${serverMessage}` : "Google sign-in failed");
      }
    } catch (error) {
      toast.error("Sign-in failed. Please try again in a moment.");
      console.error(error);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in failed");
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
                  <h4 className="font-bold text-sm sm:text-base">Sign in with Google</h4>
                  <p className="text-white/80 text-xs sm:text-sm font-medium">Quick and secure — no extra passwords</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-3 sm:p-4 rounded-xl shadow-lg mt-4 sm:mt-6">
              <div className="flex space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Sparkles key={i} className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-300" fill="currentColor" />
                ))}
              </div>
              <p className="text-white font-medium italic text-xs sm:text-sm leading-snug">
                &quot;The easiest way to send authentic digital gifts safely to my friends. Period.&quot;
              </p>
              <p className="text-white/70 text-[10px] sm:text-xs mt-1 sm:mt-2 font-semibold">— Rohan K.</p>
            </div>
          </div>
        </div>

        {/* Right: Google only */}
        <div className="flex-1 overflow-y-auto lg:h-full w-full flex flex-col bg-white rounded-t-3xl lg:rounded-none -mt-4 lg:mt-0 px-3 sm:px-4 py-2 lg:p-8 lg:p-12 relative z-20 shadow-[0_-6px_25px_rgb(0,0,0,0.08)] lg:shadow-none">
          <div className="max-w-sm w-full mx-auto flex flex-col my-auto py-3 lg:justify-center">
            <div className="w-8 h-1.5 bg-gray-200 rounded-full mx-auto mb-4 sm:mb-6 lg:hidden shrink-0"></div>

            <div className="w-full text-center lg:text-left mb-6 sm:mb-8 shrink-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight mb-1 sm:mb-2">Sign in to Wishlink</h1>
              <p className="text-gray-500 text-xs sm:text-sm lg:text-base font-medium leading-snug">
                Use your Google account. New here? We&apos;ll create your account automatically.
              </p>
            </div>

            <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all flex flex-col items-center justify-center space-y-3 sm:space-y-4 mb-4 sm:mb-6 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>

              <div className="relative z-10 flex flex-col items-center w-full">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100 mb-2 sm:mb-3">
                  <img src="https://www.google.com/favicon.ico" alt="" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                </div>
                <h3 className="text-gray-900 font-bold text-base sm:text-lg text-center mb-1">Continue with Google</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 text-center mb-4 sm:mb-5 max-w-[220px] sm:max-w-[260px] leading-snug font-medium">
                  Secure, fast sign-in with your Google account.
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

            <div className="w-full text-center mt-auto pb-2 shrink-0">
              <p className="text-[8px] sm:text-[10px] text-gray-400 font-medium">
                By continuing, you agree to our Terms of Service &amp; Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
