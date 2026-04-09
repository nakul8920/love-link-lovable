import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type RequireAuthProps = {
  children: ReactNode;
};

// Client-side route guard: blocks access to protected UI.
// Server APIs for saving pages are already protected too, but this keeps the UX correct.
const RequireAuth = ({ children }: RequireAuthProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      const next = `${location.pathname}${location.search}`;
      navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
    }
  }, [token, location.pathname, location.search, navigate]);

  if (!token) return null;
  return <>{children}</>;
};

export default RequireAuth;

