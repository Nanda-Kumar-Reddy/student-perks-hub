import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  allowedRoles?: ("student" | "vendor" | "admin")[];
};

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { user, role, token, loading } = useAuth();
  const location = useLocation();

  const getPortalPath = (userRole?: "student" | "vendor" | "admin" | null) => {
    if (!userRole) return "/login";
    return `/${userRole}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={getPortalPath(role)} replace />;
  }

  return <Outlet />;
}
