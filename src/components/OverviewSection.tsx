import { motion } from "framer-motion";

const OverviewSection = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
          Ways to Earn
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">
          {/* Card 1: Surveys */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <h4 className="text-lg sm:text-xl font-semibold mb-4">Surveys</h4>
            <img
              src="/images/survey.jpg"
              alt="Take online surveys"
              className="w-full h-auto mx-auto mb-4 rounded-lg shadow-md"
            />
            <p className="text-gray-700 text-sm sm:text-base">
              Earn money by sharing your opinion on surveys.
            </p>
          </motion.div>

          {/* Card 2: Offers & Tasks */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h4 className="text-lg sm:text-xl font-semibold mb-4">Offers & Tasks</h4>
            <img
              src="/images/offers-tasks.jpg"
              alt="Complete offers and tasks"
              className="w-full h-auto mx-auto mb-4 rounded-lg shadow-md"
            />
            <p className="text-gray-700 text-sm sm:text-base">
              Complete offers, signups, and tasks for real cash.
            </p>
          </motion.div>

          {/* Card 3: Referrals */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg sm:text-xl font-semibold mb-4">Referrals</h4>
            <img
              src="/images/referrals.jpg"
              alt="Refer friends and earn"
              className="w-full h-auto mx-auto mb-4 rounded-lg shadow-md"
            />
            <p className="text-gray-700 text-sm sm:text-base">
              Invite friends and earn lifetime commissions.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
