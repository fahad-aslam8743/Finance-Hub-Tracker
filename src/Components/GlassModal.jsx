import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const GlassModal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalStyle; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-8">
      
      {/* 1. Backdrop - Faster fade for a snappier feel */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] animate-in fade-in duration-200" 
        onClick={onClose} 
      />

      {/* 2. Tiny Minimal Body */}
      <div className={`
        relative w-full max-w-[340px] md:max-w-[380px] 
        bg-white rounded-[1.5rem] md:rounded-[2rem] 
        shadow-[0_15px_40px_-12px_rgba(0,0,0,0.15)]
        
        /* Pop Animation */
        animate-in zoom-in-90 fade-in duration-200 ease-out
        overflow-hidden
      `}>
        
        {/* Compressed Header */}
        <div className="px-5 py-4 flex items-center justify-between">
          <span className="font-black text-slate-400 uppercase tracking-[0.2em] text-[8px]">
            {title}
          </span>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-slate-50 rounded-full text-slate-300 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        
        {/* Minimal Content Padding */}
        <div className="px-5 pb-6">
          <div className="scale-[0.98] origin-top">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassModal;