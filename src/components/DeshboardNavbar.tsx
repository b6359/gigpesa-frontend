import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Wallet,
  Megaphone,
  Bell,
  Menu,
  X,
  Settings,
  UserPlus,
  LogOut,
} from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: JSX.Element;
}

interface HeaderProps {
  navLinks?: NavItem[];
  onLogout?: () => void;
}

const defaultLinks: NavItem[] = [
  { to: "/dashboard",  label: "Dashboard",   icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: "/micro-jobs", label: "Micro-Jobs",  icon: <Briefcase       className="w-5 h-5" /> },
  { to: "/withdrawal", label: "Withdrawal",  icon: <Wallet          className="w-5 h-5" /> },
  { to: "/advertise",  label: "Advertise",   icon: <Megaphone       className="w-5 h-5" /> },
];

const DashboardNavbar: React.FC<HeaderProps> = ({ navLinks = defaultLinks, onLogout }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("gigpesa_user");
    onLogout ? onLogout() : navigate("/signin");
  };

  return (
    <header className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/images/gigpesa-website-logo.png" alt="GigPesa" className="h-12 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ to, label, icon }) => (
            <Link key={label} to={to} className="flex items-center gap-1 hover:underline">
              {icon} {label}
            </Link>
          ))}
          <Link to="/notifications" className="hover:text-green-300">
            <Bell className="w-5 h-5" />
          </Link>

          {/* Profile dropdown */}
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)}>
              <img src="/images/default-avatar.png" alt="avatar"
                   className="w-8 h-8 rounded-full border-2 border-white" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-gray-700 rounded-md shadow-xl z-50">
                <Link to="/settings"  className="flex items-center px-4 py-2 hover:bg-gray-100">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <Link to="/referral" className="flex items-center px-4 py-2 hover:bg-gray-100">
                  <UserPlus className="w-4 h-4" /> Referrals
                </Link>
                <button onClick={logout}
                        className="w-full flex items-center px-4 py-2 hover:bg-gray-100">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hamburger */}
        <button className="md:hidden" onClick={() => setMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40"
               onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white z-50 shadow-xl">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 space-y-5 font-medium text-sm">
              {navLinks.map(({ to, label, icon }) => (
                <Link key={label} to={to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3">
                  {icon} {label}
                </Link>
              ))}
              <Link to="/notifications"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3">
                <Bell className="w-5 h-5" /> Notifications
              </Link>
              <hr />
              <Link to="/settings"   onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3">
                <Settings className="w-5 h-5" /> Settings
              </Link>
              <Link to="/referral"  onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3">
                <UserPlus className="w-5 h-5" /> Referrals
              </Link>
              <button onClick={() => { setMobileOpen(false); logout(); }}
                      className="flex items-center gap-3 w-full hover:text-red-500">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default DashboardNavbar;
