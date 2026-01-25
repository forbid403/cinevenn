import React from 'react';
import { Clapperboard } from 'lucide-react';

const PRIVACY_POLICY_LINK = 'https://superb-goose-420.notion.site/Privacy-Policy-2eda16ed7abb801c8895e3353c75e13e';
const TERMS_OF_SERVICE_LINK = 'https://superb-goose-420.notion.site/Terms-of-Services-2eda16ed7abb80d7966fe4599253dd35';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-warm-gray-200 py-12 mt-28 bg-warm-black relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-gold-600/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <Clapperboard size={28} />
            </div>
            <span className="font-playfair font-black text-3xl tracking-tight text-champagne">CINEVENN</span>
          </div>
          <p className="text-champagne/60 text-xl font-lora leading-relaxed max-w-lg">
            © 2026 CINE VENN. All rights reserved.
          </p>
        </div>
        <div className="space-y-6">
          <h5 className="text-champagne font-montserrat font-bold uppercase tracking-[0.2em] text-xs">Platform</h5>
          <ul className="space-y-4 text-champagne/60 font-lora text-sm">
            <li><a href="mailto:sonia.bae.tech@gmail.com" className="hover:text-gold-600 transition-colors">Contact Us</a></li>
            <li><a href={PRIVACY_POLICY_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors">Privacy Policy</a></li>
            <li><a href={TERMS_OF_SERVICE_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
