import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../utils/axiosClient';
import Editor from '@monaco-editor/react';
import { 
  CheckCircle, XCircle, Clock, Cpu, Code, 
  Hourglass, AlertTriangle, Terminal, Eye, 
  X, Activity, Calendar
} from 'lucide-react';

const langMap = {
  'C++': 'cpp',
  'Java': 'java',
  'JavaScript': 'javascript',
};

const getLanguageForMonaco = (lang) => langMap[lang] || 'javascript';

// Logic-preserved helper for status styles
const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted':
      return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <CheckCircle size={14} /> };
    case 'wrong':
      return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: <XCircle size={14} /> };
    case 'error':
      return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <AlertTriangle size={14} /> };
    case 'pending':
      return { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: <Hourglass size={14} /> };
    default:
      return { color: 'text-neutral-400', bg: 'bg-neutral-500/10', border: 'border-neutral-500/20', icon: <Code size={14} /> };
  }
};

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const userId = useSelector((state) => state.auth.user?._id);

  // LOGIC PRESERVED: Fetching sequence
  useEffect(() => {
    if (!userId) {
      setError('User verification required.');
      setLoading(false);
      return;
    }
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}?userId=${userId}`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to sync submission archive.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [problemId, userId]);

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} KB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <LoaderSpinner />;

  return (
    <div className="bg-[#050505] min-h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black tracking-tighter text-white">SUBMISSION_LOGS</h2>
          <p className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest mt-1">Archive_Access_Level: Root</p>
        </div>
        <Activity size={20} className="text-neutral-800" />
      </div>

      {error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-mono">
          <AlertTriangle size={16} className="inline mr-2" /> {error}
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-10 text-center border border-dashed border-white/5 rounded-2xl">
          <Terminal size={40} className="mx-auto text-neutral-800 mb-4" />
          <p className="text-xs font-mono text-neutral-600 uppercase tracking-widest">No local records found for this challenge.</p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                {["Status", "Language", "Runtime", "Memory", "Timestamp", "Action"].map((head) => (
                  <th key={head} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {submissions.map((sub) => {
                const styles = getStatusStyles(sub.status);
                return (
                  <tr key={sub._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${styles.bg} ${styles.text} ${styles.border}`}>
                        {styles.icon} {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-neutral-400">{sub.language}</td>
                    <td className="px-6 py-4 text-xs font-mono text-neutral-300">{sub.runtime}s</td>
                    <td className="px-6 py-4 text-xs font-mono text-neutral-300">{formatMemory(sub.memory)}</td>
                    <td className="px-6 py-4 text-[10px] font-mono text-neutral-600">{formatDate(sub.createdAt)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-cyan-400 hover:bg-neutral-700 transition-all"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: Code View */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedSubmission(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl h-[85vh] bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-neutral-900/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Code size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                      FILE_VIEW: {selectedSubmission.language}
                    </h3>
                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-tighter">
                      Submission_ID: {selectedSubmission._id.slice(-12)}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                  <X size={24} className="text-neutral-500" />
                </button>
              </div>

              {/* Metrics Bar */}
              <div className="px-6 py-4 bg-[#050505] border-b border-white/5 flex gap-6 overflow-x-auto no-scrollbar">
                <Metric label="Result" value={selectedSubmission.status} styles={getStatusStyles(selectedSubmission.status)} />
                <Metric label="Runtime" value={`${selectedSubmission.runtime}s`} icon={<Clock size={12} />} />
                <Metric label="Memory" value={formatMemory(selectedSubmission.memory)} icon={<Cpu size={12} />} />
                <Metric label="Passed" value={`${selectedSubmission.testCasesPassed}/${selectedSubmission.testCasesTotal}`} icon={<CheckCircle size={12} />} />
              </div>

              {/* Code Editor */}
              <div className="flex-1 p-6 bg-[#050505]">
                {selectedSubmission.errorMessage && (
                  <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-mono text-rose-400">
                    <span className="font-bold uppercase tracking-widest block mb-1">Error_Diagnostic:</span>
                    {selectedSubmission.errorMessage}
                  </div>
                )}
                <div className="h-full rounded-2xl border border-white/5 overflow-hidden shadow-inner">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedSubmission.language)}
                    value={selectedSubmission.code}
                    theme="vs-dark"
                    options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14, fontPadding: 20 }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-neutral-900/50 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                >
                  Close_Archive
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-components for matching UI ---

const Metric = ({ label, value, icon, styles }) => (
  <div className="flex flex-col gap-1 min-w-fit">
    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-neutral-600">{label}</span>
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border bg-neutral-900/50 ${styles?.border || 'border-white/5'} ${styles?.text || 'text-neutral-300'}`}>
      {icon || styles?.icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{value}</span>
    </div>
  </div>
);

const LoaderSpinner = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-10 h-10 border-2 border-white/5 border-t-cyan-500 rounded-full mb-4" 
    />
    <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.3em] animate-pulse">Syncing_Records</p>
  </div>
);

export default SubmissionHistory;