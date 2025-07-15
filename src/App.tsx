// import { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Outlet,
//   useLocation,
// } from "react-router-dom";

// import Navbar from "./components/Navbar";
// import HeroSection from "./components/HeroSection";
// import OverviewSection from "./components/OverviewSection";
// import TestimonialsSection from "./components/TestimonialsSection";
// import WhyChooseSection from "./components/WhyChooseSection";
// import PaymentMethodsSection from "./components/PaymentMethodsSection";
// import StatsCountdownSection from "./components/StatsCountdownSection";
// import Footer from "./components/Footer";
// import AuthModal from "./components/modals/AuthModal";

// import Terms from "./pages/terms";
// import Privacy from "./pages/privacy";
// import ContactUs from "./pages/ContactUs";
// import AboutUs from "./pages/AboutUs";
// import ResetPasswordPage from "./pages/ResetPasswordPage";
// import Referral from "./pages/Referral";
// import Dashboard from "./pages/dashboard";
// import PrivateRoute from "./components/PrivateRoute";
// import { Toaster } from "react-hot-toast";
// import WithdrawalPage from "./pages/withdrawal";
// import DashboardNavbar from "./components/DeshboardNavbar";

// // 🔁 Layout components
// type LayoutProps = {
//   onRegister: () => void;
//   onSignIn: () => void;
// };

// const MainLayout = ({ onRegister, onSignIn }: LayoutProps) => {
//   const location = useLocation();
//   const hideFooterRoutes = ["/terms", "/privacy", "/contact-us"];
//   const shouldHideFooter = hideFooterRoutes.includes(location.pathname);
//   const dashboardRoutes = ["/dashboard", "/withdrawal"];
//   const showDashboardNavbar = dashboardRoutes.includes(location.pathname);

//   return (
//    <>
//       <Navbar onRegister={onRegister} onSignIn={onSignIn} />
//       {showDashboardNavbar && <DashboardNavbar />}
//       <Outlet />
//       {!shouldHideFooter && <Footer />}
//     </>
//   );
// };

// const MinimalLayout = () => <Outlet />;

// // ✅ Main App
// function App() {
//   const [modalType, setModalType] = useState<"register" | "signin" | null>(
//     null
//   );

//   const handleOpen = (type: "register" | "signin") => setModalType(type);
//   const handleClose = () => setModalType(null);

//   return (
//     <Router>
//       <Routes>
//         {/* 🧱 Main Layout */}
//         <Route
//           element={
//             <MainLayout
//               onRegister={() => handleOpen("register")}
//               onSignIn={() => handleOpen("signin")}
//             />
//           }
//         >
//           <Route
//             path="/"
//             element={
//               <>
//                 <HeroSection onRegister={() => handleOpen("register")} />
//                 <OverviewSection />
//                 <TestimonialsSection />
//                 <WhyChooseSection />
//                 <PaymentMethodsSection />
//                 <StatsCountdownSection />
//               </>
//             }
//           />
//           <Route
//             path="/about-us"
//             element={<AboutUs onRegister={() => handleOpen("register")} />}
//           />
//           <Route path="/terms" element={<Terms />} />
//           <Route path="/privacy" element={<Privacy />} />
//           <Route path="/contact-us" element={<ContactUs />} />
//           <Route path="/referral" element={<Referral />} />

//           {/* ✅ Protected Route */}
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <Dashboard />
//               </PrivateRoute>
//             }
//           />
//           <Route
//             path="/withdrawal"
//             element={
//               <PrivateRoute>
//                 <WithdrawalPage />
//               </PrivateRoute>
//             }
//           />
//         </Route>

//         {/* 🟢 Minimal Layout */}
//         <Route element={<MinimalLayout />}>
//           <Route path="/reset-password" element={<ResetPasswordPage />} />
//         </Route>
//       </Routes>

//       {/* 🔐 Auth Modal */}
//       <AuthModal
//         type={modalType === "register" ? "register" : "signin"}
//         open={modalType !== null}
//         onClose={handleClose}
//       />

//       <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
//     </Router>
//   );
// }

// export default App;

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
import WithdrawalPage from "./pages/withdrawal";
import DashboardNavbar from "./components/DeshboardNavbar";
import JobSubmissionPage from "./pages/job-submission";
import RefPage from "./pages/RefPage";
import Settings from "./pages/settings";

// 🔁 Layout components
type LayoutProps = {
  onRegister: () => void;
  onSignIn: () => void;
};

const DASHBOARD_ROUTES = [
  "/dashboard",
  "/withdrawal",
  "/job-submission",
  "/referral",
  "/settings"
];

const MainLayout = ({ onRegister, onSignIn }: LayoutProps) => {
  const location = useLocation();

  const onDashboardArea = DASHBOARD_ROUTES.some((path) =>
    location.pathname.startsWith(path)
  );

  const hideFooterRoutes = [
    "/terms",
    "/privacy",
    "/contact-us",
    "/ref",
    ...DASHBOARD_ROUTES,
  ];

  const shouldHideFooter = hideFooterRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!onDashboardArea && (
        <Navbar onRegister={onRegister} onSignIn={onSignIn} />
      )}
      {onDashboardArea && <DashboardNavbar />}

      <Outlet />

      {!shouldHideFooter && <Footer />}
    </>
  );
};

const MinimalLayout = () => <Outlet />;

// ✅ Main App
function App() {
  const [modalType, setModalType] = useState<"register" | "signin" | null>(
    null
  );

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
          <Route
            path="/about-us"
            element={<AboutUs onRegister={() => handleOpen("register")} />}
          />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact-us" element={<ContactUs />} />
                    <Route path="/ref" element={<RefPage />} />
                     <Route path="/ref/:id" element={<RefPage />} />
        <Route path="/refer"   element={<Referral />} />

          {/* ✅ Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings/>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/withdrawal"
            element={
              <PrivateRoute>
                <WithdrawalPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/job-submission"
            element={
              <PrivateRoute>
                <JobSubmissionPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/referral"
            element={
              <PrivateRoute>
                <Referral />
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
