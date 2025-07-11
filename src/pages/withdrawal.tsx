import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WithdrawalPage() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [toast, setToast] = useState("");
  const [withdrawalsVisible, setWithdrawalsVisible] = useState(false);
  const [serverTime, setServerTime] = useState("");
  const [invoiceCountdown, setInvoiceCountdown] = useState("");
  const [paymentCountdown, setPaymentCountdown] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      updateCountdowns();
    }, 1000);
    updateCountdowns();
    setWithdrawalsVisible(true);
    return () => clearInterval(interval);
  }, []);

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
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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
    setDetailsError("");

    if (isNaN(amt) || amt < 2) {
      setAmountError(true);
      valid = false;
    }

    if (!method || !details.trim()) {
      alert("Please complete all fields.");
      return false;
    }

    if (method === "paypal" || method === "airtm") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(details)) {
        setDetailsError("Please enter a valid email address.");
        valid = false;
      }
    } else if (method === "mpesa") {
      if (!details.startsWith("+254") || details.length < 10) {
        setDetailsError("M-Pesa number must start with +254.");
        valid = false;
      }
    } else if (method === "payeer") {
      const payeerRegex = /^P\d{7,12}$/;
      if (!payeerRegex.test(details)) {
        setDetailsError("Payeer ID must be like P1234567 or P123456789012.");
        valid = false;
      }
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/withdraw.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method, details }),
      });

      const result = await res.json();

      if (result.success) {
        setAmount("");
        setMethod("");
        setDetails("");
        setConfirmationVisible(true);
        setToast("✅ Withdrawal request submitted!");
      } else {
        alert("❌ " + (result.error || "Submission failed."));
      }
    } catch (err) {
      alert("❌ Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg mb-6">
          <div className="flex items-center space-x-4 overflow-hidden">
            <h1 className="text-xl sm:text-2xl font-bold whitespace-nowrap">Withdraw Funds</h1>
            <div className="relative overflow-hidden flex-1 h-6 sm:h-7">
              <div className="absolute whitespace-nowrap animate-ticker text-white text-sm sm:text-base font-normal">
                PayPal/Airtm: email only. M-Pesa: starts with +254. Payeer: P followed by digits.
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount (USD)</label>
            <input
              type="number"
              min="2"
              step="0.01"
              id="amount"
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {amountError && <p className="text-red-500 text-sm mt-1">Minimum withdrawal is $2</p>}
          </div>

          <div>
            <label htmlFor="method" className="block text-sm font-medium mb-1">Payment Method</label>
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

          <div>
            <label htmlFor="details" className="block text-sm font-medium mb-1">Account Details</label>
            <input
              type="text"
              id="details"
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter email / number / Payeer ID"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
            {detailsError && <p className="text-red-500 text-sm mt-1">{detailsError}</p>}
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

        {/* Confirmation */}
        {confirmationVisible && (
          <div className="mt-6 bg-green-100 text-green-800 p-4 rounded shadow">
            ✅ Your withdrawal request has been submitted. Payment will be processed within the stipulated payment time.
          </div>
        )}

        {/* Recent Withdrawals */}
        {withdrawalsVisible && (
          <section className="mt-10 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Withdrawals</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between border-b pb-2">
                <span>PayPal - john@example.com</span>
                <span className="text-green-600">Completed - $25</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span>M-Pesa - +2547xxxxxxx</span>
                <span className="text-yellow-600">Pending - $10</span>
              </li>
            </ul>
          </section>
        )}

        {/* Countdown */}
        <section className="bg-white py-12 text-center mt-10 rounded-lg shadow">
          <h3 className="text-2xl font-bold mb-4">⏱️ Live Countdown</h3>
          <p className="mb-2">Current Server Time: <span className="font-semibold text-green-800">{serverTime}</span></p>
          <p className="mb-2">Invoice cut-off: <span className="font-semibold text-yellow-600">{invoiceCountdown}</span></p>
          <p>Payment sent in: <span className="font-semibold text-green-800">{paymentCountdown}</span></p>
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
