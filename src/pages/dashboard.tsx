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
  Menu,
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

const BATCH_SIZE = 10;

// Jobs Section
const JobDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    category: "",
    payment: "",
  });
  const [countries, setCountries] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("gigpesa_token");
        if (!token) return;

        const res = await axios.get("/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data: Job[] = res.data.jobs;
        setJobs(data);

        const countrySet = new Set<string>();
        const categorySet = new Set<string>();

        data.forEach((j) => {
          j.country_codes
            .split(";")
            .map((c) => c.trim())
            .filter(Boolean)
            .forEach((c) => countrySet.add(c));
          if (j.category) categorySet.add(j.category.trim());
        });

        setCountries([...countrySet].sort());
        setCategories([...categorySet].sort());
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  const filtered = jobs.filter((job) => {
    const term = filters.search.toLowerCase();
    const okSearch =
      job.name.toLowerCase().includes(term) ||
      job.description.toLowerCase().includes(term);

    const jobCountries = job.country_codes
      .split(";")
      .map((c) => c.trim().toLowerCase());
    const okCountry =
      !filters.country || jobCountries.includes(filters.country.toLowerCase());

    const okCategory =
      !filters.category ||
      job.category.toLowerCase() === filters.category.toLowerCase();

    const payout = parseFloat(job.default_payout || "0") * 0.3;
    let minPay = 0,
      maxPay = Infinity;
    if (filters.payment.includes("-")) {
      [minPay, maxPay] = filters.payment.split("-").map(Number);
    }
    const okPayout =
      !filters.payment || (payout >= minPay && payout <= maxPay);

    return okSearch && okCountry && okCategory && okPayout;
  });

  const loadMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setVisibleCount(BATCH_SIZE);
  };

  return (
    <div className="p-4">
      {/* Banner */}
      <div className="relative bg-white border-l-4 border-green-700 p-4 rounded-lg mb-6 shadow animate-slideIn">
        <div className="text-sm sm:text-base text-gray-700">
          Available jobs today: <span className="font-medium">{filtered.length}</span>
        </div>
        <div className="relative overflow-hidden h-6 sm:h-7 mt-2">
          <div className="absolute whitespace-nowrap animate-ticker text-green-600 text-sm font-normal">
            Use filters or scroll to explore more jobs.
          </div>
        </div>
      </div>

      {/* Filters */}
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
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-sm rounded-md bg-white text-black"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
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

      {/* Job List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.slice(0, visibleCount).map((job) => {
          const mainCountry = job.country_codes.split(";")[0]?.toLowerCase();
          return (
            <div key={job.id} className="relative border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition text-sm">
              <h4 className="text-base font-medium mb-1">{job.name}</h4>
              <p className="text-gray-600 mb-2">{job.description}</p>
              <ul className="space-y-1 text-gray-700">
                <li><span className="font-medium">ID:</span> {job.id}</li>
                <li><span className="font-medium">Status:</span> {job.status}</li>
                <li><span className="font-medium">Category:</span> {job.category}</li>
                <li><span className="font-medium">Device:</span> {job.device_type}</li>
                <li><span className="font-medium">Country:</span> {job.country_codes}</li>
                <li><span className="font-medium">Expires:</span> {job.expiration_date}</li>
                <li><span className="font-medium">Payout:</span> ${ (parseFloat(job.default_payout || "0") * 0.3).toFixed(2) }</li>
              </ul>
              <a
                href={`/job-submission?jobId=${job.id}`}
                className="mt-3 inline-block bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Apply Now
              </a>
              {mainCountry && (
                <span className="absolute bottom-2 right-2 w-6 h-4 overflow-hidden">
                  <span className={`fi fi-${mainCountry} w-full h-full block`} />
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-center text-sm text-gray-500 mt-4">
        {visibleCount >= filtered.length ? "All jobs loaded." : "Scroll to load more jobs..."}
      </div>
    </div>
  );
};
// Main Dashboard Component
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const saved = localStorage.getItem("gigpesa_user");
      if (!saved) {
        navigate("/signin");
      } else {
        setUser(JSON.parse(saved));
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("gigpesa_user");
    navigate("/signin");
  };

  const time = new Date().getHours();
  const greeting =
    time < 12 ? "Good morning" : time < 18 ? "Good afternoon" : "Good evening";

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: "/micro-jobs", label: "Micro-Jobs", icon: <Briefcase className="w-5 h-5" /> },
    { to: "/withdrawal", label: "Withdraw", icon: <Wallet className="w-5 h-5" /> },
    { to: "/advertise", label: "Advertise", icon: <Megaphone className="w-5 h-5" /> },
  ];

  return (
    <>
      <header className="bg-green-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/images/gigpesa-website-logo.png" alt="GigPesa Logo" className="h-12 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(({ to, label, icon }) => (
              <Link key={label} to={to} className="flex items-center gap-1 hover:underline">
                {icon} {label}
              </Link>
            ))}
            <Link to="/notifications" className="hover:text-green-300">
              <Bell className="w-5 h-5" />
            </Link>
            <div className="relative">
              <button onClick={() => setProfileOpen((o) => !o)}>
                <img src="/images/default-avatar.png" alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-gray-700 rounded-md shadow-xl z-50">
                  <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <Link to="/referrals" className="flex items-center px-4 py-2 hover:bg-gray-100">
                    <UserPlus className="w-4 h-4" /> Referrals
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)} />
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
              <Link key={label} to={to} className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                {icon} {label}
              </Link>
            ))}
            <Link to="/notifications" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <Bell className="w-5 h-5" /> Notifications
            </Link>
            <hr />
            <Link to="/settings" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <Settings className="w-5 h-5" /> Settings
            </Link>
            <Link to="/referrals" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <UserPlus className="w-5 h-5" /> Referrals
            </Link>
            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
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
          {[{ title: "Total Earnings", value: "$1,245.00", icon: <DollarSign className="w-6 h-6 text-green-600" /> },
            { title: "Pending Payments", value: "$312.00", icon: <Clock className="w-6 h-6 text-yellow-500" /> },
            { title: "Referrals", value: "89", icon: <Users className="w-6 h-6 text-blue-600" /> }]
            .map(({ title, value, icon }) => (
              <div key={title} className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg">
                <div className="flex items-center gap-4">
                  {icon}
                  <div><p className="text-sm text-gray-500">{title}</p><p className="text-xl font-semibold">{value}</p></div>
                </div>
              </div>
            ))}
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
