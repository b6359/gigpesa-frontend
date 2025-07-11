import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import OverviewSection from "./components/OverviewSection";
import TestimonialsSection from "./components/TestimonialsSection";
import WhyChooseSection from "./components/WhyChooseSection";
import PaymentMethodsSection from "./components/PaymentMethodsSection";
import StatsCountdownSection from "./components/StatsCountdownSection";
import Footer from "./components/Footer";
import AuthModal from "./components/modals/AuthModal";

import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Referral from "./pages/Referral";
import Dashboard from "./pages/dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";

// 🔁 Layout components
type LayoutProps = {
  onRegister: () => void;
  onSignIn: () => void;
};

const MainLayout = ({ onRegister, onSignIn }: LayoutProps) => {
  const location = useLocation();
  const hideFooterRoutes = ["/terms", "/privacy", "/contact-us"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <Navbar onRegister={onRegister} onSignIn={onSignIn} />
      <Outlet />
      {!shouldHideFooter && <Footer />}
    </>
  );
};

const MinimalLayout = () => <Outlet />;

// ✅ Main App
function App() {
  const [modalType, setModalType] = useState<"register" | "signin" | null>(null);

  const handleOpen = (type: "register" | "signin") => setModalType(type);
  const handleClose = () => setModalType(null);

  return (
    <Router>
      <Routes>
        {/* 🧱 Main Layout */}
        <Route
          element={
            <MainLayout
              onRegister={() => handleOpen("register")}
              onSignIn={() => handleOpen("signin")}
            />
          }
        >
          <Route
            path="/"
            element={
              <>
                <HeroSection onRegister={() => handleOpen("register")} />
                <OverviewSection />
                <TestimonialsSection />
                <WhyChooseSection />
                <PaymentMethodsSection />
                <StatsCountdownSection />
              </>
            }
          />
          <Route path="/about-us" element={<AboutUs onRegister={() => handleOpen("register")} />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/referral" element={<Referral />} />

          {/* ✅ Protected Route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Route>

        {/* 🟢 Minimal Layout */}
        <Route element={<MinimalLayout />}>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Routes>

      {/* 🔐 Auth Modal */}
      <AuthModal
        type={modalType === "register" ? "register" : "signin"}
        open={modalType !== null}
        onClose={handleClose}
      />

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </Router>
  );
}

export default App;
