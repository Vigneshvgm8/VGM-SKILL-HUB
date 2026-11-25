import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../config/programData.js';
import { LusionMagnetic } from './LusionMotionPrimitives.js';

export const FloatingWhatsApp: React.FC = () => {
  const message = encodeURIComponent(
    'Hello VGM Skill Hub, I would like to inquire about the AI-Powered Mobile App Development Internship 2026.'
  );
  const whatsappUrl = `${CONTACT_INFO.whatsappUrl}?text=${message}`;

  return (
    <motion.aside
      initial={{ opacity: 0, scale: 0.7, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Contact options"
      className="fixed bottom-6 right-6 z-40 flex items-center group no-print"
    >
      <LusionMagnetic strength={8}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with VGM Skill Hub admissions team on WhatsApp"
          className="relative flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-[0_10px_28px_rgba(37,211,102,0.45)] hover:bg-[#20ba59] hover:shadow-[0_14px_34px_rgba(37,211,102,0.65)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
          <MessageCircle className="relative z-10 w-6 h-6 fill-white text-transparent group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative z-10 text-sm font-semibold whitespace-nowrap pr-1 hidden sm:inline-block">
            WhatsApp Us
          </span>
        </a>
      </LusionMagnetic>
    </motion.aside>
  );
};
