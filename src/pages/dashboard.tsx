import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
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
  X,
} from "lucide-react";

// Job Type
type Job = {
  id: string;
  name: string;
  description: string;
  category: string;
  device_type: string;
  country_codes: string;
  expiration_date: string;
  default_payout: string;
  status: string;
};
const PAGE_SIZE = 10;
const baseUrl = "http://192.168.1.24:5000/api";

const JobDashboard: React.FC = () => {
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    category: "",
    payment: "",
  });
  const [countries, setCountries] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tasks, setTasks] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("gigpesa_token");
        if (!token) return;

        const res = await axios.get(`${baseUrl}/user/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            start: (currentPage - 1) * PAGE_SIZE,
            limit: PAGE_SIZE,
            searchText: filters.search,
            country: filters.country,
            category: filters.category,
            payment_range: filters.payment,
          },
        });

        const data: Job[] = res.data.tasks;

        // Reset tasks when changing filters (only if page is 1)
        setTasks((prev) => (currentPage === 1 ? data : [...prev, ...data]));
        setTotalPages(res.data.totalPages || 0);
        setTotalRecords(res.data.total || 0);

        // Extract countries and categories
        const countrySet = new Set<string>();
        const categorySet = new Set<string>();
        data.forEach((task) => {
          task.country_codes
            .split(";")
            .map((c) => c.trim())
            .filter(Boolean)
            .forEach((c) => countrySet.add(c));
          if (task.category) categorySet.add(task.category.trim());
        });

        setCountries([...countrySet].sort());
        setCategories([...categorySet].sort());
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentPage, filters]); // ✅ re-fetch on page or filter change

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 150;

      if (nearBottom && !loading && currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, currentPage, totalPages]);


  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // ✅ triggers API re-call from page 1
  };

  return (
    <div className="p-4">
      <div className="relative bg-white border-l-4 border-green-700 p-4 rounded-lg mb-6 shadow">
        <div className="text-sm sm:text-base text-gray-700">
          Available jobs today:{" "}
          <span className="font-medium">{totalRecords}</span>
        </div>
        <div className="relative overflow-hidden h-6 sm:h-7 mt-2">
          <div className="absolute whitespace-nowrap animate-ticker text-green-600 text-sm">
            Use filters or pagination buttons to explore jobs.
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-3 rounded flex flex-col sm:flex-row flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="flex-1 px-3 py-2 text-sm rounded-md bg-white text-black"
        />

        <select
          value={filters.country}
          onChange={(e) => updateFilter("country", e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-sm rounded-md bg-white text-black"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-sm rounded-md bg-white text-black"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.payment}
          onChange={(e) => updateFilter("payment", e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-sm rounded-md bg-white text-black"
        >
          <option value="">Payments Range</option>
          <option value="0-5">$0 - $5</option>
          <option value="5-8">$5 - $8</option>
          <option value="8-10">$8 - $10</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {tasks.map((job) => {
          const mainCountry = job.country_codes.split(";")[0]?.toLowerCase();
          return (
            <div
              key={job.id}
              className="relative border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition text-sm"
            >
              <h4 className="text-base font-medium mb-1">{job.name}</h4>
              <p className="text-gray-600 mb-2">{job.description}</p>

              <ul className="space-y-1 text-gray-700">
                <li>
                  <span className="font-medium">ID:</span> {job.id}
                </li>
                <li>
                  <span className="font-medium">Status:</span> {job.status}
                </li>
                <li>
                  <span className="font-medium">Category:</span> {job.category}
                </li>

                <li>
                  <span className="font-medium">Device:</span> {job.device_type}
                </li>
                <li>
                  <span className="font-medium">Country:</span>{" "}
                  {job.country_codes}
                </li>
                <li>
                  <span className="font-medium">Expires:</span>{" "}
                  {job.expiration_date}
                </li>
                <li>
                  <span className="font-medium">Payout:</span> $
                  {(parseFloat(job.default_payout || "0") * 0.3).toFixed(2)}
                </li>
              </ul>

              <Link
                to={`/job-submission?jobId=${job.id}`} // ← route param, not search param
                className="mt-3 inline-block bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Apply Now
              </Link>
              {mainCountry && (
                <span className="absolute bottom-2 right-2 w-6 h-4 overflow-hidden">
                  <span
                    className={`fi fi-${mainCountry} w-full h-full block`}
                  />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Loading more tasks...
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const saved = sessionStorage.getItem("gigpesa_user");
      if (!saved) {
        navigate("/");
      } else {
        setUser(JSON.parse(saved));
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("gigpesa_user");
    navigate("/");
  };

  const time = new Date().getHours();
  const greeting =
    time < 12 ? "Good morning" : time < 18 ? "Good afternoon" : "Good evening";

  const navLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
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

  const [summary, setSummary] = useState({
    availableEarnings: "0.00",
    pendingEarnings: "0.00",
    referralCount: 0,
  });

  useEffect(() => {
    const checkUser = () => {
      const saved = sessionStorage.getItem("gigpesa_user");
      if (!saved) {
        navigate("/");
      } else {
        setUser(JSON.parse(saved));
      }
    };

    const fetchSummary = async () => {
      const token = sessionStorage.getItem("gigpesa_token");
      if (!token) return;

      try {
        const res = await axios.get(`${baseUrl}/user/dashboard/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch (error) {
        console.error("Failed to fetch summary", error);
      }
    };

    checkUser();
    fetchSummary();
  }, [navigate]);

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      {mobileMenuOpen && (
        <div className="fixed top-0 right-0 w-4/5 max-w-xs h-full bg-white z-50 shadow-xl">
          <div className="flex justify-end p-4">
            <button onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="px-6 space-y-5 font-medium text-sm">
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                {icon} {label}
              </Link>
            ))}
            <Link
              to="/notifications"
              className="flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bell className="w-5 h-5" /> Notifications
            </Link>
            <hr />
            <Link
              to="/settings"
              className="flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="w-5 h-5" /> Settings
            </Link>
            <Link
              to="/referral"
              className="flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserPlus className="w-5 h-5" /> Referrals
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full hover:text-red-500"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-lg font-normal text-green-600 mb-6">
          {greeting}, {user?.name || "User"}!
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            {
              title: "Total Earnings",
              value: `$${parseFloat(summary.availableEarnings).toFixed(2)}`,
              icon: <DollarSign className="w-6 h-6 text-green-600" />,
            },
            {
              title: "Pending Payments",
              value: `$${parseFloat(summary.pendingEarnings).toFixed(2)}`,
              icon: <Clock className="w-6 h-6 text-yellow-500" />,
            },
            {
              title: "Referrals",
              value: summary.referralCount.toString(),
              icon: <Users className="w-6 h-6 text-blue-600" />,
              link: "/referralsUser",
            },
          ].map(({ title, value, icon, link }) =>
            link ? (
              <Link
                key={title}
                to={link}
                className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition block"
              >
                <div className="flex items-center gap-4">
                  {icon}
                  <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-xl font-semibold">{value}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={title}
                className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  {icon}
                  <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-xl font-semibold">{value}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <JobDashboard />
      </main>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 15s linear infinite; display: inline-block; }
        @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-ticker { animation: ticker 20s linear infinite; }
      `}</style>
    </>
  );
};

export default Dashboard;
