import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Loader2, AlertTriangle, 
  Terminal, Activity, RefreshCw, 
  SearchX, ShieldAlert, Hash
} from 'lucide-react';

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // Stores problem object to delete

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Critical: Failed to interface with problem_database');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axiosClient.delete(`/problem/delete/${deleteTarget._id}`);
      setProblems(problems.filter(p => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError('Termination protocol failed. Try again.');
    }
  };

  // Helper for difficulty styling (Matching Problems Page)
  const getDiffStyle = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      case "medium": return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      case "hard": return "text-rose-400 border-rose-500/20 bg-rose-500/5";
      default: return "text-neutral-400 border-neutral-500/20 bg-neutral-500/5";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-500 animate-pulse">Synchronizing_Database...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-rose-500/30 pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-4">
              <Terminal className="text-rose-500" size={20} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neutral-500">Privileged_Access_Required</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              System <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">Purge</span>
              <span className="ml-4 text-lg font-mono text-neutral-700 tracking-normal">[{problems.length}]</span>
            </h1>
          </div>
          
          <button 
            onClick={fetchProblems}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95"
          >
            <RefreshCw size={14} /> Refresh_Stream
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-400">
            <AlertTriangle size={20} />
            <span className="font-mono text-xs font-bold uppercase tracking-wider">{error}</span>
          </div>
        )}

        {/* Problems Data Container */}
        <div className="bg-neutral-900/20 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
          {problems.length === 0 ? (
            <div className="py-20 text-center">
              <SearchX className="mx-auto text-neutral-800 mb-4" size={48} />
              <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">No target records found in sector.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-6 py-4 font-mono text-[10px] font-black uppercase tracking-widest text-neutral-500 w-16">#</th>
                    <th className="px-6 py-4 font-mono text-[10px] font-black uppercase tracking-widest text-neutral-500">System_Entry_Title</th>
                    <th className="px-6 py-4 font-mono text-[10px] font-black uppercase tracking-widest text-neutral-500">Classification</th>
                    <th className="px-6 py-4 font-mono text-[10px] font-black uppercase tracking-widest text-neutral-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {problems.map((problem, i) => (
                    <motion.tr 
                      key={problem._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-5 font-mono text-xs text-neutral-600">{(i + 1).toString().padStart(2, '0')}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">{problem.title}</span>
                          <span className="text-[9px] font-mono text-neutral-600 mt-1 uppercase">ID: {problem._id.slice(-8)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${getDiffStyle(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button 
                          onClick={() => setDeleteTarget(problem)}
                          className="p-2.5 rounded-xl bg-neutral-800 border border-white/5 text-neutral-400 hover:bg-rose-600 hover:text-white hover:border-rose-500 transition-all duration-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setDeleteTarget(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-rose-500/30 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(225,29,72,0.15)]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
                  <ShieldAlert className="text-rose-500" size={40} />
                </div>
                
                <h3 className="text-2xl font-black tracking-tighter mb-2">Delete Problem?</h3>
                <p className="text-neutral-500 font-mono text-xs uppercase tracking-wider mb-6">
                  Warning: You are about to permanently erase <br/>
                  <span className="text-white bg-white/5 px-2 py-1 rounded mt-2 block italic">"{deleteTarget.title}"</span>
                </p>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <button 
                    onClick={() => setDeleteTarget(null)}
                    className="px-6 py-4 rounded-2xl bg-neutral-900 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition"
                  >
                    Abort_Process
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="px-6 py-4 rounded-2xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition shadow-[0_0_20px_rgba(225,29,72,0.4)]"
                  >
                    Confirm_Erase
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDelete;