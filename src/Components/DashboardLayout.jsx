import React from 'react';
import { Wallet, LogOut } from 'lucide-react';

const DashboardLayout = ({ children, isBlur, onLogout }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FD] text-slate-900 antialiased relative overflow-x-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-rose-400/10 blur-[100px] pointer-events-none" />

      <nav className="sticky top-0 z-50 bg-white/40 backdrop-blur-2xl border-b border-white/60 px-6 py-5">
        <div className="max-w-[1300px] mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-3 font-black uppercase tracking-tighter text-slate-900">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
              <Wallet size={20} className="text-white fill-white/20" />
            </div>
            <span className="tracking-[0.1em]">FinanceHub</span>
          </div>

          <button onClick={onLogout} className="text-slate-400 hover:text-rose-500 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
            Terminate <LogOut size={18} />
          </button>
        </div>
      </nav>
      <main className={`max-w-[1300px] mx-auto p-4 md:p-10 lg:p-16 transition-all duration-700 ${isBlur ? 'scale-[0.97] blur-2xl opacity-20 pointer-events-none' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;