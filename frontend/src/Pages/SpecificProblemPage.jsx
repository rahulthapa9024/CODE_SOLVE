import { useState, useEffect } from "react";
import { NavLink, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "../utils/axiosClient";
import { 
  CheckCircle2, 
  Filter, 
  SearchX, 
  Tag as TagIcon, 
  Terminal, 
  ArrowRight, 
  Activity,
  Cpu
} from "lucide-react";

// Helper for high-contrast high-tech difficulty labels (Consistent with Problems page)
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

export default function TagProblemsPage() {
  const { tag } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({ difficulty: "all", status: "all" });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    async function fetchProblems() {
      if (!tag) return;
      setLoading(true);
      try {
        const res = await axiosClient.get(`/problem/byTag/${tag}`);
        setProblems(res.data.map(p => ({ ...p, tags: p.tags || [] })));
      } catch {
        setProblems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, [tag, pathname]);

  useEffect(() => {
    async function fetchSolvedProblems() {
      if (!user?._id) return;
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser", {
          params: { userId: user._id },
        });
        setSolvedProblems(Array.isArray(data) ? data : []);
      } catch {}
    }
    if (user) fetchSolvedProblems();
  }, [user]);

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch = filters.difficulty === "all" || problem.difficulty === filters.difficulty;
    const statusMatch = filters.status === "all" ? true 
      : filters.status === "solved" ? solvedProblems.some((sp) => sp._id === problem._id)
      : !solvedProblems.some((sp) => sp._id === problem._id);
    return difficultyMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const pagedProblems = filteredProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 pb-20 overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-12">
        {/* Header Section */}
        <div className="mb-12">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-4">
            <TagIcon className="text-cyan-500" size={20} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neutral-500">System_Tag_Filter</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            Arena: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase">#{tag?.replace(/-/g, '_')}</span>
          </h1>
        </div>

        {/* Filters Pod */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 p-4 bg-neutral-900/20 border border-white/5 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 text-cyan-500/50">
            <Filter size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Logic Filters</span>
          </div>
          <FilterSelect value={filters.status} onChange={(v) => { setFilters({ ...filters, status: v }); setCurrentPage(1); }} 
            options={[{ value: "all", label: "Status: All" }, { value: "unsolved", label: "Unsolved" }, { value: "solved", label: "Solved" }]} />
          <FilterSelect value={filters.difficulty} onChange={(v) => { setFilters({ ...filters, difficulty: v }); setCurrentPage(1); }} 
            options={[{ value: "all", label: "Diff: All" }, { value: "easy", label: "Easy" }, { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" }]} />
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {pagedProblems.length === 0 ? (
              <EmptyState tag={tag} />
            ) : (
              pagedProblems.map((problem, i) => (
                <ProblemCard 
                  key={problem._id} 
                  index={i}
                  problem={problem} 
                  isSolved={solvedProblems.some(sp => sp._id === problem._id)} 
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Pod */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-16">
            <PaginationButton label="Prev" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
            <span className="font-mono text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
              Block <span className="text-white">{currentPage}</span> / {totalPages}
            </span>
            <PaginationButton label="Next" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} />
          </div>
        )}
      </div>
    </div>
  );
}

// --- Internal Components ---

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-2 border-white/5 border-t-cyan-500 rounded-full mb-4" />
      <span className="text-cyan-500 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing Arena Data</span>
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#0a0a0a] border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-neutral-400 outline-none focus:border-cyan-500/50 transition-all cursor-pointer hover:bg-neutral-800"
    >
      {options.map(o => <option value={o.value} key={o.value}>{o.label}</option>)}
    </select>
  );
}

function ProblemCard({ problem, isSolved, index }) {
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
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{problem.title}</h2>
              {isSolved && <CheckCircle2 size={18} className="text-emerald-500" />}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${styles.bg} ${styles.text} ${styles.border}`}>
                {problem.difficulty}
              </span>
              {(problem.tags || []).slice(0, 3).map(tag => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-neutral-500 text-[10px] font-mono group-hover:text-neutral-300 transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all">
            <ArrowRight size={18} />
          </div>
        </div>
      </NavLink>
    </motion.div>
  );
}

function EmptyState({ tag }) {
  return (
    <div className="py-20 text-center bg-neutral-900/10 border border-dashed border-white/5 rounded-3xl">
      <div className="relative inline-block mb-6">
        <SearchX className="text-neutral-800" size={64} />
        <Cpu className="absolute -bottom-2 -right-2 text-cyan-500/20" size={32} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Segment Empty</h3>
      <p className="text-neutral-500 font-mono text-xs mb-8 max-w-xs mx-auto">
        No problems found for tag <span className="text-cyan-400">#{tag}</span> under the current system filters.
      </p>
      <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-white">
        Reset System Filters
      </button>
    </div>
  );
}

function PaginationButton({ label, disabled, onClick }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-[0.2em] border transition-all
        ${disabled ? "border-white/5 text-neutral-700 cursor-not-allowed" : "border-white/10 text-white hover:bg-cyan-500 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95"}`}
    >
      {label}
    </button>
  );
}