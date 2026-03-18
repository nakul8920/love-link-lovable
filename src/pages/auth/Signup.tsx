import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success("Account created successfully!");
        navigate("/create");
      } else {
        toast.error(data.message || "Failed to create account");
      }
    } catch (error) {
      toast.error("Network error. Is the backend running?");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md p-8 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Join Wishlink
          </h1>
          <p className="text-gray-500 mt-2">Create an account to get started</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white/50 backdrop-blur-sm"
              placeholder="johndoe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white/50 backdrop-blur-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white/50 backdrop-blur-sm"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-lg text-white font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30"
            }`}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
