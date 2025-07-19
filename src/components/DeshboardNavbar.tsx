import { useEffect, useRef, useState } from "react";
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
  icon: React.ReactElement;
}

interface HeaderProps {
  navLinks?: NavItem[];
  onLogout?: () => void;
}

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  type: string;
  isRead: boolean;
}

const defaultLinks: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    to: "/job-history",
    label: "Job History",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    to: "/micro-jobs",
    label: "Micro-Jobs",
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    to: "/withdrawal",
    label: "Withdrawal",
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    to: "/advertise",
    label: "Advertise",
    icon: <Megaphone className="w-5 h-5" />,
  },
];

const DashboardNavbar: React.FC<HeaderProps> = ({
  navLinks = defaultLinks,
  onLogout,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const storedUser = sessionStorage.getItem("gigpesa_user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const profileImage = parsedUser?.profileImage;

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setProfileOpen(false);
      }

      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("gigpesa_user");
    if (onLogout) {
      onLogout();
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const user = sessionStorage.getItem("gigpesa_user");
    if (!user) {
      navigate("/");
    } else {
      try {
        const parsed = JSON.parse(user);
        setUserName(parsed.name || "User");
      } catch {
        setUserName("User");
      }
    }
  }, []);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const toggleNotifications = async () => {
    if (!notifOpen) {
      try {
        const token = sessionStorage.getItem("gigpesa_token");
        if (!token) return;

        const response = await fetch(
          "http://192.168.1.24:5000/api/user/notifications",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        setNotifications(data.notification || []);
      } catch (err) {
        console.error("Notification fetch error:", err);
        setNotifications([]);
      }
    }

    setNotifOpen((prev) => !prev);
  };

  const handleDismiss = async (id: string) => {
    const token = sessionStorage.getItem("gigpesa_token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://192.168.1.24:5000/api/user/notification?notification_id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to delete notification");
        return;
      }

      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = sessionStorage.getItem("gigpesa_token");
        if (!token) return;

        const response = await fetch(
          "http://192.168.1.24:5000/api/user/notifications",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        setNotifications(data.notification || []);
      } catch (err) {
        console.error("Initial notification fetch error:", err);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center">
          <img
            src="/images/gigpesa-website-logo.png"
            alt="GigPesa"
            className="h-12 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-1 hover:underline"
            >
              {icon} {label}
            </Link>
          ))}
          <div className="relative" ref={notifRef}>
            <button
              onClick={toggleNotifications}
              className="relative hover:text-green-300"
            >
              <Bell className="w-5 h-5" />

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0 rounded-full">
                  {unreadCount > 4 ? "4+" : unreadCount}
                </span>
              )}

              {/* {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0 rounded-full">
                  {notifications.length > 4 ? "4+" : notifications.length}
                </span>
              )} */}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-gray-700 rounded-md shadow-xl z-50 border border-gray-200">
                <div className="p-3 border-b font-semibold text-green-700 bg-gray-50">
                  Notifications
                </div>
                <ul className="max-h-64 overflow-y-hidden divide-y  divide-gray-200">
                  {notifications.length === 0 ? (
                    <li className="px-4 py-2 text-gray-500 italic">
                      No notifications
                    </li>
                  ) : (
                    notifications.slice(0, 10).map((notif) => (
                      <li
                        key={notif.id}
                        className="px-4 py-3 relative hover:bg-gray-50 transition-all"
                      >
                        <button
                          onClick={() => handleDismiss(notif.id)}
                          className="absolute top-0 right-2 text-gray-400 h-full hover:text-red-500"
                        >
                          <X size={14} />
                        </button>

                        <div className="font-medium text-sm">
                          {notif.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(notif.createdAt).toLocaleString()} •{" "}
                          {notif.type}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                <div className="text-sm text-center text-green-600 py-2 border-t hover:underline cursor-pointer">
                  <Link to="/notifications" onClick={() => setNotifOpen(false)}>
                    View all
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setProfileOpen((prev) => !prev)}>
              <img
                src={"http://192.168.1.24:5000/static/uploads/" + profileImage}
                alt="avatar"
                className="w-8 h-8 rounded-full border border-white shadow-2xl p-0.5"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-gray-700 rounded-md shadow-xl z-50">
                <div className="px-4 py-1 text-green-600 capitalize border-b font-semibold">
                  {userName}
                </div>

                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
                <Link
                  to="/referral"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Referrals
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        <button className="md:hidden" onClick={() => setMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white z-50 shadow-xl">
            <div className="flex justify-end text-gray-500 p-4">
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 text-green-700 space-y-5 font-medium text-sm">
              {navLinks.map(({ to, label, icon }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3"
                >
                  {icon} {label}
                </Link>
              ))}
              <Link
                to="/notifications"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <Bell className="w-5 h-5" /> Notifications
              </Link>
              <hr />
              <Link
                to="/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <Settings className="w-5 h-5" /> Settings
              </Link>
              <Link
                to="/referral"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <UserPlus className="w-5 h-5" /> Referrals
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 w-full hover:text-red-500"
              >
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
