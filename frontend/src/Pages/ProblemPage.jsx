import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { 
  CheckCircle, XCircle, Clock, Cpu, Play, Send, 
  Loader2, BookOpen, MessageSquareText, History, 
  Lightbulb, Code, Terminal, ChevronRight, Activity 
} from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // LOGIC PRESERVED: Problem Fetching
  useEffect(() => {
    const fetchProblem = async () => {
      setIsFetching(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const problemData = response.data;
        const initialCode = problemData.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || '';
        setProblem(problemData);
        setCode(initialCode);
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  // LOGIC PRESERVED: Code Initialization
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => setCode(value || '');
  const handleEditorDidMount = (editor) => (editorRef.current = editor);
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setActiveRightTab('code'); 
  };
  
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [pathname]);

  // LOGIC PRESERVED: Run Handler
  const handleRun = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
      setRunResult(response.data);
    } catch (error) {
      setRunResult({ success: false, error: 'Execution failed.' });
    } finally {
      setIsProcessing(false);
      setActiveRightTab('testcase'); 
    }
  };

  // LOGIC PRESERVED: Submit Handler
  const handleSubmitCode = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
      setSubmitResult(response.data);
    } catch (error) {
      setSubmitResult({ accepted: false, error: 'Submission failed.' });
    } finally {
      setIsProcessing(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => ({ javascript: 'javascript', java: 'java', cpp: 'cpp' }[lang] || 'javascript');

  const getDifficultyStyles = (difficulty) => {
    return {
      easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      hard: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    }[difficulty] || 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20';
  };

  if (isFetching) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#050505]">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
          <div className="absolute inset-0 blur-xl bg-cyan-500/20 animate-pulse" />
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400">Loading_Arena_Modules</p>
      </div>
    );
  }

  const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 py-3 px-4 text-[10px] font-bold uppercase tracking-widest transition-all relative
        ${activeTab === id 
          ? 'text-cyan-400' 
          : 'text-neutral-500 hover:text-neutral-300'}`}
    >
      {Icon && <Icon size={14} className={activeTab === id ? 'text-cyan-400' : 'text-neutral-600'} />}
      {label}
      {activeTab === id && (
        <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600" />
      )}
    </button>
  );

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="flex-1 flex min-h-0 relative z-10">
        
        {/* LEFT PANEL: CONTENT */}
        <div className="w-1/2 flex flex-col border-r border-white/5 bg-neutral-900/10 backdrop-blur-xl">
          <div className="flex items-center bg-[#0a0a0a] border-b border-white/5 px-2">
            <TabButton id="description" label="Problem" icon={BookOpen} activeTab={activeLeftTab} setActiveTab={setActiveLeftTab} />
            <TabButton id="Video Solution" label="Editorial" icon={Lightbulb} activeTab={activeLeftTab} setActiveTab={setActiveLeftTab} />
            <TabButton id="solutions" label="Solutions" icon={Code} activeTab={activeLeftTab} setActiveTab={setActiveLeftTab} />
            <TabButton id="submissions" label="Submissions" icon={History} activeTab={activeLeftTab} setActiveTab={setActiveLeftTab} />
            <TabButton id="chatAI" label="Chat AI" icon={MessageSquareText} activeTab={activeLeftTab} setActiveTab={setActiveLeftTab} />
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {problem && (
              <AnimatePresence mode="wait">
                {activeLeftTab === 'description' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center gap-4 mb-8">
                      <h1 className="text-4xl font-black tracking-tighter">{problem.title}</h1>
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${getDifficultyStyles(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <div className="prose prose-invert prose-cyan max-w-none text-neutral-400 leading-relaxed font-medium" 
                         dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br />') }} />
                    
                    <div className="mt-12 space-y-8">
                      <div className="flex items-center gap-2">
                         <Terminal size={18} className="text-cyan-500" />
                         <h3 className="text-sm font-bold uppercase tracking-widest text-white">Example_Test_Cases</h3>
                      </div>
                      
                      <div className="grid gap-6">
                        {problem.visibleTestCases.map((example, index) => (
                          <div key={index} className="bg-neutral-900/40 border border-white/5 rounded-2xl p-6">
                            <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Case_{index + 1}
                            </h4>
                            <div className="space-y-4 font-mono text-sm">
                              <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                <p className="text-cyan-500 text-xs mb-1 uppercase font-bold tracking-tighter">Input</p>
                                <pre className="text-neutral-300 whitespace-pre-wrap">{example.input}</pre>
                              </div>
                              <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                <p className="text-purple-400 text-xs mb-1 uppercase font-bold tracking-tighter">Output</p>
                                <pre className="text-neutral-300 whitespace-pre-wrap">{example.output}</pre>
                              </div>
                              {example.explanation && (
                                <p className="text-xs text-neutral-500 italic mt-2 opacity-70">
                                  {`// Explanation: ${example.explanation}`}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* Other Left Tabs: Logic remains identical */}
                {activeLeftTab === 'editorial' && <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />}
                {activeLeftTab === 'solutions' && (
                   <div className="space-y-6">
                     {problem.referenceSolution?.map((sol, i) => (
                       <div key={i} className="border border-white/5 rounded-2xl overflow-hidden bg-[#0a0a0a]">
                         <div className="px-4 py-2 bg-neutral-900 border-b border-white/5 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                            Reference_Solution / {sol.language}
                         </div>
                         <Editor height="300px" language={getLanguageForMonaco(sol.language.toLowerCase())} value={sol.completeCode} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false } }} />
                       </div>
                     ))}
                   </div>
                )}
                {activeLeftTab === 'submissions' && <SubmissionHistory problemId={problemId} />}
                {activeLeftTab === 'chatAI' && <ChatAi problem={problem} />}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: EDITOR & CONSOLE */}
        <div className="w-1/2 flex flex-col bg-[#050505]">
          <div className="flex items-center justify-between bg-[#0a0a0a] border-b border-white/5 px-2">
            <div className="flex">
              <TabButton id="code" label="Editor" icon={Code} activeTab={activeRightTab} setActiveTab={setActiveRightTab} />
              <TabButton id="testcase" label="Console" icon={Activity} activeTab={activeRightTab} setActiveTab={setActiveRightTab} />
            </div>
            
            {/* Action Bar */}
            <div className="flex items-center gap-3 pr-4">
              <div className="flex bg-neutral-900 p-1 rounded-lg border border-white/5 mr-2">
                {['javascript', 'java', 'cpp'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded-md transition-all 
                    ${selectedLanguage === lang ? 'bg-cyan-500/10 text-cyan-400' : 'text-neutral-600 hover:text-neutral-400'}`}
                  >
                    {langMap[lang]}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleRun} 
                disabled={isProcessing}
                className="p-2 rounded-lg bg-neutral-800 text-cyan-400 hover:bg-neutral-700 transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
              </button>
              
              <button 
                onClick={handleSubmitCode} 
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
              >
                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Submit
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {activeRightTab === 'code' && (
              <div className="flex-1 min-h-0 p-4">
                <div className="h-full rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      fontFamily: "'Fira Code', monospace",
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 20 },
                      renderLineHighlight: 'all',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Run Output */}
            {activeRightTab === 'testcase' && (
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6 flex items-center gap-2">
                  <Activity size={14} /> Execution_Log
                </h3>
                {runResult ? (
                  <div className={`p-6 rounded-2xl border transition-all 
                      ${runResult.success ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                    {runResult.success ? (
                      <>
                        <div className="flex items-center gap-3 text-emerald-400 font-bold text-xl mb-4">
                          <CheckCircle size={22} /> System Status: Success
                        </div>
                        <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                          <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                            <span className="text-neutral-500 block mb-1 tracking-widest uppercase">CPU_Runtime</span>
                            <span className="text-white text-base">{runResult.runtime}s</span>
                          </div>
                          <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                            <span className="text-neutral-500 block mb-1 tracking-widest uppercase">Mem_Load</span>
                            <span className="text-white text-base">{runResult.memory} KB</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 text-rose-400 font-bold text-lg"><XCircle size={20} /> Logic_Error</div>
                         <pre className="mt-4 p-4 bg-black/40 rounded-xl font-mono text-xs text-rose-300 whitespace-pre-wrap border border-rose-500/20">
                           {runResult.error || 'Diagnostic: One or more internal tests failed.'}
                         </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-600 border border-dashed border-white/5 rounded-3xl">
                    <Terminal size={40} className="mb-4 opacity-20" />
                    <p className="text-[10px] uppercase tracking-widest">Awaiting execution command...</p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Results */}
            {activeRightTab === 'result' && (
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6 flex items-center gap-2">
                   <Activity size={14} /> Submission_Final_Report
                </h3>
                {submitResult ? (
                  <div className={`p-8 rounded-3xl border transition-all shadow-2xl
                      ${submitResult.accepted ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                    {submitResult.accepted ? (
                      <>
                        <div className="flex items-center gap-4 text-emerald-400 font-black text-3xl mb-2">
                          <CheckCircle size={32} /> ACCEPTED
                        </div>
                        <p className="text-neutral-400 text-sm mb-8 font-mono">Verification complete. Security clearance granted.</p>
                        
                        <div className="grid grid-cols-3 gap-4 font-mono text-[10px]">
                           <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                              <span className="block text-neutral-600 mb-1 uppercase">Cases</span>
                              <span className="text-emerald-400 text-lg font-bold">{submitResult.passedTestCases}/{submitResult.totalTestCases}</span>
                           </div>
                           <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                              <span className="block text-neutral-600 mb-1 uppercase">Time</span>
                              <span className="text-white text-lg font-bold">{submitResult.runtime}s</span>
                           </div>
                           <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                              <span className="block text-neutral-600 mb-1 uppercase">Mem</span>
                              <span className="text-white text-lg font-bold">{submitResult.memory}kb</span>
                           </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 text-rose-400 font-black text-3xl">
                          <XCircle size={32} /> REJECTED
                        </div>
                        <p className="text-rose-300/60 font-mono text-sm uppercase tracking-tighter">{submitResult.error}</p>
                        <div className="mt-4 p-5 bg-black/40 rounded-2xl border border-rose-500/10 font-mono text-xs text-neutral-400">
                          <p className="mb-2"><span className="text-rose-400">FAILED_CASE:</span> {submitResult.passedTestCases + 1}</p>
                          <p><span className="text-emerald-500">PASSED_TOTAL:</span> {submitResult.passedTestCases} / {submitResult.totalTestCases}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-600 border border-dashed border-white/5 rounded-3xl">
                    <Activity size={40} className="mb-4 opacity-20" />
                    <p className="text-[10px] uppercase tracking-widest">Awaiting system submission...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;