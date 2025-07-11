import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Zap, Layers3, X } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const modalVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

const WhyChooseSection = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const reasons = [
    {
      title: "Trusted by Thousands",
      description: "Join a community of users already earning daily through GigPesa.",
      icon: <Users className="w-10 h-10 text-green-700 mb-4" />,
      details: "Thousands of people trust GigPesa daily to earn income through legit online tasks. We've built a reliable community that continues to grow.",
    },
    {
      title: "Fast Withdrawals",
      description: "We process payments via PayPal, Crypto, and mobile money fast.",
      icon: <Zap className="w-10 h-10 text-yellow-500 mb-4" />,
      details: "Our withdrawal processing is swift and secure. Most payments are completed in less than 24 hours.",
    },
    {
      title: "Multiple Earning Options",
      description: "Surveys, offers, tasks, videos, and a strong referral program.",
      icon: <Layers3 className="w-10 h-10 text-blue-600 mb-4" />,
      details: "We offer a variety of ways to earn so you can find what works best for your time and skills.",
    },
  ];

  return (
    <section id="why-gigpesa" className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-3xl sm:text-4xl font-bold mb-12">Why Choose GigPesa?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              onClick={() => setActiveCard(index)}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
            >
              {item.icon}
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-700">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeCard !== null && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setActiveCard(null)}
          >
            <motion.div
              className="bg-white max-w-lg w-full mx-4 p-6 rounded-xl shadow-xl relative"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveCard(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="mb-4">{reasons[activeCard].icon}</div>
              <h4 className="text-2xl font-bold mb-2">{reasons[activeCard].title}</h4>
              <p className="text-gray-700">{reasons[activeCard].details}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WhyChooseSection;
