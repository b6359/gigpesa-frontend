import { useEffect, useState } from "react";

const StatsCountdownSection = () => {
  const [serverTime, setServerTime] = useState("");
  const [invoiceTimer, setInvoiceTimer] = useState("");
  const [paymentTimer, setPaymentTimer] = useState("");

  useEffect(() => {
    const getNextWeekday = (weekday: number) => {
      const now = new Date();
      const resultDate = new Date(now);
      const daysToAdd = (7 + weekday - now.getDay()) % 7 || 7;
      resultDate.setDate(now.getDate() + daysToAdd);
      resultDate.setHours(0, 0, 0, 0);
      return resultDate;
    };

    const formatCountdown = (target: Date) => {
      const now = new Date();
      const distance = target.getTime() - now.getTime();
      if (distance <= 0) return "0d 0h 0m 0s";

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const updateCountdowns = () => {
      const now = new Date();
      setServerTime(now.toLocaleString());

      const invoiceCutoff = getNextWeekday(2); // Tuesday
      const paymentDay = getNextWeekday(4); // Thursday

      setInvoiceTimer(formatCountdown(invoiceCutoff));
      setPaymentTimer(formatCountdown(paymentDay));
    };

    const intervalId = setInterval(updateCountdowns, 1000);
    updateCountdowns();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="bg-white py-8 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-lg sm:text-xl text-green-600 tracking-tight">
          ⏱️ Live Countdown
        </h2>

        <div className="flex flex-col gap-3 text-sm sm:text-base text-gray-700">
          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <p className="text-gray-500">Current Server Time</p>
            <p className="text-green-600">{serverTime}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <p className="text-gray-500">Invoice Cut-Off</p>
            <p className="text-yellow-600">{invoiceTimer}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
            <p className="text-gray-500">Payment Countdown</p>
            <p className="text-green-600">{paymentTimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsCountdownSection;
