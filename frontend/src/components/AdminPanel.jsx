import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Minus, Code, FileText, Settings, 
  Cpu, Database, Terminal, Save, X, 
  Layers, Eye, EyeOff, ChevronRight,
  AlertTriangle, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Zod Schema ---
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'Please select a difficulty' })
  }),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp', 'tree', 'string', 'math'], {
    errorMap: () => ({ message: 'Please select a tag' })
  }),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case is required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case is required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'Initial code for all three languages is required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'Reference solution for all three languages is required')
});

// --- Utility Component (Section Card) ---
const SectionCard = ({ children, title, icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-neutral-900/20 border border-white/5 rounded-2xl backdrop-blur-xl p-8"
  >
    <div className="flex items-center gap-3 mb-8">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 flex items-center justify-center">
        <div className="text-cyan-400">
          {icon}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-black tracking-tight text-white">{title}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mt-2 rounded-full" />
      </div>
    </div>
    {children}
  </motion.div>
);

// --- Main Component ---
export default function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'easy',
      tags: 'array',
      visibleTestCases: [],
      hiddenTestCases: [],
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({ control, name: 'visibleTestCases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({ control, name: 'hiddenTestCases' });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Submission Error:', error);
      alert(`Error creating problem: ${error.response?.data?.message || error.message}`);
    }
  };

  // --- Styling Classes ---
  const inputBaseClass = `w-full p-4 rounded-xl border text-white placeholder-neutral-500 
                         bg-neutral-900/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 
                         transition-all duration-300 font-mono text-sm`;

  const inputClass = (err) =>
    `${inputBaseClass} ${err 
      ? 'border-rose-500/50 focus:border-rose-500' 
      : 'border-white/5 focus:border-cyan-500/50'}`;

  const labelClass = 'block text-sm font-mono uppercase tracking-wider text-neutral-500 mb-2';
  const errorClass = 'text-xs text-rose-400 font-mono mt-2 flex items-center gap-1';
  
  const selectClass = (err) =>
    `${inputBaseClass} ${err ? 'border-rose-500/50' : 'border-white/5'} cursor-pointer appearance-none`;

  const codeAreaClass = `w-full p-4 rounded-xl font-mono text-sm border bg-neutral-950/50 
                        border-white/5 focus:border-cyan-500/50 focus:outline-none resize-y
                        text-neutral-300`;

  const primaryButtonClass = `px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider
                             bg-gradient-to-r from-cyan-600 to-purple-600 text-white 
                             hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300
                             active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2`;

  const secondaryButtonClass = `px-4 py-2 rounded-lg font-medium text-sm
                               bg-neutral-800 border border-white/5 text-neutral-300
                               hover:bg-neutral-700 hover:text-white transition-all duration-300
                               flex items-center justify-center gap-2`;

  const tagStyle = (color) => {
    const styles = {
      easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      hard: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      array: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      linkedList: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      graph: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      dp: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      tree: 'text-green-400 bg-green-500/10 border-green-500/20',
      string: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      math: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    };
    return styles[color] || 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20';
  };

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
            <Terminal className="text-cyan-500" size={20} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neutral-500">
              Problem_Creator_System
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Challenge</span>
              </h1>
              <p className="mt-3 text-neutral-400 font-mono text-sm max-w-2xl">
                Define new coding challenges with detailed specifications, test cases, and starter code.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                Production Environment
              </h3>
              <p className="text-sm text-neutral-400 font-mono">
                You are creating a new problem in the live database. All fields are required and 
                will be visible to users. Test cases and solutions must be thoroughly validated.
              </p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          
          {/* Basic Information */}
          <SectionCard title="Problem Metadata" icon={<FileText size={24} />} delay={0.1}>
            <div className="space-y-6">
              <div className="form-control">
                <label className={labelClass} htmlFor="title">Challenge Title</label>
                <input
                  id="title"
                  {...register('title')}
                  placeholder="e.g., Two Sum - Find pairs that add up to target"
                  className={inputClass(errors.title)}
                />
                <AnimatePresence>
                  {errors.title && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={errorClass}
                    >
                      <AlertTriangle size={12} /> {errors.title.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="form-control">
                <label className={labelClass} htmlFor="description">Description (Markdown)</label>
                <textarea
                  id="description"
                  {...register('description')}
                  placeholder="Provide detailed problem statement with examples, constraints, and hints..."
                  className={`${inputClass(errors.description)} min-h-[200px]`}
                  rows={6}
                />
                <AnimatePresence>
                  {errors.description && (
                    <motion.span 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={errorClass}
                    >
                      <AlertTriangle size={12} /> {errors.description.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className={labelClass}>Difficulty</label>
                  <div className="relative">
                    <select
                      {...register('difficulty')}
                      className={selectClass(errors.difficulty)}
                    >
                      <option value="" disabled hidden>Select difficulty level</option>
                      <option value="easy" className="bg-neutral-900 text-emerald-400">Easy</option>
                      <option value="medium" className="bg-neutral-900 text-amber-400">Medium</option>
                      <option value="hard" className="bg-neutral-900 text-rose-400">Hard</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 -rotate-90 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>
                  <AnimatePresence>
                    {errors.difficulty && (
                      <motion.span 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={errorClass}
                      >
                        <AlertTriangle size={12} /> {errors.difficulty.message}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="form-control">
                  <label className={labelClass}>Category Tag</label>
                  <div className="relative">
                    <select
                      {...register('tags')}
                      className={selectClass(errors.tags)}
                    >
                      <option value="" disabled hidden>Select problem category</option>
                      <option value="array" className="bg-neutral-900 text-cyan-400">Array</option>
                      <option value="linkedList" className="bg-neutral-900 text-purple-400">Linked List</option>
                      <option value="graph" className="bg-neutral-900 text-pink-400">Graph</option>
                      <option value="dp" className="bg-neutral-900 text-orange-400">Dynamic Programming</option>
                      <option value="tree" className="bg-neutral-900 text-green-400">Tree</option>
                      <option value="string" className="bg-neutral-900 text-blue-400">String</option>
                      <option value="math" className="bg-neutral-900 text-yellow-400">Math</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 -rotate-90 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>
                  <AnimatePresence>
                    {errors.tags && (
                      <motion.span 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={errorClass}
                      >
                        <AlertTriangle size={12} /> {errors.tags.message}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Test Cases */}
          <SectionCard title="Test Cases" icon={<Layers size={24} />} delay={0.2}>
            {/* Visible Test Cases */}
            <div className="mb-10 p-6 rounded-xl border border-white/5 bg-neutral-900/30">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Visible Test Cases</h3>
                    <p className="text-xs text-neutral-500 font-mono">Examples shown to users</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className={secondaryButtonClass}
                >
                  <Plus size={16} />
                  Add Visible Case
                </motion.button>
              </div>
              
              <AnimatePresence>
                <div className="space-y-4">
                  {visibleFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 rounded-xl bg-neutral-900/50 border border-white/5 space-y-4 relative group"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${tagStyle('easy')}`}>
                            Example {index + 1}
                          </div>
                          <span className="text-xs text-neutral-500 font-mono">(Visible to users)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVisible(index)}
                          className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          aria-label={`Remove test case ${index + 1}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-neutral-500 mb-2 block">Input</label>
                          <textarea
                            {...register(`visibleTestCases.${index}.input`)}
                            placeholder="e.g., [2,7,11,15], 9"
                            className={inputClass(errors.visibleTestCases?.[index]?.input)}
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-neutral-500 mb-2 block">Expected Output</label>
                          <textarea
                            {...register(`visibleTestCases.${index}.output`)}
                            placeholder="e.g., [0,1]"
                            className={inputClass(errors.visibleTestCases?.[index]?.output)}
                            rows={3}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-mono text-neutral-500 mb-2 block">Explanation</label>
                        <textarea
                          {...register(`visibleTestCases.${index}.explanation`)}
                          placeholder="Explain how the input produces the output"
                          className={inputClass(errors.visibleTestCases?.[index]?.explanation)}
                          rows={3}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
              <AnimatePresence>
                {errors.visibleTestCases?.message && (
                  <motion.span 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={errorClass}
                  >
                    <AlertTriangle size={12} /> {errors.visibleTestCases.message}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Hidden Test Cases */}
            <div className="p-6 rounded-xl border border-white/5 bg-neutral-900/30">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <EyeOff className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Hidden Test Cases</h3>
                    <p className="text-xs text-neutral-500 font-mono">Used for evaluation only</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className={secondaryButtonClass}
                >
                  <Plus size={16} />
                  Add Hidden Case
                </motion.button>
              </div>
              
              <AnimatePresence>
                <div className="space-y-4">
                  {hiddenFields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 rounded-xl bg-neutral-900/50 border border-white/5 space-y-4 relative group"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${tagStyle('hard')}`}>
                            Hidden Case {index + 1}
                          </div>
                          <span className="text-xs text-neutral-500 font-mono">(Evaluation only)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeHidden(index)}
                          className="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          aria-label={`Remove hidden test case ${index + 1}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-neutral-500 mb-2 block">Input</label>
                          <textarea
                            {...register(`hiddenTestCases.${index}.input`)}
                            placeholder="Hidden test case input"
                            className={inputClass(errors.hiddenTestCases?.[index]?.input)}
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-neutral-500 mb-2 block">Expected Output</label>
                          <textarea
                            {...register(`hiddenTestCases.${index}.output`)}
                            placeholder="Expected output for hidden test"
                            className={inputClass(errors.hiddenTestCases?.[index]?.output)}
                            rows={3}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
              <AnimatePresence>
                {errors.hiddenTestCases?.message && (
                  <motion.span 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={errorClass}
                  >
                    <AlertTriangle size={12} /> {errors.hiddenTestCases.message}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </SectionCard>

          {/* Code Templates */}
          <SectionCard title="Code Templates" icon={<Code size={24} />} delay={0.3}>
            <div className="space-y-8">
              {['C++', 'Java', 'JavaScript'].map((language, index) => (
                <motion.div
                  key={language}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl border border-white/5 bg-neutral-900/30 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${tagStyle(['cyan', 'orange', 'yellow'][index])} flex items-center justify-center`}>
                        <Cpu className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-xl text-white">{language} Templates</h3>
                    </div>
                    <div className="text-xs font-mono text-neutral-500">
                      {language === 'C++' ? 'COMPILED' : language === 'Java' ? 'JVM' : 'INTERPRETED'}
                    </div>
                  </div>
                  
                  {/* Starter Code */}
                  <div className="form-control">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-mono uppercase tracking-wider text-neutral-500">Starter Code</label>
                      <span className="text-xs text-cyan-400 font-mono">Read-only for users</span>
                    </div>
                    <div className="relative">
                      <textarea
                        {...register(`startCode.${index}.initialCode`)}
                        placeholder={`// Starter code for ${language}\n// Users will see this initially`}
                        className={`${codeAreaClass} ${errors.startCode?.[index]?.initialCode ? 'border-rose-500/50' : ''}`}
                        rows={8}
                      />
                      <div className="absolute top-2 right-2">
                        <div className="px-2 py-1 bg-neutral-800 rounded text-xs font-mono text-neutral-500">
                          Ln 1, Col 1
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {errors.startCode?.[index]?.initialCode && (
                        <motion.span 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={errorClass}
                        >
                          <AlertTriangle size={12} /> {errors.startCode[index].initialCode.message}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Reference Solution */}
                  <div className="form-control">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-mono uppercase tracking-wider text-neutral-500">Reference Solution</label>
                      <span className="text-xs text-purple-400 font-mono">Used for validation</span>
                    </div>
                    <div className="relative">
                      <textarea
                        {...register(`referenceSolution.${index}.completeCode`)}
                        placeholder={`// Complete solution for ${language}\n// Used to verify user submissions`}
                        className={`${codeAreaClass} ${errors.referenceSolution?.[index]?.completeCode ? 'border-rose-500/50' : ''}`}
                        rows={12}
                      />
                      <div className="absolute top-2 right-2">
                        <div className="px-2 py-1 bg-neutral-800 rounded text-xs font-mono text-neutral-500">
                          Solution
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {errors.referenceSolution?.[index]?.completeCode && (
                        <motion.span 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={errorClass}
                        >
                          <AlertTriangle size={12} /> {errors.referenceSolution[index].completeCode.message}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
              <AnimatePresence>
                {(errors.startCode?.message || errors.referenceSolution?.message) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20"
                  >
                    <div className="flex items-center gap-2 text-rose-400">
                      <AlertTriangle size={16} />
                      <span className="text-sm font-mono">
                        {errors.startCode?.message || errors.referenceSolution?.message}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SectionCard>

          {/* Submit Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-center gap-6 p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl"
          >
            <div className="flex-1">
              <h3 className="text-xl font-black text-white mb-2">Ready to Deploy</h3>
              <p className="text-sm text-neutral-400 font-mono">
                Review all fields before creating the new challenge. This action cannot be undone.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                type="button"
                onClick={() => navigate('/admin')}
                className="px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-wider
                         bg-neutral-800 border border-white/5 text-neutral-300
                         hover:bg-neutral-700 hover:text-white transition-all duration-300
                         flex items-center justify-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`${primaryButtonClass} px-8 py-3`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Create Challenge
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </form>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/5 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-neutral-600" />
            <span className="text-xs font-mono text-neutral-700">
              ADMIN_CREATOR • v2.5.1 • VALIDATION_REQUIRED
            </span>
          </div>
          <p className="text-xs text-neutral-600 font-mono">
            © {new Date().getFullYear()} Solve Platform — All challenges are subject to review and testing.
          </p>
        </motion.div>
      </div>
    </div>
  );
}