import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Video, Shield, 
  Terminal, Database, Settings, Lock, 
  ChevronRight, Cpu, Zap, Key, Server,
  Code, FileCode, CloudUpload, CloudOff
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Admin() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add new coding challenges to the database',
      icon: <Plus size={28} />,
      accent: 'from-emerald-400 to-cyan-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Modify existing problem specifications',
      icon: <Edit size={28} />,
      accent: 'from-amber-400 to-orange-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove challenges from the system',
      icon: <Trash2 size={28} />,
      accent: 'from-rose-400 to-red-500',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Manage Videos',
      description: 'Upload and manage solution videos',
      icon: <Video size={28} />,
      accent: 'from-purple-400 to-indigo-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      route: '/admin/video'
    }
  ];

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
            <Shield className="text-cyan-500" size={20} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neutral-500">
              Admin_Control_Panel
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                System <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Administration</span>
              </h1>
              <p className="mt-3 text-neutral-400 font-mono text-sm max-w-2xl">
                Privileged access to platform management tools. All actions are logged and monitored.
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-neutral-900/50 border border-white/5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-neutral-400">
                Access Level: <span className="text-purple-400 font-bold">ADMIN</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Admin Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AdminCard
                title={option.title}
                icon={option.icon}
                description={option.description}
                onClick={() => handleNavigate(option.route)}
                accent={option.accent}
                bg={option.bg}
                border={option.border}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// AdminCard Component
function AdminCard({ title, icon, description, onClick, accent, bg, border }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      type="button"
      className={`w-full text-left p-6 rounded-2xl ${bg} border ${border} group hover:bg-neutral-800/40 transition-all duration-300 relative overflow-hidden`}
    >
      {/* Hover Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Left Border Accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-6">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-100 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-neutral-400 font-mono mb-6">
          {description}
        </p>

        {/* Action Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 group-hover:text-neutral-500 transition-colors">
            Click to Access
          </span>
          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-white transition-all">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </motion.button>
  );
}