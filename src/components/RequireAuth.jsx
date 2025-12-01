import { Navigate } from "react-router-dom";

function RequireAuth({ authUser, children }) {
  if (!authUser) return <Navigate to="/login" replace />;
  return children;
}

export default RequireAuth;
