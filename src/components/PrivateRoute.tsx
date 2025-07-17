import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = sessionStorage.getItem("gigpesa_token");
  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
