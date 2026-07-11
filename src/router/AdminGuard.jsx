import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const token = localStorage.getItem("aevum_token");
  const user = JSON.parse(localStorage.getItem("aevum_user") || "null");

  if (!token || !user?.isAdmin) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
}
