import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Send, Cpu, Bot, User as UserIcon, Terminal, Activity, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock API preserved exactly as provided
const axiosClient = {
    post: async (url, data) => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const userText = data.messages.at(-1).parts[0].text;
        let responseText = `I analyzed your request about "${userText}". This problem, "${data.title}", focuses on fundamental data structures. The current starter code is ready for you to implement the core logic. Do you want me to explain complexity, suggest optimization, or provide a hint?`;

        if (userText.toLowerCase().includes('time complexity')) {
            responseText = "For an optimal solution, the target time complexity should ideally be **O(n)** or **O(n log n)**. The brute force approach would be O(n²), which is likely too slow for large inputs.";
        } else if (userText.toLowerCase().includes('hint')) {
            responseText = `Think about using a **Hash Map** (or Dictionary) to store intermediate results. This can often reduce complexity from quadratic to linear.`;
        }
        return { data: { message: responseText } };
    }
}

const mockProblem = {
  title: "Longest Substring Without Repeating Characters",
  description: "Given a string s, find the length of the longest substring without repeating characters.",
  visibleTestCases: [{ input: "abcabcbb", output: 3 }],
  startCode: "function solve(s) {\n  // Your code here\n}"
};

function ChatAi({ problem = mockProblem }) {
  const [messages, setMessages] = useState([
    { role: "model", parts: [{ text: `System Initialized. I am your neural assistant for: **${problem.title}**. Ask me for logic hints, complexity analysis, or debugging paths.` }] },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data) => {
    const userMessage = data.message;
    setIsLoading(true);
    setMessages(prev => [...prev, { role: "user", parts: [{ text: userMessage }] }]);
    reset();

    try {
      const chatHistory = [...messages, { role: "user", parts: [{ text: userMessage }] }];
      const response = await axiosClient.post("/ai/chat", {
        messages: chatHistory,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
      });

      setMessages(prev => [...prev, { role: "model", parts: [{ text: response.data.message }] }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "model", parts: [{ text: "⚠️ **SYSTEM_ERROR:** Neural link interrupted. Please retry sequence." }] }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-cyan-400 font-black tracking-tight">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-[#050505] border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[60px] pointer-events-none" />

      {/* HEADER: Terminal Access Style */}
      <div className="p-4 bg-neutral-900/50 border-b border-white/5 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Cpu className="text-cyan-400 w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-white">Neural_Assistant_v4</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-tighter">Core_Link_Active</span>
            </div>
          </div>
        </div>
        <Terminal size={16} className="text-neutral-700" />
      </div>

      {/* CHAT MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.2); }
        `}</style>
        
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={index}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar Pods */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border 
                  ${msg.role === "user" ? "bg-neutral-800 border-white/10" : "bg-cyan-500/10 border-cyan-500/20"}`}>
                  {msg.role === "user" ? <UserIcon size={14} className="text-neutral-400" /> : <Bot size={14} className="text-cyan-400" />}
                </div>

                {/* Message Bubble */}
                <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed border shadow-sm transition-all duration-300
                  ${msg.role === "user" 
                    ? "bg-gradient-to-br from-cyan-600/20 to-blue-700/20 border-cyan-500/20 text-neutral-200" 
                    : "bg-neutral-900/60 border-white/5 text-neutral-400"}`}>
                  {renderText(msg.parts[0].text)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center px-4 py-3 bg-neutral-900/40 rounded-2xl border border-white/5">
              <Sparkles className="w-3 h-3 text-cyan-500 animate-spin" />
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest animate-pulse">Analyzing Logic...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR: Terminal Style */}
      <div className="p-4 bg-neutral-900/50 border-t border-white/5">
        <form onSubmit={handleSubmit(onSubmit)} className="relative group">
          <input
            autoComplete="off"
            placeholder={isLoading ? "Syncing response..." : "Ask for a hint or complexity analysis..."}
            className={`w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 px-4 pr-12 text-xs text-neutral-200 placeholder-neutral-600 outline-none transition-all duration-300
              ${errors.message ? 'border-rose-500/50' : 'focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5'}
              disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
            disabled={isLoading}
            {...register("message", { required: true, minLength: 2 })}
          />
          <button
            type="submit"
            disabled={isLoading || errors.message}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all
              ${isLoading 
                ? 'text-neutral-700' 
                : 'text-cyan-500 hover:bg-cyan-500 hover:text-white shadow-lg shadow-cyan-500/10 active:scale-95'
              }`}
          >
            <Send size={14} />
          </button>
        </form>
        <div className="mt-2 flex justify-between items-center px-1">
          <p className="text-[8px] font-mono text-neutral-700 uppercase tracking-tighter">Secure_AI_Protocol_v4.0</p>
          {errors.message && <span className="text-[8px] font-bold text-rose-500 uppercase tracking-widest">Input Sequence Required</span>}
        </div>
      </div>
    </div>
  );
}

export default ChatAi;