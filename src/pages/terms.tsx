import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Terms: React.FC = () => {
  return (
    <div className="bg-white text-gray-800 font-normal antialiased text-[15px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.h1
          className="text-2xl sm:text-3xl font-bold mb-4 text-green-700"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          Terms of Service
        </motion.h1>

        <motion.p className="mb-4" variants={fadeInUp} initial="initial" animate="animate">
          These Terms of Service ("Terms") govern your access to and use of the GigPesa website and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.
        </motion.p>

        {sections.map((section, index) => (
          <motion.section
            key={index}
            className="mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h2 className="text-xl mt-6 mb-2 font-normal">{section.title}</h2>
            {section.content.map((para, idx) =>
              typeof para === "string" ? (
                <p className="mb-4" key={idx}>{para}</p>
              ) : (
                <ul className="list-disc pl-6 mb-4 space-y-1" key={idx}>
                  {para.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ul>
              )
            )}
          </motion.section>
        ))}
      </div>

      <footer className="bg-green-700 text-white py-6 text-center text-[13px]">
        <p className="mb-2">&copy; 2025 GigPesa. All rights reserved.</p>
      </footer>
    </div>
  );
};

const sections = [
  {
    title: "1. Eligibility",
    content: [
      "To use GigPesa, you must be at least 16 years of age. By using our services, you represent and warrant that you meet this requirement and have the legal capacity to enter into a binding agreement.",
    ],
  },
  {
    title: "2. Account Registration and Security",
    content: [
      "When creating an account with GigPesa, you must provide accurate and complete information. You are solely responsible for the activity that occurs on your account, and you must keep your account password secure. Notify us immediately of any breach of security or unauthorized use of your account.",
    ],
  },
  {
    title: "3. Use of Services",
    content: [
      "You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service to:",
      [
        "Violate any local, state, national, or international law or regulation.",
        "Engage in any fraudulent or deceptive activity.",
        "Upload or transmit viruses, malware, or any other harmful code.",
        "Collect or track the personal information of others without consent.",
        "Send unsolicited or unauthorized advertising or promotional material.",
        "NO use of VPN or PROXIES, when this is detected no warnings shall be issued and therefore account straight ban."
      ]
    ],
  },
  {
    title: "4. Payment Terms",
    content: [
      "Payments are processed on a weekly basis. GigPesa reserves the right to adjust payment schedules or withhold payments in the event of suspected fraud or violation of these Terms. You are responsible for any fees, taxes, or charges associated with your use of the Service."
    ],
  },
  {
    title: "5. Intellectual Property",
    content: [
      "All content and materials on the GigPesa platform, including but not limited to text, graphics, logos, and software, are the property of GigPesa or its licensors and are protected by copyright and other intellectual property laws. You may not copy, reproduce, or distribute any content without our prior written consent."
    ],
  },
  {
    title: "6. Termination",
    content: [
      "GigPesa may suspend or terminate your access to the Service at any time, with or without cause or notice, if we believe you have violated these Terms or engaged in any behavior that is harmful to the Service or other users."
    ],
  },
  {
    title: "7. Disclaimers",
    content: [
      "The Service is provided on an \"as is\" and \"as available\" basis. GigPesa disclaims all warranties, express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement."
    ],
  },
  {
    title: "8. Limitation of Liability",
    content: [
      "In no event shall GigPesa be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or use, arising out of or in any way connected with your use of the Service."
    ],
  },
  {
    title: "9. Governing Law",
    content: [
      "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which GigPesa operates, without regard to its conflict of law provisions."
    ],
  },
  {
    title: "10. Changes to Terms",
    content: [
      "GigPesa reserves the right to update or modify these Terms at any time without prior notice. Your continued use of the Service following any such changes constitutes your acceptance of the new Terms."
    ],
  },
];

export default Terms;
