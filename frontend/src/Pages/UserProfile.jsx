// src/components/UserProfile.jsx

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
    logoutUser, 
    getDifficultyCount, 
    getUserImage 
} from "../../slices/userSlice"; 
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    LogOut, LayoutDashboard, CheckSquare, BarChart3, User,
    Shield, Terminal, Cpu, Activity, Lock, ChevronRight, 
    Sparkles, Zap, Target, Database, Key
} from "lucide-react";

const ADMIN_EMAIL = import.meta.env.VITE_PROJECT_ADMIN;

// ==============================================
// Confirmation Modal (Cyberpunk Theme)
// ==============================================
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-neutral-900/90 border border-white/5 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl shadow-cyan-500/10"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 flex items-center justify-center mb-6">
                            <Lock className="w-8 h-8 text-red-400" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                            {title}
                        </h2>
                        <p className="text-neutral-400 font-mono text-sm mb-8 tracking-wide">
                            {message}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 rounded-xl bg-neutral-800 border border-white/5 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all duration-300 font-bold text-sm uppercase tracking-wider"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-300 text-sm uppercase tracking-wider active:scale-95"
                        >
                            Confirm
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ==============================================
// Circular Progress Chart (Cyberpunk Style)
// ==============================================
const CircularStats = ({ counts }) => {
    const { easy = 0, medium = 0, hard = 0 } = counts || {};
    const totalSolved = easy + medium + hard;
    const radius = 42;
    const circumference = 2 * Math.PI * radius;

    const getArc = (percentage, offset, color) => {
        const strokeDashoffset = circumference - (percentage / 100) * circumference;
        return (
            <circle
                className={color}
                strokeWidth="8"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="50"
                cy="50"
                style={{
                    transform: `rotate(${(offset / 100) * 360 - 90}deg)`,
                    transformOrigin: "50% 50%",
                }}
            />
        );
    };

    const easyPercent = totalSolved > 0 ? (easy / totalSolved) * 100 : 0;
    const mediumPercent = totalSolved > 0 ? (medium / totalSolved) * 100 : 0;

    return (
        <div className="relative w-64 h-64">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background ring */}
                <circle
                    className="text-white/5"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                />
                
                {/* Difficulty rings with glowing effects */}
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                
                {totalSolved > 0 && (
                    <>
                        {getArc(100, 0, "text-rose-500/60 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]")}
                        {getArc(easyPercent + mediumPercent, 0, "text-amber-500/60 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]")}
                        {getArc(easyPercent, 0, "text-emerald-500/60 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]")}
                    </>
                )}
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-center"
                >
                    <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        {totalSolved}
                    </div>
                    <div className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500">
                        Problems_Solved
                    </div>
                </motion.div>
            </div>
            
            {/* Animated rings for effect */}
            {totalSolved > 0 && (
                <>
                    <div className="absolute inset-0 animate-ping opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                                className="text-cyan-400"
                                strokeWidth="1"
                                stroke="currentColor"
                                fill="transparent"
                                r={radius + 5}
                                cx="50"
                                cy="50"
                            />
                        </svg>
                    </div>
                </>
            )}
        </div>
    );
};

// ==============================================
// Stats Legend (Cyberpunk Style)
// ==============================================
const StatsLegend = ({ counts }) => {
    const { easy = 0, medium = 0, hard = 0 } = counts || {};
    
    const StatItem = ({ color, label, count, icon }) => (
        <div className="flex items-center justify-between p-4 bg-neutral-900/50 border border-white/5 rounded-xl hover:bg-neutral-800/50 transition-all duration-300 group">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                    {icon}
                </div>
                <div>
                    <div className="text-sm font-mono uppercase tracking-wider text-neutral-500">
                        {label}
                    </div>
                    <div className="text-xs text-neutral-400">
                        Level {label.toLowerCase()}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-black text-white">
                    {count}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-600">
                    Solved
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-3">
            <StatItem 
                color="bg-emerald-500/20 border border-emerald-500/30" 
                label="Easy" 
                count={easy}
                icon={<Zap className="w-5 h-5 text-emerald-400" />}
            />
            <StatItem 
                color="bg-amber-500/20 border border-amber-500/30" 
                label="Medium" 
                count={medium}
                icon={<Target className="w-5 h-5 text-amber-400" />}
            />
            <StatItem 
                color="bg-rose-500/20 border border-rose-500/30" 
                label="Hard" 
                count={hard}
                icon={<Cpu className="w-5 h-5 text-rose-400" />}
            />
        </div>
    );
};

// ==============================================
// Main UserProfile Component
// ==============================================
export default function UserProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, user, photoURL, imageLoading } = useSelector((state) => state.auth);
    
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [initials, setInitials] = useState('??');
    const [imgError, setImgError] = useState(false);

    const difficultyCounts = user?.difficultyCount?.difficultyCount;

    useEffect(() => {
        if (isAuthenticated && !difficultyCounts) {
            dispatch(getDifficultyCount());
        }
        
        dispatch(getUserImage());

        if (user?.displayName) {
            const nameInitials = user.displayName
                .split(' ')
                .map((part) => part[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
            setInitials(nameInitials || '??');
        } else {
            setInitials('??');
        }
        
        setIsAdmin(user?.email === ADMIN_EMAIL);
    }, [dispatch, isAuthenticated, difficultyCounts, user]);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-cyan-500/30 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Terminal className="w-8 h-8 text-cyan-500 animate-pulse" />
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <div className="text-sm font-mono uppercase tracking-widest text-neutral-600 mb-2">
                        Loading User Profile
                    </div>
                    <div className="text-xs text-neutral-700 font-mono">
                        Decrypting Data...
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        navigate("/signup");
        return null;
    }

    const handleLogoutClick = () => setShowLogoutConfirm(true);
    const handleConfirmLogout = async () => {
        setShowLogoutConfirm(false);
        try {
            await dispatch(logoutUser()).unwrap();
            navigate("/signup");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    const handleCancelLogout = () => setShowLogoutConfirm(false);
    const goToAdminPanel = () => navigate("/admin");
    const goToSolved = () => navigate("/solvedByUser");

    // Avatar Rendering Logic
    const renderAvatar = () => {
        if (imageLoading) {
            return (
                <div className="w-32 h-32 rounded-full bg-neutral-800/50 border-2 border-white/5 animate-pulse" />
            );
        }
        
        if (photoURL && !imgError) {
            return (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500/30 group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 z-10" />
                    <img
                        src={photoURL}
                        alt="User profile"
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
            );
        }

        return (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-cyan-500/20 border-2 border-white/10"
            >
                {initials}
            </motion.div>
        );
    };

    return (
        <>
            <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 pb-20">
                <div className="max-w-6xl mx-auto px-6 pt-12">
                    
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="text-cyan-500" size={20} />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neutral-500">
                                User_Profile_System
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                            Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Identity</span>
                            <span className="ml-4 text-lg font-mono text-neutral-700 tracking-normal">
                                [{isAdmin ? "ADMIN" : "USER"}]
                            </span>
                        </h1>
                    </motion.div>

                    {/* Main Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neutral-900/20 border border-white/5 rounded-2xl backdrop-blur-xl overflow-hidden mb-10"
                    >
                        {/* Profile Header */}
                        <div className="p-8 border-b border-white/5">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Avatar */}
                                <div className="relative">
                                    {renderAvatar()}
                                    <div className="absolute -bottom-2 -right-2">
                                        <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isAdmin ? "bg-purple-500/10 border-purple-500/20 text-purple-400" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"}`}>
                                            {isAdmin ? (
                                                <span className="flex items-center gap-1">
                                                    <Shield size={10} /> ADMIN
                                                </span>
                                            ) : "USER"}
                                        </div>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                                        {user?.displayName || "Anonymous User"}
                                    </h2>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                        <Database className="w-4 h-4 text-neutral-500" />
                                        <p className="text-neutral-400 font-mono text-sm">
                                            {user?.email || "no-email@system.local"}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl">
                                        <Key className="w-3 h-3 text-neutral-500" />
                                        <span className="text-xs font-mono text-neutral-500">
                                            User_ID: {user?._id?.slice(-8) || "unknown"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="p-8 border-b border-white/5">
                            <div className="flex items-center gap-3 mb-6">
                                <BarChart3 className="text-cyan-500" size={24} />
                                <h3 className="text-xl font-bold tracking-tight">
                                    Performance <span className="text-neutral-500">Metrics</span>
                                </h3>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <CircularStats counts={difficultyCounts} />
                                <div className="space-y-4">
                                    <h4 className="text-sm font-mono uppercase tracking-wider text-neutral-500 mb-4">
                                        Difficulty Distribution
                                    </h4>
                                    <StatsLegend counts={difficultyCounts} />
                                </div>
                            </div>
                        </div>

                        {/* Actions Section */}
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Terminal className="text-cyan-500" size={24} />
                                <h3 className="text-xl font-bold tracking-tight">
                                    System <span className="text-neutral-500">Actions</span>
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {isAdmin && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={goToAdminPanel}
                                        className="group p-6 bg-neutral-900/50 border border-white/5 rounded-xl hover:border-cyan-500/30 hover:bg-gradient-to-br hover:from-cyan-500/5 hover:to-purple-500/5 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                                                <LayoutDashboard className="w-6 h-6 text-purple-400" />
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-cyan-400 transition-colors" />
                                        </div>
                                        <h4 className="font-bold text-white mb-2">Admin Panel</h4>
                                        <p className="text-xs text-neutral-500">
                                            System administration and management
                                        </p>
                                    </motion.button>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={goToSolved}
                                    className="group p-6 bg-neutral-900/50 border border-white/5 rounded-xl hover:border-cyan-500/30 hover:bg-gradient-to-br hover:from-cyan-500/5 hover:to-purple-500/5 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                                            <CheckSquare className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                    <h4 className="font-bold text-white mb-2">Solved Problems</h4>
                                    <p className="text-xs text-neutral-500">
                                        View your completed challenges
                                    </p>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleLogoutClick}
                                    className="group p-6 bg-neutral-900/50 border border-white/5 rounded-xl hover:border-red-500/30 hover:bg-gradient-to-br hover:from-red-500/5 hover:to-orange-500/5 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                                            <LogOut className="w-6 h-6 text-red-400" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-red-400 transition-colors" />
                                    </div>
                                    <h4 className="font-bold text-white mb-2">Logout</h4>
                                    <p className="text-xs text-neutral-500">
                                        Sign out from the system
                                    </p>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={showLogoutConfirm}
                title="System Logout"
                message="Are you sure you want to terminate your session?"
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </>
    );
}