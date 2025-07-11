import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem("gigpesa_token");
  return token ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
