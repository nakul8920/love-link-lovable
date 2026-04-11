import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL_CANDIDATES } from "@/config";

type RequireAuthProps = {
  children: ReactNode;
};

// Client-side route guard: blocks access to protected UI.
// Server APIs for saving pages are already protected too, but this keeps the UX correct.
const RequireAuth = ({ children }: RequireAuthProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        const next = `${location.pathname}${location.search}`;
        navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
        setIsValidating(false);
        return;
      }

      // Validate token with server
      try {
        let res: Response | null = null;
        for (const baseUrl of API_BASE_URL_CANDIDATES) {
          try {
            const attempt = await fetch(`${baseUrl}/api/auth/profile`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
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

        if (res && res.ok) {
          setIsAuthenticated(true);
        } else {
          // Token is invalid, remove it and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          const next = `${location.pathname}${location.search}`;
          navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
        }
      } catch (error) {
        console.error('Token validation error:', error);
        // On error, assume token is invalid
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        const next = `${location.pathname}${location.search}`;
        navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [location.pathname, location.search, navigate]);

  if (isValidating) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return <>{children}</>;
};

export default RequireAuth;

