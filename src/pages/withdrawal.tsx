import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import axios from "axios";

interface Withdrawal {
  id: string;
  method: string;
  name: string;
  details: string;
  amount: string;
  status: string;
  createdAt?: string; 
}

export default function WithdrawalPage() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [details, setDetails] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [toast, setToast] = useState("");
  const [withdrawalsVisible, setWithdrawalsVisible] = useState(false);

  const [serverTime, setServerTime] = useState("");
  const [invoiceCountdown, setInvoiceCountdown] = useState("");
  const [paymentCountdown, setPaymentCountdown] = useState("");
  const [balance, setBalance] = useState(0);
  const [summary, setSummary] = useState({
    availableEarnings: "0.00",
  });
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const baseUrl = "http://192.168.1.24:5000/api";
  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchEarnings();
    const interval = setInterval(() => updateCountdowns(), 1000);
    updateCountdowns();
    setWithdrawalsVisible(true);
    return () => clearInterval(interval);
  }, []);

  const fetchEarnings = async () => {
    const token = localStorage.getItem("gigpesa_token");
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

  const updateCountdowns = () => {
    const now = new Date();

    const getNextWeekday = (weekday: number) => {
      const result = new Date(now);
      result.setDate(now.getDate() + ((7 + weekday - now.getDay()) % 7 || 7));
      result.setHours(0, 0, 0, 0);
      return result;
    };

    const invoiceCutoff = getNextWeekday(2);
    const paymentDay = getNextWeekday(4);

    const countdown = (target: Date) => {
      const distance = target.getTime() - now.getTime();
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    setServerTime(now.toLocaleString());
    setInvoiceCountdown(countdown(invoiceCutoff));
    setPaymentCountdown(countdown(paymentDay));
  };

  const validateForm = () => {
    const amt = parseFloat(amount);
    let valid = true;
    setAmountError(false);

    if (isNaN(amt) || amt < 2) {
      setAmountError(true);
      valid = false;
    }

    if (amt > balance) {
      setAmountError(true);
      alert(
        `Insufficient earnings! You have $${balance.toFixed(2)} available.`
      );
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload = {
        amount: Number(amount),
        method,
        details,
        status: "Pending",
      };

      const token = localStorage.getItem("gigpesa_token");

      const res = await fetch("http://192.168.1.24:5000/api/user/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setAmount("");
        setMethod("");
        setDetails("");
        setConfirmationVisible(true);
        setBalance(parseFloat(result.availableEarnings));
        setToast("✅ Withdrawal request submitted!");
      } else {
        alert("❌ " + (result.error || "Submission failed."));
      }
    } catch {
      alert("❌ Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchWithdrawals = async (page = 1) => {
    try {
      const token = localStorage.getItem("gigpesa_token");
      if (!token) return;

      const res = await axios.get<{
        withdrawals: Withdrawal[];
        totalPages: number;
      }>(`${baseUrl}/user/withdrawals`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          start: (page - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
        },
      });

      const { withdrawals: rows, totalPages } = res.data;

      setWithdrawals(
        (prev) => (page === 1 ? rows : [...prev, ...rows]) 
      );
      setTotalPages(totalPages);
    } catch (err) {
      console.error("Failed to load withdrawals", err);
    }
  };

  useEffect(() => {
    fetchWithdrawals(1);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 150;
      if (nearBottom && currentPage < totalPages) {
        const next = currentPage + 1;
        setCurrentPage(next);
        fetchWithdrawals(next);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [currentPage, totalPages]);

  return (
    <>
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg mb-6">
          <div className="flex items-center space-x-4 overflow-hidden">
            <h1 className="text-xl sm:text-2xl font-bold whitespace-nowrap">
              Withdraw Funds
            </h1>
            <div className="relative overflow-hidden flex-1 h-6 sm:h-7">
              <div className="absolute whitespace-nowrap animate-ticker text-white text-sm sm:text-base font-normal">
                PayPal/Airtm: email only. M-Pesa: starts with +254. Payeer: P
                followed by digits.
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
        >
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount (USD){" "}
              {balance !== null && !isNaN(balance) && (
                <span className="text-gray-500">
                  (Available: $
                  {parseFloat(summary.availableEarnings).toFixed(2)})
                </span>
              )}
            </label>
            <input
              type="number"
              min="2"
              step="0.01"
              id="amount"
              className={`w-full p-2 rounded border ${
                amountError ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {amountError && (
              <p className="text-red-500 text-sm mt-1">
                {parseFloat(amount) < 2
                  ? "Minimum withdrawal is $2"
                  : `Insufficient balance. You only have $${balance.toFixed(
                      2
                    )} available.`}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="method" className="block text-sm font-medium mb-1">
              Payment Method
            </label>
            <select
              id="method"
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              required
            >
              <option value="">Select a method</option>
              <option value="paypal">🅿️ PayPal</option>
              <option value="airtm">🌐 Airtm</option>
              <option value="mpesa">📱 M-Pesa</option>
              <option value="payeer">💳 Payeer</option>
            </select>
            <div className="flex space-x-4 mt-2">
              <img src="/images/paypal.png" alt="PayPal" className="w-8 h-8" />
              <img src="/images/airtm.png" alt="Airtm" className="w-8 h-8" />
              <img src="/images/mpesa.png" alt="M-Pesa" className="w-8 h-8" />
              <img src="/images/payeer.png" alt="Payeer" className="w-8 h-8" />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Request Withdrawal"}
            </button>
          </div>
        </form>

        {confirmationVisible && (
          <div className="mt-6 bg-green-100 text-green-800 p-4 rounded shadow">
            ✅ Your withdrawal request has been submitted. Payment will be
            processed within the stipulated payment time.
          </div>
        )}

        <ul className="space-y-2 text-sm">
          {withdrawalsVisible && withdrawals.length > 0 && (
            <section className="mt-10 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
              {withdrawals.map((w, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 shadow-md mb-3 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-100 capitalize">
                      Payment Method -{" "}
                      <span className="text-black">{w.method}</span>
                    </h3>
                    <span
                      className={`text-sm font-medium ${
                        w.status.toLowerCase() === "completed"
                          ? "text-green-600"
                          : "text-yellow-500"
                      }`}
                    >
                      {w.status} - ${parseFloat(w.amount).toFixed(2)}
                    </span>
                  </div>
                  <span>Name - {w.name}</span>
                </div>
              ))}
            </section>
          )}
        </ul>

        <section className="bg-white py-12 text-center mt-10 rounded-lg shadow">
          <h3 className="text-2xl font-bold mb-4">⏱️ Live Countdown</h3>
          <p className="mb-2">
            Current Server Time:{" "}
            <span className="font-semibold text-green-800">{serverTime}</span>
          </p>
          <p className="mb-2">
            Invoice cut-off:{" "}
            <span className="font-semibold text-yellow-600">
              {invoiceCountdown}
            </span>
          </p>
          <p>
            Payment sent in:{" "}
            <span className="font-semibold text-green-800">
              {paymentCountdown}
            </span>
          </p>
        </section>
      </main>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow animate-fade-in-up z-50">
          {toast}
        </div>
      )}

      <Footer />
    </>
  );
}
