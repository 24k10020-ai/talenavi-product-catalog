import { Navigate, useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function ProtectedRoute({ children }) {
  const { user } = useShop();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;