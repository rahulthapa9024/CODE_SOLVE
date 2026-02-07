import React from "react";
import { motion } from "framer-motion";
import {
  FaGoogle, FaAmazon, FaMicrosoft, FaApple, 
  FaUber, 
} from "react-icons/fa";
import {
  SiMeta, SiNetflix, SiGoldmansachs, SiCisco,
  SiWalmart, SiFlipkart, SiSwiggy, SiZomato, SiAdobe
} from "react-icons/si";
import {  MdVerified } from "react-icons/md";

const companies = [
  { name: "Google", icon: <FaGoogle />, color: "#4285F4" },
  { name: "Amazon", icon: <FaAmazon />, color: "#FF9900" },
  { name: "Microsoft", icon: <FaMicrosoft />, color: "#F25022" },
  { name: "Apple", icon: <FaApple />, color: "#A3AAAE" },
  { name: "Meta", icon: <SiMeta />, color: "#1877F2" },
  { name: "Netflix", icon: <SiNetflix />, color: "#E50914" },
  { name: "Uber", icon: <FaUber />, color: "#FFFFFF" },
  { name: "Adobe", icon: <SiAdobe />, color: "#FF0000" },
  { name: "Goldman Sachs", icon: <SiGoldmansachs />, color: "#1A73E8" },
  { name: "Cisco", icon: <SiCisco />, color: "#1BA0D7" },
  { name: "Walmart", icon: <SiWalmart />, color: "#0071CE" },
  { name: "Flipkart", icon: <SiFlipkart />, color: "#2874F0" },
  { name: "Swiggy", icon: <SiSwiggy />, color: "#FC8019" },
  { name: "Zomato", icon: <SiZomato />, color: "#E23744" },
];

// Double the array for seamless infinite scroll
const allCompanies = [...companies, ...companies];

export default function CompaniesFooter() {
  return (
    <div className="w-full bg-[#050505] border-t border-white/5 relative overflow-hidden">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Top Section: Heading */}
      <div className="max-w-7xl mx-auto pt-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10"
        >
          <MdVerified className="text-cyan-400 text-sm" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Targeted Tech Companies
          </span>
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Reduce The Gap To <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Excellence.</span>
        </h2>
        <p className="text-neutral-500 font-mono text-sm">
          Our curriculum is engineered around the standards of:
        </p>
      </div>

      {/* Middle Section: Infinite Carousel */}
      <div className="relative py-16 group">
        {/* Gradient Fades for the edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />

        <div className="flex overflow-hidden">
          <div className="flex animate-infinite-scroll gap-8 items-center">
            {allCompanies.map((company, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center min-w-[140px] md:min-w-[180px] group/item"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-neutral-900/50 border border-white/5 flex items-center justify-center transition-all duration-300 group-hover/item:border-cyan-500/50 group-hover/item:bg-neutral-800 group-hover/item:-translate-y-2 group-hover/item:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                  <span 
                    className="text-3xl md:text-4xl transition-all duration-300"
                    style={{ color: company.color }}
                  >
                    {company.icon}
                  </span>
                </div>
                <span className="mt-4 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 group-hover/item:text-cyan-400 transition-colors">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Minimal Footer */}
      <div className="w-full border-t border-white/5 bg-[#050505] flex justify-center items-center py-3">
  <div className="text-[10px] font-mono text-neutral-500 text-center">
    © {new Date().getFullYear()} CODESOLVE | ALL RIGHTS RESERVED
  </div>
</div>
    </div>
  );
}