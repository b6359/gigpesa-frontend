

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";


const getReferralLink = () => {
  const saved = sessionStorage.getItem("gigpesa_user");
  let id = "unknown";

  if (saved) {
    try {
      const user = JSON.parse(saved);
      id = user?.id || "unknown";
    } catch {
      /* ignore malformed JSON */
    }
  }

  return `http://localhost:5173/ref/${id}`;
};

const Referral: React.FC = () => {
  const [refLink, setRefLink] = useState(getReferralLink());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onStorage = () => setRefLink(getReferralLink());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Could not copy link – please copy it manually.");
    }
  };

  return (
    <div className="bg-white text-gray-800 font-normal antialiased">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[15px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-green-700">
            Refer &amp; Earn with GigPesa
          </h1>
          <p className="mb-6 text-gray-600">
            Help others discover GigPesa and earn rewards!
          </p>

          <SectionTitle>How It Works</SectionTitle>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Share your unique referral link with friends or followers.</li>
            <li>When someone signs up using your link and starts earning, you get a bonus.</li>
            <li>Earn a percentage of their earnings (without affecting theirs).</li>
          </ul>

          <SectionTitle>Referral Rewards</SectionTitle>
          <p className="mb-4">
            You’ll receive <strong>10% of your referral’s earnings</strong> for the first 3 months.
          </p>

          <SectionTitle>Your Referral Link</SectionTitle>
          <div className="mb-6">
            <input
              type="text"
              value={refLink}
              readOnly
              className="w-full sm:w-3/4 px-3 py-2 border border-gray-300 rounded mb-2 text-[13px]"
            />
            <button
              onClick={copyToClipboard}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          <SectionTitle>Tips for Successful Referrals</SectionTitle>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Share on social media platforms with a personal story.</li>
            <li>Invite friends directly via WhatsApp or SMS.</li>
            <li>Include your referral link in your blog, videos, or bio section.</li>
          </ul>

          <SectionTitle>Need Help?</SectionTitle>
          <p>
            <a
              href="mailto:support@gigpesa.co.ke"
              className="text-blue-600 hover:underline"
            >
              Contact our support team
            </a>
            {" "}anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    className="text-lg sm:text-xl font-medium mt-8 mb-3"
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    {children}
  </motion.h2>
);

export default Referral;
