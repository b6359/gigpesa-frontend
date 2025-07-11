import { motion } from "framer-motion";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const timeline = [
  { year: "2023", event: "Idea for GigPesa was born to empower micro-earners in Africa." },
  { year: "2024", event: "MVP launched with a focus on paid surveys and affiliate micro-jobs." },
  { year: "2025", event: "Official public release, thousands of users onboarded across the continent." },
];

const faqs = [
  {
    question: "What is GigPesa?",
    answer: "Gigpesa is a micro-earning platform where users can earn money by completing small online tasks such as surveys, app testing, watching ads, and more."
  },
  {
    question: "Is it free to join?",
    answer: "Absolutely. Creating an account and participating in gigs is 100% free."
  },
  {
    question: "How do I get paid?",
    answer: "You can withdraw your earnings via M-Pesa, PayPal, or local bank transfer depending on your location."
  },
  {
    question: "Can I use Gigpesa on my phone?",
    answer: "Yes, Gigpesa is mobile-friendly and works seamlessly on both Android and iOS devices. A mobile app is also in development."
  }
];

interface AboutUsProps {
  onRegister: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onRegister }) => {

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-[15px] font-normal text-gray-800">
      {/* Page Heading */}
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-green-700">
        About GigPesa
      </h1>

      {/* Introduction */}
      <p className="mb-6 leading-relaxed">
        GigPesa is Africa’s trusted micro-earning platform, built for anyone who wants to earn online by completing simple tasks, referrals, watching ads, and participating in surveys. We believe in financial inclusion, empowering individuals to generate income flexibly and securely from anywhere.
      </p>

      {/* Timeline */}
      <section className="mb-10">
        <h2 className="text-lg font-medium text-green-700 mb-3">Our Journey</h2>
        <div className="space-y-4 border-l-2 border-green-600 pl-4">
          {timeline.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-3 top-1.5 w-3 h-3 rounded-full bg-green-600" />
              <p className="font-medium text-sm text-green-800">{item.year}</p>
              <p>{item.event}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="mb-12">
        <h2 className="text-lg font-medium text-green-700 mb-3">Frequently Asked Questions</h2>
        <Accordion>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} title={faq.question}>
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Call to Action */}
      <div className="text-center mb-10">
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <h3 className="text-lg text-green-700 font-medium mb-3">
      Ready to Start Earning?
    </h3>
    <p className="mb-4">
      Join thousands of Africans already earning from their phones.
    </p>
    <Button
      onClick={onRegister}
      className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-xl"
    >
      Create Your Free Account
    </Button>
  </motion.div>
</div>


      {/* Footer */}
      <footer className="border-t pt-4 text-center text-sm text-gray-500">
        &copy; 2025 GigPesa. All rights reserved.
      </footer>
    </div>
  );
};

export default AboutUs;
