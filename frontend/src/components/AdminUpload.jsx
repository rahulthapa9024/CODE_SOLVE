import { useParams } from 'react-router';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Cloud, CheckCircle2, AlertCircle, 
  FileVideo, Cpu, Activity, Clock, Database 
} from "lucide-react";

function AdminUpload() {
  const { problemId } = useParams();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [userId, setUserId] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  useEffect(() => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (cookie) {
      const token = cookie.split('=')[1];
      try {
        const decoded = jwtDecode(token);
        if (decoded?.userId) setUserId(decoded.userId);
      } catch (err) { console.error('Token corruption detected:', err); }
    }
  }, []);

  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      // 1) Get Cloudinary signature
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      // 2) Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      const uploadResponse = await axios.post(upload_url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // 3) Save metadata
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
        userId: userId || 'anonymous'
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset();
    } catch (err) {
      setError('root', { message: err.response?.data?.message || 'Transmission failed.' });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB'][i];
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 pb-20">
      <div className="max-w-2xl mx-auto px-6 pt-12">
        
        {/* Header */}
        <div className="mb-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-4">
            <Cloud className="text-cyan-500" size={20} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neutral-500">Protocol_File_Transfer</span>
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter">
            Upload <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Solution</span>
          </h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-900/20 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Upload size={120} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
            
            {/* Custom Styled File Input */}
            <div className="space-y-4">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 block">Select_Video_Payload</label>
              <div className={`relative group border-2 border-dashed transition-all rounded-2xl 
                ${errors.videoFile ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/5 hover:border-cyan-500/30 bg-white/5'}`}>
                <input
                  type="file"
                  accept="video/*"
                  disabled={uploading}
                  {...register('videoFile', { required: 'Source file missing' })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="p-10 text-center">
                  <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FileVideo className={errors.videoFile ? 'text-rose-500' : 'text-cyan-500'} />
                  </div>
                  <p className="text-sm font-bold">{selectedFile ? selectedFile.name : 'Click or Drag to Upload'}</p>
                  <p className="text-[10px] font-mono text-neutral-500 mt-2 uppercase tracking-tight">MP4, WEBM, MOV (MAX 100MB)</p>
                </div>
              </div>
              {errors.videoFile && (
                <span className="text-rose-500 font-mono text-[10px] uppercase flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.videoFile.message}
                </span>
              )}
            </div>

            {/* Selected File Details Pod */}
            <AnimatePresence>
              {selectedFile && !uploading && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity size={16} className="text-cyan-500" />
                    <div>
                      <p className="text-[10px] font-mono text-neutral-500 uppercase">File_Size</p>
                      <p className="text-xs font-bold">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Database size={16} className="text-neutral-700" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Section */}
            {uploading && (
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Transmitting_Data...</span>
                  </div>
                  <span className="font-mono text-cyan-400 text-sm">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                  />
                </div>
              </div>
            )}

            {/* Status Messages */}
            {errors.root && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500">
                <AlertCircle size={18} />
                <span className="text-xs font-bold uppercase tracking-tighter">{errors.root.message}</span>
              </div>
            )}

            {uploadedVideo && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-4 text-emerald-400">
                <CheckCircle2 size={24} />
                <div className="flex-1">
                  <p className="text-[10px] font-mono uppercase font-black">Transmission_Complete</p>
                  <p className="text-[10px] font-mono opacity-60">ID: {uploadedVideo.cloudinaryPublicId}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Clock size={12} />
                    <span className="text-xs font-bold">{Math.floor(uploadedVideo.duration)}s</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3
                ${uploading 
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                  : 'bg-cyan-500 text-white hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] active:scale-[0.98]'}`}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Encrypting_Payload
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Initiate_Upload
                </>
              )}
            </button>

          </form>
        </motion.div>
      </div>
    </div>
  );
}

// Simple internal loader for the button
function Loader2({ className, size }) {
  return <Activity className={`${className} animate-pulse`} size={size} />;
}

export default AdminUpload;