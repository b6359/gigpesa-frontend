import { motion, cubicBezier } from "framer-motion";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

const testimonials = [
  {
    name: "Faith N.",
    image: "https://i.pravatar.cc/100?img=32",
    message: "“GigPesa helped me earn extra cash during campus. It's simple and real!”",
  },
  {
    name: "Samuel K.",
    image: "https://i.pravatar.cc/100?img=45",
    message: "“I complete offers on my phone anytime. Fast payments. Highly recommended!”",
  },
  {
    name: "Linda M.",
    image: "https://i.pravatar.cc/100?img=12",
    message: "“Referrals changed my life. I earn passively every week. Thank you, GigPesa!”",
  },
];

const testimonialVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: cubicBezier(0.25, 0.1, 0.25, 1), // ✅ Custom easing, fully typed
    },
  },
};

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: () =>
      setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length),
    trackMouse: true,
  });

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Trusted by Thousands
        </h3>

        {/* Mobile Carousel */}
        <div className="block md:hidden" {...swipeHandlers}>
          <motion.div
            key={current}
            className="bg-white p-6 rounded-2xl shadow text-center transition-all"
            initial="hidden"
            animate="visible"
            variants={testimonialVariants}
          >
            <img
              src={testimonials[current].image}
              alt={testimonials[current].name}
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <h4 className="font-semibold text-lg mb-2">{testimonials[current].name}</h4>
            <p className="text-gray-600 text-sm">{testimonials[current].message}</p>
          </motion.div>
          <div className="flex justify-center mt-4 space-x-2">
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === current ? "bg-green-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 text-center">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={testimonialVariants}
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <h4 className="font-semibold text-lg mb-2">{t.name}</h4>
              <p className="text-gray-600 text-sm">{t.message}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
