import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFDF7]">
      <div className="text-center px-4">
        <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold text-black">404</h1>
        <p className="mb-4 text-lg sm:text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-[#ff90e8] hover:text-[#fde047] underline hover:text-primary/90 text-base sm:text-lg font-medium transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
