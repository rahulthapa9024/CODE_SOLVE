import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MdCode, 
  MdAutoGraph, 
  MdPsychology, 
  MdSpeed, 
  MdSecurity, 
  MdArrowForward,
  MdTerminal,
  MdLayers
} from 'react-icons/md';
import Footer from "./Footer"; // Assuming App is the Footer based on your import

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative p-8 rounded-2xl border border-white/5 bg-neutral-900/20 hover:bg-neutral-900/40 transition-all duration-300 overflow-hidden"
  >
    {/* Subtle Glow Effect */}
    <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all duration-300">
        <Icon className="text-2xl text-cyan-400 group-hover:text-cyan-300" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      <p className="text-neutral-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
    
    {/* Corner Accent */}
    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
      <MdTerminal className="text-neutral-700 group-hover:text-cyan-500" />
    </div>
  </motion.div>
);

export default function HomeRoot() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                System Online
              </div>

              <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-none mb-6">
                Master the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                  Logic Behind 
                </span> <br />
                the Code.
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10 leading-relaxed font-mono">
                {`> Solve high-impact DSA challenges.`} <br />
                {`> Track your algorithmic evolution.`} <br />
                {`> Engineer your future in the Arena.`}
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-cyan-500/20"
                >
                  Enter the Arena <MdArrowForward size={20} />
                </button>
                
              </div>
            </motion.div>
          </div>

          {/* Decorative Terminal Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 hidden lg:block w-full max-w-lg"
          >
            <div className="w-full bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-neutral-900/50 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                <span className="ml-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">compiler_interface.sh</span>
              </div>
              <div className="p-6 font-mono text-sm space-y-2">
                <p className="text-cyan-400 flex gap-2"><span>$</span> <span>npm install brain-power</span></p>
                <p className="text-neutral-500">Optimizing logic gates...</p>
                <p className="text-purple-400 flex gap-2"><span>$</span> <span>codesolve --deploy --success</span></p>
                <div className="pt-4">
                  <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-full bg-cyan-500"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-neutral-600 pt-4 tracking-tighter">ENVIRONMENT: PRODUCTION_READY</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={MdCode}
            title="Curated Problem Sets"
            description="Hand-picked problems across arrays, graphs, and DP. Organized by topic so your practice is deliberate and measurable."
            delay={0.1}
          />
          <FeatureCard 
            icon={MdAutoGraph}
            title="Comprehensive Tracking"
            description="Track solved problems, accuracy, and streaks in a single high-performance dashboard to guide your study plan."
            delay={0.2}
          />
       
          <FeatureCard 
            icon={MdSpeed}
            title="Online Compilation"
            description="Run and Compile your Code inside and get Live debugging and Time and Space Analysis."
            delay={0.4}
          />
        </div>
      </section>

      {/* Footer Branding */}
      <div className="border-t border-white/5 bg-[#050505]">
        <Footer />
      </div>
    </div>
  );
}