import { motion } from "framer-motion";

const paymentMethods = [
  { src: "/images/airtm.png", alt: "Airtm" },
  { src: "/images/paypal.png", alt: "PayPal" },
  { src: "/images/payeer.png", alt: "Payeer" },
  { src: "/images/mpesa.png", alt: "MPESA" },
];

const PaymentMethodsSection = () => {
  return (
    <section className="bg-white py-12 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <h2 className="text-xl sm:text-2xl text-gray-800 tracking-tight">
           Our Payment Methods
        </h2>

        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-6 sm:gap-8 w-max"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            }}
          >
            {[...paymentMethods, ...paymentMethods].map((logo, i) => (
              <div
                key={`${logo.alt}-${i}`}
                className="bg-gray-100 shadow-md rounded-xl p-4 flex items-center justify-center w-32 h-20 sm:w-36 sm:h-24 transition-transform hover:scale-105 duration-300"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethodsSection;
