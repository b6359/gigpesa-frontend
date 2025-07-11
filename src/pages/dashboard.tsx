import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  DollarSign,
  Clock,
  Users,
  LayoutDashboard,
  Briefcase,
  Wallet,
  Megaphone,
  Bell,
  Settings,
  LogOut,
  UserPlus,
  Menu,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gigpesa_user");
    if (!saved) {
      navigate("/signin");
    } else {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("gigpesa_user");
    navigate("/signin");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: "/micro-jobs", label: "Micro-Jobs", icon: <Briefcase className="w-5 h-5" /> },
    { to: "/withdraw", label: "Withdraw", icon: <Wallet className="w-5 h-5" /> },
    { to: "/advertise", label: "Advertise", icon: <Megaphone className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Header/Nav */}
      <header className="bg-green-700 text-white shadow-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/gigpesa-website-logo.png" alt="GigPesa Logo" className="h-12 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(({ to, label, icon }) => (
              <Link key={label} to={to} className="flex items-center gap-1 hover:underline transition-colors">
                {icon}
                {label}
              </Link>
            ))}
            <Link to="/notifications" className="hover:text-green-300 transition">
              <Bell className="w-5 h-5" />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="focus:outline-none">
                <img src="/images/default-avatar.png" alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-gray-700 rounded-md shadow-xl z-50 animate-fadeIn">
                  <Link to="/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <Link to="/referrals" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                    <UserPlus className="w-4 h-4" /> Referrals
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </nav>

          <button className="md:hidden focus:outline-none" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 w-4/5 max-w-xs h-full bg-white text-green-700 transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-xl`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close Menu">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 space-y-5 font-medium text-sm">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 hover:text-green-800 transition"
            >
              {icon}
              {label}
            </Link>
          ))}
          <Link to="/notifications" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
            <Bell className="w-5 h-5" /> Notifications
          </Link>
          <hr />
          <Link to="/settings" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
            <Settings className="w-5 h-5" /> Settings
          </Link>
          <Link to="/referrals" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
            <UserPlus className="w-5 h-5" /> Referrals
          </Link>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 w-full hover:text-red-500 transition"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ✅ Updated Greeting */}
        <h1 className="text-lg font-normal text-green-600 mb-6 animate-fadeIn">
          {getGreeting()}, {user?.name || "User"}!
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[{ title: "Total Earnings", value: "$1,245.00", icon: <DollarSign className="w-6 h-6 text-green-600" /> },
            { title: "Pending Payments", value: "$312.00", icon: <Clock className="w-6 h-6 text-yellow-500" /> },
            { title: "Referrals", value: "89", icon: <Users className="w-6 h-6 text-blue-600" /> },
          ].map(({ title, value, icon }) => (
            <div key={title} className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                {icon}
                <div>
                  <p className="text-sm text-gray-500">{title}</p>
                  <p className="text-xl font-semibold">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow text-center mb-8 animate-fadeIn">
          <p className="text-lg font-semibold text-gray-800 mb-1">🎁 Offers & Surveys Coming Soon</p>
          <p className="text-sm text-gray-500">We’re working on some exciting micro-jobs for you!</p>
        </div>

        {/* ✅ Updated Marquee Banner */}
        <div className="relative bg-white border-l-4 border-green-700 p-4 rounded-lg mb-10 shadow animate-slideIn">
          <strong className="text-green-700 block mb-1 text-sm">📢 1,204 jobs available</strong>
          <div className="overflow-hidden">
            <p className="whitespace-nowrap animate-marquee text-sm text-green-800">
              Complete tasks · Invite friends · Get paid instantly · New surveys added daily
            </p>
          </div>
        </div>

        {/* Filters */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-5 rounded-xl shadow-sm">
  <div className="relative">
    <input
      type="text"
      placeholder="Search micro-jobs"
      className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
    />
  </div>

  {/* Country Filter */}
  <div className="relative">
    <select
      className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
    >
      <option>Country</option>
      <option>Kenya</option>
      <option>Uganda</option>
      <option>Tanzania</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>

  {/* Category Filter */}
  <div className="relative">
    <select
      className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
    >
      <option>Category</option>
      <option>Surveys</option>
      <option>App Installs</option>
      <option>Referrals</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>

  {/* Payment Range Filter */}
  <div className="relative">
    <select
      className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
    >
      <option>Payment Range</option>
      <option>$0 - $1</option>
      <option>$1 - $5</option>
      <option>$5+</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
</div>
      </main>

      {/* ✅ Tailwind custom animation for marquee */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            animation: marquee 15s linear infinite;
          }
        `}
      </style>
    </>
  );
};

export default Dashboard;
