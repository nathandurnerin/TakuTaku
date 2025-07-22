// src/components/PrivateRoute.tsx
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import { useUserContext } from "../../../context/UserContext";

type PrivateRouteProps = {
  children: JSX.Element;
};

function PrivateRouteAdmin({ children }: PrivateRouteProps) {
  const { loading } = useAuthContext();
  const { user } = useUserContext();

  if (loading) return null;

  if (!user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRouteAdmin;
