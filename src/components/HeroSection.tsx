import React from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onRegister: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onRegister }) => {
  return (
    <section className="bg-gray-100 py-16 sm:py-20 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Animated Heading */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          Make Money Online with <span className="text-green-700">GigPesa</span>
        </motion.h2>

        {/* Animated Subheading */}
        <motion.p
          className="text-base sm:text-lg md:text-xl mb-6 text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
        >
          Get paid for surveys, offers, tasks, and more. Simple. Fast. Secure.
        </motion.p>

        {/* Animated CTA Button */}
        <motion.button
          onClick={onRegister}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-green-700 text-white px-6 py-3 rounded-lg text-base sm:text-lg hover:bg-green-800 transition-colors"
        >
          Join Now — It&apos;s Free!
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
