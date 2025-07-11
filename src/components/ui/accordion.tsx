import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AccordionItemProps = {
  title: string;
  children: ReactNode;
};

export const Accordion = ({ children }: { children: ReactNode }) => {
  return <div className="space-y-2">{children}</div>;
};

export const AccordionItem = ({ title, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-md overflow-hidden">
      <button
        className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-sm font-medium text-gray-800">{title}</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-3 text-[13px] text-gray-700">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
