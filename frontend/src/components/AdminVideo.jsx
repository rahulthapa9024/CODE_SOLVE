import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { NavLink } from 'react-router-dom';
import { 
  Video, Trash2, Upload, AlertTriangle, 
  Database, Terminal, Cloud, CloudOff,
  Eye, EyeOff, RefreshCw, Shield, 
  CheckCircle, XCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      setDeletingId(id);
      await axiosClient.delete(`/video/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      setDeletingId(null);
    }
  };

  const getDifficultyStyles = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'medium':
        return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      case 'hard':
        return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
      default:
        return { text: 'text-neutral-400', bg: 'bg-neutral-500/10', border: 'border-neutral-500/20' };
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-cyan-500/30 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-8 h-8 text-cyan-500 animate-pulse" />
          </div>
        </div>
        <div className="mt-8 text-center">
          <div className="text-sm font-mono uppercase tracking-widest text-neutral-600 mb-2">
            Loading Video Database
          </div>
          <div className="text-xs text-neutral-700 font-mono">
            Fetching problem records...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Video className="text-cyan-500" size={20} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neutral-500">
              Video_Management_System
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Content</span>
              </h1>
              <p className="mt-3 text-neutral-400 font-mono text-sm max-w-2xl">
                Manage video solutions for coding problems. Upload new videos or delete existing ones.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchProblems}
                className="px-4 py-2 rounded-xl bg-neutral-900/50 border border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-300 flex items-center gap-2 text-sm font-mono"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
              <div className="px-4 py-2 bg-neutral-900/50 border border-white/5 rounded-xl">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono text-neutral-400">
                    {problems.length} Problems
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-10 p-6 bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20 rounded-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    System Error
                  </h3>
                  <p className="text-sm text-neutral-400 font-mono">
                    {error.response?.data?.error || error}
                  </p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Problems Grid */}
        <div className="space-y-4">
          {problems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 text-center bg-neutral-900/10 border border-dashed border-white/5 rounded-3xl"
            >
              <CloudOff className="mx-auto text-neutral-800 mb-6" size={64} />
              <h3 className="text-xl font-bold text-white mb-2">No Problems Found</h3>
              <p className="text-neutral-500 font-mono text-xs mb-8">
                The problem database appears to be empty or no data was returned.
              </p>
              <button 
                onClick={fetchProblems}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={14} />
                Retry Database Connection
              </button>
            </motion.div>
          ) : (
            problems.map((problem, index) => {
              const styles = getDifficultyStyles(problem.difficulty);
              
              return (
                <motion.div
                  key={problem._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-neutral-900/20 border border-white/5 rounded-2xl hover:bg-neutral-900/40 transition-all duration-300 overflow-hidden group"
                >
                  {/* Left Border Accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {problem.title || 'Untitled Problem'}
                          </h2>
                          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${styles.bg} ${styles.text} ${styles.border}`}>
                            {problem.difficulty || 'Unknown'}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {problem.tags && (
                            <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-neutral-500 text-[10px] font-mono group-hover:text-neutral-300 transition-colors">
                              #{problem.tags}
                            </div>
                          )}
                          <div className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono">
                            <span className="flex items-center gap-1">
                              <Video size={10} /> VIDEO
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-neutral-500 font-mono">
                          ID: {problem._id?.slice(-8) || 'Unknown'}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                          <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-tighter">Video Status</p>
                          <p className="text-xs font-bold text-emerald-400">
                            {deletingId === problem._id ? 'DELETING...' : 'MANAGE_VIDEO'}
                          </p>
                        </div>
                        
                        <div className="flex gap-3">
                          <NavLink
                            to={`/admin/upload/${problem._id}`}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300 active:scale-95 flex items-center gap-2 text-sm"
                          >
                            <Upload size={16} />
                            Upload
                          </NavLink>
                          
                          <button
                            onClick={() => handleDelete(problem._id)}
                            disabled={deletingId === problem._id}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                          >
                            {deletingId === problem._id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 size={16} />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="p-6 bg-neutral-900/20 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-cyan-400" />
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                Total Problems
              </div>
            </div>
            <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {problems.length}
            </div>
          </div>
          
          <div className="p-6 bg-neutral-900/20 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Cloud className="w-5 h-5 text-emerald-400" />
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                Video Storage
              </div>
            </div>
            <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Active
            </div>
          </div>
          
          <div className="p-6 bg-neutral-900/20 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                Admin Access
              </div>
            </div>
            <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Enabled
            </div>
          </div>
          
          <div className="p-6 bg-neutral-900/20 border border-white/5 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-5 h-5 text-amber-400" />
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                Last Updated
              </div>
            </div>
            <div className="text-sm text-neutral-400 font-mono">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </motion.div>

        {/* Warning Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-xl flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                Video Management Notice
              </h3>
              <p className="text-sm text-neutral-400 font-mono">
                Deleting a video will permanently remove it from the system. This action cannot be undone. 
                Ensure you have backups if needed. Uploading new videos will overwrite existing ones for the same problem.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 pt-8 border-t border-white/5 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-neutral-600" />
            <span className="text-xs font-mono text-neutral-700">
              VIDEO_MANAGEMENT • v2.5.1 • SECURE_CONNECTION
            </span>
          </div>
          <p className="text-xs text-neutral-600 font-mono">
            © {new Date().getFullYear()} Solve Platform — Video content management system.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminVideo;