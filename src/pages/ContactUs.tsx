import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from 'emailjs-com';


const ContactUs: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setIsSending(true);

  emailjs
    .sendForm('service_3fgskt3', 'template_sm8bbqo', formRef.current!, 'xuJaUU6eawptEqxv1')
    .then(
      () => {
        setIsSending(false);
        setIsSubmitted(true);
        formRef.current?.reset();
        setTimeout(() => setIsSubmitted(false), 4000);
      },
      (error) => {
        console.error(error.text);
        setIsSending(false);
        alert("Failed to send message. Please try again.");
      }
    );
};


  return (
    <div className="bg-white text-gray-800 font-normal antialiased min-h-screen relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-green-700">Contact Us</h1>
        <p className="mb-6 text-[18px] text-gray-700">
          Have a question, feedback, or need assistance? We're here to help.
          Feel free to reach out using the information or form below.
        </p>

        <div className="mb-10">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Support Details</h2>
          <ul className="list-disc pl-5 space-y-2 text-[13px]">
            <li>
              Email:{" "}
              <a href="mailto:support@gigpesa.co.ke" className="text-blue-600 underline">
                support@gigpesa.co.ke
              </a>
            </li>
            <li>WhatsApp: +254-799-070-932</li>
            <li>Address: Nairobi, Kenya</li>
          </ul>
        </div>

        {/* Contact Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-gray-100 p-6 sm:p-8 rounded shadow"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Send a Message</h2>

          <div className="mb-4">
            <label htmlFor="name" className="block text-[13px] mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-[13px]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-[13px] mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-[13px]"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-[13px] mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSending}
            className={`flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto ${
              isSending ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {isSending && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-4 right-4 sm:right-6 z-50 bg-white text-green-700 px-4 py-2 rounded shadow-lg text-sm sm:text-base"
          >
            ✅ Message sent successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-green-700 text-white py-6 text-center text-[13px] sm:text-base">
        <p>&copy; 2025 GigPesa. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactUs;
