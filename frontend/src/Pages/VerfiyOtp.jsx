import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { verifyOtp, googleLogin } from "../../slices/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdError, MdArrowBack, MdTerminal, MdShield } from "react-icons/md";
import { toast } from "react-toastify";

const Spinner = () => (
  <motion.div 
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    className="w-5 h-5 border-2 border-white/30 border-t-cyan-400 rounded-full"
  />
);

const OtpVerifyPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [showGoogleSignup, setShowGoogleSignup] = useState(false);
  const singleInputRef = useRef(null);

  useEffect(() => {
    singleInputRef.current?.focus();
  }, []);

  if (!email) return <Navigate to="/login" replace />;
  if (isAuthenticated) return <Navigate to="/home" replace />;

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.trim();
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    const result = await dispatch(verifyOtp({ email, otp: otpString }));

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Identity verified. Welcome to the Arena.");
      navigate("/home");
    } else if (result.payload?.showGoogleLogin) {
      setShowGoogleSignup(true);
      toast.error("Account not initialized. Use Google to create identity.");
    } else {
      toast.error(result.payload?.message || "Verification failed");
      setOtp("");
      singleInputRef.current?.focus();
    }
  };

  const handleGoogleSignup = async () => {
    const googleUserData = {
      displayName: email.split("@")[0],
      email,
      photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split("@")[0])}&background=0ea5e9&color=fff`,
    };

    const result = await dispatch(googleLogin(googleUserData));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Developer Identity Created.");
      navigate("/home");
    } else {
      toast.error("Google sync failed.");
    }
  };

  const handleResendOtp = () => {
    toast.info("New verification sequence sent.");
    setOtp("");
    singleInputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && otp.length === 6) {
      handleVerifyOtp();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* System Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
          <div className="w-full rounded-[23px] bg-neutral-900/40 backdrop-blur-2xl px-8 py-10 border border-white/5 relative overflow-hidden">
            
            {/* Back to Login */}
            <button
              onClick={() => navigate("/login")}
              className="absolute top-6 left-6 p-2 text-neutral-500 hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5"
            >
              <MdArrowBack size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-10">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <MdShield className="text-white text-3xl" />
                </div>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">Two-Factor</h1>
              <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-[0.2em] mb-4">Secure_Terminal_Access</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <MdEmail className="text-cyan-400" size={14} />
                <span className="text-xs text-neutral-300 font-mono">{email}</span>
              </div>
            </div>

            {/* OTP Input Logic */}
            <div className="mb-10">
              <div className="flex justify-center gap-3 relative mb-6" onClick={() => singleInputRef.current?.focus()}>
                <input
                  ref={singleInputRef}
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={handleOtpChange}
                  onKeyPress={handleKeyPress}
                  maxLength="6"
                  className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-default"
                  autoFocus
                />

                {Array.from({ length: 6 }).map((_, i) => {
                  const digit = otp[i] || "";
                  const isCurrent = i === otp.length;
                  const isFocused = singleInputRef.current === document.activeElement;

                  return (
                    <div
                      key={i}
                      className={`w-12 h-16 text-2xl font-black rounded-xl border-2 flex items-center justify-center transition-all duration-300
                        ${isCurrent && isFocused 
                          ? "border-cyan-500 bg-cyan-500/5 shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                          : "border-white/5 bg-black/20 text-neutral-400"
                        }`}
                    >
                      {digit}
                      {isCurrent && isFocused && (
                        <motion.div 
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-0.5 h-6 bg-cyan-500"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <button
                  onClick={handleResendOtp}
                  className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:text-cyan-400 transition-colors"
                >
                  Request_New_Sequence
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className={`group w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mb-4
                ${otp.length === 6 
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/10 hover:scale-[1.02]" 
                  : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
                }`}
            >
              {loading ? <Spinner /> : (
                <>
                  <span>Initialize Access</span>
                  <MdTerminal size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Google Fallback Sync */}
            <AnimatePresence>
              {showGoogleSignup && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 pt-6 border-t border-white/5"
                >
                  <p className="text-[10px] text-center text-neutral-500 uppercase tracking-widest mb-4">Identity Sync Required</p>
                  <button
                    onClick={handleGoogleSignup}
                    className="w-full py-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-all group"
                  >
                    <FcGoogle size={20} />
                    <span className="text-sm font-bold text-white">Continue with Google</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Global Error Handle */}
            {error && !showGoogleSignup && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center gap-2 text-red-400 text-[11px] justify-center font-medium"
              >
                <MdError size={14} /> {error}
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer Metadata */}
        <p className="mt-8 text-center text-[10px] text-neutral-700 font-mono uppercase tracking-[0.3em]">
          End-to-End Encryption Active
        </p>
      </motion.div>
    </div>
  );
};

export default OtpVerifyPage;