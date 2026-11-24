import React from 'react';
import { MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../config/programData.js';

export const FloatingWhatsApp: React.FC = () => {
  const message = encodeURIComponent(
    'Hello VGM Skill Hub, I would like to inquire about the AI-Powered Mobile App Development Internship 2026.'
  );
  const whatsappUrl = `${CONTACT_INFO.whatsappUrl}?text=${message}`;

  return (
    <aside
      aria-label="Contact options"
      className="fixed bottom-6 right-6 z-40 flex items-center group no-print"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with VGM Skill Hub admissions team on WhatsApp"
        className="flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:bg-[#20ba59] hover:shadow-xl hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-200 transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      >
        <MessageCircle className="w-6 h-6 fill-white text-transparent" />
        <span className="text-sm font-semibold whitespace-nowrap pr-1 hidden sm:inline-block">
          WhatsApp Us
        </span>
      </a>
    </aside>
  );
};
