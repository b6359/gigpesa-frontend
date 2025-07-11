import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

const Privacy: React.FC = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: (
        <>
          <p className="mb-4">
            We collect information that you voluntarily provide and data
            automatically collected during your use of our services.
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-1">
            <li>Personal Details (e.g., name, email address, date of birth, country)</li>
            <li>Login credentials (encrypted passwords)</li>
            <li>Usage data (e.g., IP address, browser type, access times)</li>
            <li>Device information (e.g., operating system, mobile identifiers)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </>
      ),
    },
    {
      title: "2. Use of Information",
      content: (
        <>
          <p className="mb-4">We use your data to:</p>
          <ul className="list-disc pl-5 mb-6 space-y-1">
            <li>Register and manage your account</li>
            <li>Provide and improve our services</li>
            <li>Respond to inquiries and provide customer support</li>
            <li>Send updates, promotional materials, and service alerts</li>
            <li>Ensure legal and regulatory compliance</li>
          </ul>
        </>
      ),
    },
    {
      title: "3. Sharing of Information",
      content: (
        <>
          <p className="mb-4">We do not sell your information. We may share data with:</p>
          <ul className="list-disc pl-5 mb-6 space-y-1">
            <li>Trusted third-party service providers (e.g., analytics, hosting)</li>
            <li>Law enforcement or regulatory bodies if required</li>
            <li>In case of a business transfer, such as a merger or acquisition</li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Data Protection",
      content: (
        <>
          <p className="mb-4">We implement robust security measures, including:</p>
          <ul className="list-disc pl-5 mb-6 space-y-1">
            <li>SSL encryption</li>
            <li>Access controls</li>
            <li>Regular audits and security patches</li>
          </ul>
          <p className="mb-6">
            While we strive to protect your data, no method of transmission is 100% secure.
          </p>
        </>
      ),
    },
    {
      title: "5. Your Rights",
      content: (
        <>
          <p className="mb-4">You may be entitled to:</p>
          <ul className="list-disc pl-5 mb-6 space-y-1">
            <li>Access and correct your personal data</li>
            <li>Request deletion of your account</li>
            <li>Object to or restrict processing</li>
            <li>Withdraw consent where applicable</li>
          </ul>
          <p className="mb-6">
            To exercise your rights, please email us at{" "}
            <a
              href="mailto:support@gigpesa.co.ke"
              className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              support@gigpesa.co.ke
            </a>.
          </p>
        </>
      ),
    },
    {
      title: "6. Retention Period",
      content: (
        <p className="mb-6">
          We retain personal data as long as necessary to fulfill the purposes
          outlined in this policy, or as required by law.
        </p>
      ),
    },
    {
      title: "7. Cookies and Tracking",
      content: (
        <p className="mb-6">
          GigPesa uses cookies to enhance user experience and analyze website
          traffic. You may control cookie settings in your browser, though some
          features may not function properly if cookies are disabled.
        </p>
      ),
    },
    {
      title: "8. Third-Party Links",
      content: (
        <p className="mb-6">
          Our site may include links to third-party websites. We are not
          responsible for their privacy practices. Please review their policies
          independently.
        </p>
      ),
    },
    {
      title: "9. Children's Privacy",
      content: (
        <p className="mb-6">
          We do not knowingly collect data from anyone under 16 years of age.
          If such information is identified, we will delete it promptly.
        </p>
      ),
    },
    {
      title: "10. Updates to This Policy",
      content: (
        <p className="mb-6">
          We may update this Privacy Policy. Significant changes will be
          communicated via email or notice on our platform. Please review this
          page periodically.
        </p>
      ),
    },
  ];

  return (
    <div className="bg-white text-gray-800 font-normal antialiased">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[15px]">
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeInUp}
          className="text-2xl md:text-3xl font-semibold text-center mb-6 text-green-700"
        >
          Privacy Policy for GigPesa
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeInUp}
          className="mb-6 text-green-600 text-sm"
        >
          Effective Date: January 1, 2025
        </motion.p>

        <motion.p
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeInUp}
          className="mb-6"
        >
          At <strong>GigPesa</strong>, we value your trust. This Privacy Policy
          outlines how we collect, use, and protect your information when you
          interact with our platform. By using GigPesa, you agree to the
          practices described below.
        </motion.p>

        {sections.map((section, i) => (
          <motion.div key={i} custom={i + 3} initial="hidden" animate="visible" variants={fadeInUp}>
            <SectionTitle>{section.title}</SectionTitle>
            <div className="text-[13px]">{section.content}</div>
          </motion.div>
        ))}
      </div>

      <footer className="bg-green-700 text-white py-6 text-center text-xs sm:text-sm">
        <p>&copy; 2025 GigPesa. All rights reserved.</p>
      </footer>
    </div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg sm:text-xl font-semibold mt-8 mb-3">{children}</h2>
);

export default Privacy;
