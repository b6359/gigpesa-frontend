import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

interface Job {
  id: string;
  name: string;
  description: string;
  category: string;
  default_payout: string;
  country_codes: string;
  earnings: string;
  status: string;
  offer_url: string;
  device_type: string;
}

const baseUrl = "http://192.168.1.24:5000/api";

const JobSubmissionPage = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  console.log(jobId);
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const [canSubmit, setCanSubmit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [countdownStarted, setCountdownStarted] = useState(false);

  const [ipAddress, setIpAddress] = useState("");
  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    // fetch public IP once, on mount
    const fetchIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org/?format=json");
        const data: { ip: string } = await res.json();
        setIpAddress(data.ip); // ⬅️ put it in state
      } catch (err) {
        console.error("Failed to get IP address:", err);
      }
    };

    fetchIp();
  }, []); // empty deps → runs once

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("gigpesa_token");
        if (!token) return;

        const res = await fetch(`${baseUrl}/user/task/${jobId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Server error");
        const data: { task: Job } = await res.json();
        setJob(data.task);
      } catch (err) {
        console.error(err);
        alert("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!job?.id && !jobId) {
      alert("Missing task ID.");
      return;
    }

    if (!ipAddress.trim() || !deviceType.trim()) {
      alert("IP Address and Device Type are required.");
      return;
    }

    const payload = {
      task_id: job?.id ?? jobId,
      earnings: job?.earnings || job?.default_payout || "0.00",
      status: job?.status || "Pending",
      proof: ipAddress,
      device_type: deviceType,
    };

    console.log("Submitting payload:", payload);

    try {
      const token = localStorage.getItem("gigpesa_token");
      if (!token) return;

      const res = await fetch(`${baseUrl}/user/task/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Submission failed. Try again.");
        return;
      }

      alert("Job submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Network or server error.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading job…</p>;
  if (!job)
    return <p className="text-center mt-10 text-red-600">Job not found.</p>;

  return (
    <main className="p-6 max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-2">{job.name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{job.description}</p>

      <ul className="mb-4 space-y-1">
        <li>
          <strong>Category:</strong> {job.category}
        </li>
        <li>
          <strong>Device:</strong> {job.device_type}
        </li>
        <li>
          <strong>Country:</strong> {job.country_codes}
        </li>
        <li>
          <strong>Payout:</strong> ${job.default_payout}
        </li>
        <li>
          <strong>ID:</strong> {job.id}
        </li>
        <li>
          <strong>Status:</strong> {job.status}
        </li>
      </ul>

      <a
        href={job.offer_url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onMouseDown={() => setCountdownStarted(true)}
      >
        Start Task
      </a>

      {countdownStarted && (
        <p className="text-sm text-red-600 mt-2">
          {canSubmit
            ? "You can now submit your task."
            : `Submit in ${Math.floor(timeLeft / 60)}:${String(
                timeLeft % 60
              ).padStart(2, "0")}`}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="earnings" className="block text-sm font-medium">
            Earnings (USD)
          </label>
          <input
            id="earnings"
            type="text"
            value={job?.earnings || job?.default_payout || "0.00"}
            readOnly
            className="mt-1 w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            Status
          </label>
          <input
            id="status"
            type="text"
            value={job?.status || "Pending"}
            readOnly
            className="mt-1 w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="ip" className="block text-sm font-medium">
            Proof (IP Address)
          </label>
          <input
            id="ip"
            required
            placeholder="e.g. 192.168.1.1:1234"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="device" className="block text-sm font-medium">
            Device Type
          </label>
          <select
            id="device"
            required
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded"
          >
            <option value="">Choose device</option>
            <option value="Mobile">Mobile</option>
            <option value="Tablet">Tablet</option>
            <option value="Desktop">Desktop</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          type="submit"
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
