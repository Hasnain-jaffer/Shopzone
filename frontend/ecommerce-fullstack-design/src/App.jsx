// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";

//  Pages WITH navbar
const WithNavbar = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* These pages get the Navbar */}
        <Route
          path="/"
          element={
            <WithNavbar>
              <HomePage />
            </WithNavbar>
          }
        />
        <Route
          path="/products"
          element={
            <WithNavbar>
              <ProductListingPage />
            </WithNavbar>
          }
        />
        <Route
          path="/products/:id"
          element={
            <WithNavbar>
              <ProductDetailPage />
            </WithNavbar>
          }
        />
        <Route
          path="/cart"
          element={
            <WithNavbar>
              <CartPage />
            </WithNavbar>
          }
        />
        <Route
          path="/admin"
          element={
            <WithNavbar>
              <AdminPage />
            </WithNavbar>
          }
        />

        {/* These pages do NOT get the Navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin route — protected */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <WithNavbar>
                <AdminPage />
              </WithNavbar>
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
