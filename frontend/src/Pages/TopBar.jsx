import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserImage, logoutUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Code, Home, Award, User, LogOut, 
  Shield, ChevronDown, Cpu,
} from 'lucide-react'; 
import ConfirmLogoutModal from './ConfirmLogoutModal';
import {MdCode} from "react-icons/md";

const TopBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { photoURL, imageLoading, user } = useSelector((state) => state.auth);

  const [initials, setInitials] = useState('?');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imgError, setImgError] = useState(false);

  // LOGIC PRESERVED: Initialize user and handle initials
  useEffect(() => {
    const initializeUser = () => {
      dispatch(getUserImage());
      let currentUser = user;

      if (!currentUser) {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            currentUser = JSON.parse(userData);
          } catch {
            currentUser = null;
          }
        }
      }

      if (currentUser?.displayName) {
        const nameInitials = currentUser.displayName
          .split(' ')
          .map((part) => part[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        setInitials(nameInitials);
      } else {
        setInitials('?');
      }
    };

    initializeUser();
  }, [dispatch, user]);

  // LOGIC PRESERVED: Navigation and Logout handlers
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      setIsModalOpen(false);
    }
  };

  const openLogoutConfirmation = () => {
    setUserMenuOpen(false);
    setIsModalOpen(true);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const isAdmin = user?.email === import.meta.env.VITE_PROJECT_ADMIN;

  const navItems = [
    { name: 'Home', path: '/home', icon: <Home size={16} /> },
    { name: 'Problems', path: '/problems', icon: <Code size={16} /> },
    { name: 'Solved', path: '/solvedByUser', icon: <Award size={16} /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          
          {/* LEFT SIDE: Brand + Navigation */}
          <div className="flex items-center gap-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => handleNavigation('/home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:rotate-6 transition-all duration-300">
               <MdCode className="text-white text-3xl" />
              </div>
              <span className="text-white font-black text-xl tracking-tighter uppercase">
                Code<span className="text-cyan-400">Solve</span>
              </span>
            </motion.div>

            {/* Desktop Nav: Monospaced/Terminal Style */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-cyan-400 transition-all flex items-center gap-2 group relative"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500 font-mono">/</span>
                  {item.name}
                  <motion.span 
                    layoutId="nav-underline" 
                    className="absolute bottom-0 left-0 w-full h-px bg-cyan-500/0 group-hover:bg-cyan-500/50 transition-colors"
                  />
                </button>
              ))}
            </nav>
          </div>

          {/* RIGHT SIDE: Profile & Admin */}
          <div className="flex items-center gap-4">
            
            {/* Live Indicator (Decorative) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-widest">Node_Active</span>
            </div>

            <div className="h-6 w-px bg-white/10 mx-1 hidden md:block" />

            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleUserMenu}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
              >
                {imageLoading ? (
                  <div className="w-9 h-9 rounded-lg bg-neutral-800 animate-pulse" />
                ) : photoURL && !imgError ? (
                  <div className="relative">
                    <img
                      src={photoURL}
                      alt="Profile"
                      className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/20"
                      onError={() => setImgError(true)}
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-500 border-2 border-[#050505] rounded-full" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-cyan-500/10">
                    {initials}
                  </div>
                )}
                <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-300 ${userMenuOpen ? 'rotate-180 text-cyan-400' : ''}`} />
              </motion.button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-60 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 p-2"
                  >
                    <div className="px-4 py-3 mb-2 border-b border-white/5">
                      <p className="text-xs font-bold text-white truncate">{user?.displayName || 'Developer'}</p>
                      <p className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">{user?.email}</p>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavigation('/userProfile')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-neutral-400 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all"
                      >
                        <User size={14} className="opacity-50" /> Profile Settings
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => handleNavigation('/admin')}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 rounded-xl transition-all group"
                        >
                          <Cpu size={14} className="group-hover:rotate-90 transition-transform" /> 
                          System Console
                        </button>
                      )}

                      <div className="h-px bg-white/5 my-1 mx-2" />

                      <button
                        onClick={openLogoutConfirmation}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                      >
                        <LogOut size={14} /> Terminate Session
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-neutral-400 hover:text-cyan-400 transition-colors"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE OVERLAY MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0a0a0a] border-t border-white/5 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-cyan-400 hover:bg-white/5 rounded-xl transition-all"
                  >
                    <span className="text-cyan-500">{item.icon}</span>
                    {item.name}
                  </button>
                ))}
                {isAdmin && (
                  <button
                    onClick={() => handleNavigation('/admin')}
                    className="w-full flex items-center gap-4 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 bg-cyan-500/5 rounded-xl mt-2"
                  >
                    <Shield size={16} /> Root Access
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MODAL PRESERVED */}
      <ConfirmLogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
};

export default TopBar;