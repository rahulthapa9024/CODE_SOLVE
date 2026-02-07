import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { googleLogin, sendOtp } from "../../slices/userSlice"; 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { MdEmail, MdError, MdCheckCircle, MdArrowForward, MdCode, MdTerminal } from "react-icons/md";

const Spinner = () => (
  <motion.div 
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    className="w-5 h-5 border-2 border-white/30 border-t-cyan-400 rounded-full"
  />
);

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailInput(value);
    if (!value) {
      setEmailError("");
      setIsEmailValid(false);
    } else if (!validateEmail(value)) {
      setEmailError("Enter a valid developer email");
      setIsEmailValid(false);
    } else {
      setEmailError("");
      setIsEmailValid(true);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = result.user;
      await dispatch(googleLogin({ displayName, email, photoURL })).unwrap();
      toast.success("Authentication successful. Welcome to the Arena.");
      navigate("/home");
    } catch (err) {
      toast.error(err.message || "Google auth failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!isEmailValid) return;
    setOtpLoading(true);
    try {
      await dispatch(sendOtp(emailInput)).unwrap();
      toast.success("Verification code sent to your inbox.");
      navigate("/verifyOtp", { state: { email: emailInput } });
    } catch (err) {
      setEmailError("User not found. Please Sign up with Google first.");
      toast.error("User does not exist.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* LEFT SIDE: The Brand Experience */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center p-12 overflow-hidden border-r border-white/5">
        {/* Cinematic Background Image */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
            alt="Cyber Code" 
            className="w-full rounded-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
        </motion.div>

        {/* Content Over Image */}
        <div className="relative z-10 w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <MdCode className="text-white text-3xl" />
              </div>
              <span className="text-white font-black text-3xl tracking-tight uppercase">Code<span className="text-cyan-400">Solve</span></span>
            </div>

            <h2 className="text-6xl font-bold text-white leading-[1.1] mb-6">
              Master the <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Logic Behind
              </span> <br />
              the Code.
            </h2>
     
            
          </motion.div>
        </div>

        {/* Floating "Console" Element */}
        <div className="absolute bottom-10 right-10 w-64 p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hidden xl:block">
          <div className="flex gap-1.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
          <p className="text-xs font-mono text-cyan-400/80 leading-relaxed">
            {`> Initializing...`} <br />
            {`> Connection secured`} <br />
            {`> Ready to solve`}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: The Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-[#050505] relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-3">Sign In</h1>
            <p className="text-neutral-500">Welcome back, Engineer. Ready for a challenge?</p>
          </div>

          <div className="space-y-6">
            {/* Google Social Login */}
            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.03)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-4 rounded-xl border  border-neutral-800 bg-neutral-900/50 flex items-center justify-center gap-3 font-semibold text-white transition-all hover:border-neutral-600 group"
            >
              {googleLoading ? <Spinner /> : (
                <>
                  <FcGoogle size={22} />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Continue with Google</span>
                </>
              )}
            </motion.button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-neutral-900" />
              <span className="text-neutral-700 text-[10px] font-bold uppercase tracking-[0.2em]">secure terminal login</span>
              <div className="h-px flex-1 bg-neutral-900" />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email Address</label>
                <MdTerminal className="text-neutral-600" />
              </div>
              <div className="relative group">
                <input
                  type="email"
                  value={emailInput}
                  onChange={handleEmailChange}
                  placeholder="e.g. developer@algoverse.io"
                  className={`w-full bg-[#0a0a0a] border-2 py-4 px-5 rounded-xl text-white font-mono text-sm outline-none transition-all duration-300 ${
                    emailError 
                      ? "border-red-500/50 focus:border-red-500" 
                      : isEmailValid 
                      ? "border-green-500/50 focus:border-green-500"
                      : "border-neutral-900 focus:border-cyan-500/50 focus:ring-4 ring-cyan-500/5"
                  }`}
                />
                <AnimatePresence>
                  {isEmailValid && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                      <MdCheckCircle size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {emailError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                  <MdError size={14} /> {emailError}
                </motion.p>
              )}
            </div>

            {/* OTP Action */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendOtp}
              disabled={otpLoading || !isEmailValid}
              className={`group w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isEmailValid 
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/10" 
                : "bg-neutral-900 text-neutral-600 cursor-not-allowed"
              }`}
            >
              {otpLoading ? <Spinner /> : (
                <>
                  <span>Request OTP Access</span>
                  <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </div>

          <p className="mt-12 text-center text-xs text-neutral-600 leading-relaxed font-medium px-8">
            New to the arena? Use Google to create your permanent 
            <span className="text-neutral-400 px-1">Developer Identity</span> 
            automatically.
          </p>

        </motion.div>
      </div>
    </div>
  );
}