import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password validation rules
  const passwordValidations = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    symbol: /[^A-Za-z0-9]/.test(newPassword),
  };

  const allValid = Object.values(passwordValidations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill in all fields.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (!allValid) {
      return toast.error("Password does not meet all requirements.");
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/reset-password", {
        token,
        newPassword,
      });

      toast.success(res.data.message || "Password reset successful.");
      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "Reset failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar minimal />

      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="flex-grow flex items-center justify-center px-4 py-10">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8"
          >
            <h1 className="text-xl sm:text-2xl text-center text-gray-800 font-semibold mb-6">
              🔐 Reset Your Password
            </h1>

            {/* New Password */}
            <div className="mb-5 relative">
              <label htmlFor="new-password" className="text-sm text-gray-600 block mb-1">
                New Password
              </label>
              <input
                id="new-password"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 text-sm border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute top-9 right-3 text-gray-400 hover:text-gray-600"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password strength feedback */}
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              {[
                { label: "At least 8 characters", key: "length" },
                { label: "At least one uppercase letter", key: "upper" },
                { label: "At least one lowercase letter", key: "lower" },
                { label: "At least one number", key: "number" },
                { label: "At least one special character", key: "symbol" },
              ].map(({ label, key }) => (
                <li key={key} className="flex items-center gap-2">
                  {passwordValidations[key as keyof typeof passwordValidations] ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-400" />
                  )}
                  {label}
                </li>
              ))}
            </ul>

            {/* Confirm Password */}
            <div className="mb-6 relative">
              <label htmlFor="confirm-password" className="text-sm text-gray-600 block mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 text-sm border rounded-lg border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-9 right-3 text-gray-400 hover:text-gray-600"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm transition ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </motion.form>
        </div>

      <footer className="bg-green-700 text-white py-6 text-center text-xs sm:text-sm">
        <p>&copy; 2025 GigPesa. All rights reserved.</p>
      </footer>
    </div>
    </>
  );
};

export default ResetPasswordPage;
