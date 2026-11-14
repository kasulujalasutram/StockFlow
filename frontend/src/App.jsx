
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./page/Login.jsx";
import Register from "./page/Register.jsx";
import AdminDashboard from "./page/AdminDashboard.jsx";
import AddProduct from "./page/AddProduct.jsx";
import Products from "./page/Products.jsx";
import UserDashboard from "./page/UserDashboard.jsx";
import Unauthorized from "./page/Unauthorized.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route
            path="/admin-dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/add-product"
            element={<AddProduct />}
          />
        </Route>

        {/* Admin and User Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]} />
          }
        >
          <Route path="/products" element={<Products />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        {/* Unknown Routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
