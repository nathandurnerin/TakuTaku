// src/components/PrivateRoute.tsx
import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";

type PrivateRouteProps = {
  children: JSX.Element;
};

function PrivateRoute({ children }: PrivateRouteProps) {
  const { connected, loading } = useAuthContext();

  if (loading) return null;

  if (!connected) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
