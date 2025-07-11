import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const JobSubmissionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [canSubmit, setCanSubmit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [countdownStarted, setCountdownStarted] = useState(false);

  const job = {
    name: searchParams.get("name") || "Sample Job",
    description: searchParams.get("description") || "Complete the task as instructed.",
    category: searchParams.get("category") || "General",
    country: searchParams.get("country") || "N/A",
    payout: searchParams.get("payout") || "0.00",
    device: searchParams.get("device") || "Any",
    offer_url: searchParams.get("offer_url") || "#",
    id: searchParams.get("id") || "N/A",
    status: searchParams.get("status") || "Unknown",
  };

  // Countdown effect
  useEffect(() => {
    if (!countdownStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownStarted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Your submission has been received!");
    navigate("/dashboard");
  };

  return (
    <main className="p-6 max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h4 className="text-xl font-medium mb-1">
        Submit Proof of Work (READ INSTRUCTIONS CAREFULLY)
        <span className="block text-sm text-red-600 mt-1">
          (DO NOT USE VPN/PROXY while doing the task. STRAIGHT Account BAN when this is detected)
        </span>
      </h4>

      {/* Job Details */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold">{job.name}</h2>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-2">{job.description}</p>
        <ul className="text-base space-y-1 mb-4">
          <li><strong>Category:</strong> {job.category}</li>
          <li><strong>Device Type:</strong> {job.device}</li>
          <li><strong>Country:</strong> {job.country}</li>
          <li><strong>Payout:</strong> ${job.payout}</li>
          <li><strong>ID:</strong> {job.id}</li>
          <li><strong>Status:</strong> {job.status}</li>
        </ul>

        <a
          href={job.offer_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded text-base hover:bg-green-700 transition"
          onMouseDown={() => setCountdownStarted(true)}
        >
          Start Task
        </a>

        {countdownStarted && (
          <p className="text-sm text-red-600 mt-2">
            {canSubmit
              ? "You can now submit your task."
              : `You can submit your task in ${Math.floor(timeLeft / 60)}:${String(
                  timeLeft % 60
                ).padStart(2, "0")}`}
          </p>
        )}
      </section>

      {/* Submission Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ip-address" className="block text-sm font-medium">
            Enter Your IP Address and Device type as proof:
          </label>
          <input
            type="text"
            id="ip-address"
            name="ip-address"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="device-type" className="block text-sm font-medium">
            Device Type:
          </label>
          <select
            id="device-type"
            name="device-type"
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select device</option>
            <option value="Mobile">Mobile</option>
            <option value="Tablet">Tablet</option>
            <option value="Desktop">Desktop</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`px-6 py-2 rounded font-medium transition ${
            canSubmit
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-green-600 text-white opacity-50 cursor-not-allowed"
          }`}
        >
          Submit Job
        </button>
      </form>
    </main>
  );
};

export default JobSubmissionPage;
