import React from "react";
import { motion } from "framer-motion";

export default function ShimmerEffect() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* The Cyber Loader */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          className="relative z-10"
        >
          <defs>
            <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer Rotating Ring */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="2"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#cyberGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="70 180"
            filter="url(#neonGlow)"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner Counter-Rotating Ring */}
          <motion.circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="url(#cyberGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="40 120"
            opacity="0.5"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {/* Center Hardware Icon (Optional Decor) */}
        <div className="absolute top-[42px] flex items-center justify-center">
           <motion.div 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" 
           />
        </div>

        {/* Status Text - Monospaced Terminal Style */}
        <div className="mt-12 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neutral-400">
              Initializing Arena
            </p>
          </motion.div>
          
          <motion.p 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, times: [0, 0.5, 1] }}
            className="text-[8px] font-mono text-neutral-600 mt-2 tracking-tighter"
          >
            {`> SECURE_CONNECTION_ESTABLISHED`} <br />
            {`> SYNCING_DETAILS...`}
          </motion.p>
        </div>
      </div>

      {/* Decorative Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}