// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";


//  Pages WITH navbar
const WithNavbar = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />   {/* ← footer appears on all pages that have navbar */}
  </>
);

function App() {
  return (
    <AuthProvider>
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

          {/* These pages do NOT get the Navbar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin route — the ONLY /admin route definition. Previously
              this path was declared twice (once bare, once wrapped in
              AdminRoute); React Router matches the first match, so the
              unguarded copy was the one that actually rendered and the
              guard below was dead code. There is exactly one now. */}
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
    </AuthProvider>
  );
}

export default App;
