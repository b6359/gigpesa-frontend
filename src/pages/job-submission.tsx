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
  const [document, setDocument] = useState<File | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [ipAddress, setIpAddress] = useState("");
  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org/?format=json");
        const data: { ip: string } = await res.json();
        setIpAddress(data.ip);
      } catch (err) {
        console.error("Failed to get IP address:", err);
      }
    };

    fetchIp();
  }, []);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        const token = sessionStorage.getItem("gigpesa_token");
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

    if (!selectedFile) {
      alert("Please upload a proof document.");
      return;
    }

    const formData = new FormData();
    formData.append("task_id", job?.id || "");
    formData.append("earnings", job?.earnings || job?.default_payout || "0.00");
    formData.append("status", job?.status || "Pending");
    formData.append("proof", ipAddress);
    formData.append("device_type", deviceType);
    formData.append("offer_url", job?.offer_url || "");
    formData.append("document", selectedFile); // Make sure `selectedFile` is a File object

    try {
      const token = sessionStorage.getItem("gigpesa_token");
      if (!token) return;

      const res = await fetch(`${baseUrl}/user/task/submit`, {
        method: "POST",
        headers: {
          // DO NOT SET Content-Type here!
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
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
    <main className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl space-y-6">
      {/* Job Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {job.name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {job.description}
        </p>
      </div>

      {/* Job Info */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div>Category: {job.category}</div>
        <div>Device: {job.device_type}</div>
        <div>Country: {job.country_codes}</div>
        <div>Payout: ${job.default_payout}</div>
        <div>ID: {job.id}</div>
        <div>Status: {job.status}</div>
      </div>

      {/* Start Task Button */}
      <div>
        <a
          href={job.offer_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
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
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Earnings */}
        <div>
          <label
            htmlFor="earnings"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Earnings (USD)
          </label>
          <input
            id="earnings"
            type="text"
            value={job?.earnings || job?.default_payout || "0.00"}
            readOnly
            className="mt-1 w-full border px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed"
          />
        </div>

        <div>
          <label
            htmlFor="document"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Upload Proof Document
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            required
          />

          {documentUrl && (
            <div className="mt-2">
              {document?.type.startsWith("image/") ? (
                <img
                  src={documentUrl}
                  alt="Preview"
                  className="max-h-40 rounded border"
                />
              ) : (
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Uploaded File
                </a>
              )}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Status
          </label>
          <input
            id="status"
            type="text"
            value={job?.status || "Pending"}
            readOnly
            className="mt-1 w-full border px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed"
          />
        </div>

        {/* IP Address */}
        <div>
          <label
            htmlFor="ip"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Proof (IP Address)
          </label>
          <input
            id="ip"
            required
            placeholder="e.g. 192.168.1.1:1234"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded bg-white dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* Device Type */}
        <div>
          <label
            htmlFor="device"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Device Type
          </label>
          <select
            id="device"
            required
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded bg-white dark:bg-gray-900 dark:text-white"
          >
            <option value="">Choose device</option>
            <option value="Mobile">Mobile</option>
            <option value="Tablet">Tablet</option>
            <option value="Desktop">Desktop</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 rounded-lg font-semibold transition ${
            canSubmit
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-green-400 text-white opacity-70 cursor-not-allowed"
          }`}
        >
          Submit Job
        </button>
      </form>
    </main>
  );
};

export default JobSubmissionPage;
