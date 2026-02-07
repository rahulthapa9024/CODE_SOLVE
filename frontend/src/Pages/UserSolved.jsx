import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../utils/axiosClient";
import { 
  CheckCircle2, 
  Terminal, 
  ArrowRight, 
  SearchX, 
  Award, 
  History, 
  Cpu
} from "lucide-react";

// Helper for consistent high-tech difficulty labels
function getDifficultyStyles(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    case "medium":
      return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    case "hard":
      return { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" };
    default:
      return { text: "text-neutral-400", bg: "bg-neutral-500/10", border: "border-neutral-500/20" };
  }
}

export default function Solved() {
  const { user } = useSelector((state) => state.auth);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    const fetchSolved = async () => {
      try {
        const { data } = await axiosClient.get("/user/userSolvedProblems");
        if (data.success) {
          setSolvedProblems(data.problemSolved || []);
        }
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };
    if (user) fetchSolved();
  }, [user]);

  const totalPages = Math.ceil(solvedProblems.length / itemsPerPage);
  const pagedSolved = solvedProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 pb-20 overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-12">
        
        {/* Header Section */}
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center gap-3 mb-4"
          >
            <Award className="text-emerald-500" size={20} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neutral-500">
              User_Achievement_Archive
            </span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            Solved <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">History</span>
            <span className="ml-4 text-lg font-mono text-neutral-700 tracking-normal">[{solvedProblems.length}]</span>
          </h1>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {pagedSolved.length === 0 ? (
              <EmptyState />
            ) : (
              pagedSolved.map((problem, i) => (
                <SolvedProblemCard 
                  key={problem._id} 
                  index={i}
                  problem={problem} 
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Pod */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-16">
            <PaginationButton 
              label="Prev" 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(currentPage - 1)} 
            />
            <span className="font-mono text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
              Record <span className="text-white">{currentPage}</span> / {totalPages}
            </span>
            <PaginationButton 
              label="Next" 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(currentPage + 1)} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SolvedProblemCard({ problem, index }) {
  const styles = getDifficultyStyles(problem.difficulty);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <NavLink
        to={`/problem/${problem._id}`}
        className="group block relative p-6 bg-neutral-900/20 border border-white/5 rounded-2xl hover:bg-neutral-900/40 hover:border-white/10 transition-all duration-300 overflow-hidden"
      >
        {/* Left Side Success Accent */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-cyan-500" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                {problem.title}
              </h2>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                <CheckCircle2 size={10} /> Verified
              </div>
            </div>
            
            <p className="text-neutral-500 text-sm line-clamp-1 mb-4 font-medium max-w-2xl">
              {problem.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${styles.bg} ${styles.text} ${styles.border}`}>
                {problem.difficulty}
              </span>
              {(problem.tags || []).map(tag => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-neutral-500 text-[10px] font-mono group-hover:text-neutral-300 transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-tighter">Status_Report</p>
              <p className="text-xs font-bold text-emerald-500/80 uppercase">COMPLETED</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </NavLink>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center bg-neutral-900/10 border border-dashed border-white/5 rounded-3xl">
      <div className="relative inline-block mb-6">
        <History className="text-neutral-800" size={64} />
        <Cpu className="absolute -bottom-2 -right-2 text-cyan-500/20" size={32} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Archive Empty</h3>
      <p className="text-neutral-500 font-mono text-xs mb-8 max-w-xs mx-auto">
        Your verification records are empty. Complete challenges in the Arena to populate your solved history.
      </p>
      <NavLink 
        to="/problems" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-white"
      >
        <Terminal size={14} /> Enter Arena Challenges
      </NavLink>
    </div>
  );
}

function PaginationButton({ label, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] border transition-all
        ${disabled 
          ? "border-white/5 text-neutral-700 cursor-not-allowed" 
          : "border-white/10 text-white hover:bg-emerald-500 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"}`}
    >
      {label}
    </button>
  );
}