import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../API/supabase';
import { useQueryClient } from '@tanstack/react-query'; 
import TransactionList from '../Components/TransactionList';
import TransactionForm from '../Components/TransactionForm';
import Stats from '../Components/Stats';
import { Plus, X, Command, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingData, setEditingData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      !session ? navigate('/') : queryClient.invalidateQueries(['transactions']);
    });
  }, [navigate, queryClient]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    toast.success("Signed out");
    navigate('/');
  };

  const toggleForm = (data = null) => {
    setEditingData(data);
    setIsFormOpen(!!data || !isFormOpen);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-indigo-100">
      {/* NAV BAR */}
      <nav className="sticky top-0 z-40 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex justify-between items-center px-6 py-4 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
              <Command size={18} className="text-white" />
            </div>
            <h1 className="text-sm font-black tracking-tighter uppercase italic">FinanceHub</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-rose-600 transition-all">
            <LogOut size={18} />
            <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className={`transition-all duration-500 max-w-[1200px] mx-auto p-4 md:p-12 ${isFormOpen ? 'scale-[0.98] blur-md opacity-40 pointer-events-none' : ''}`}>
        <Stats />
        <section className="max-w-[850px] mx-auto mt-10 pb-32">
          <div className="flex items-center gap-4 mb-6 opacity-40 italic">
            <h2 className="text-[10px] font-black uppercase tracking-widest">Recent Activity</h2>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <TransactionList onEdit={(data) => toggleForm(data)} />
          </div>
        </section>
      </main>

      {/* FLOATING ACTION BUTTON */}
      {!isFormOpen && (
        <button onClick={() => toggleForm()} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all">
          <Plus size={20} strokeWidth={3} />
          <span className="font-black text-[11px] uppercase tracking-widest">Add Record</span>
        </button>
      )}

      {/* MODAL FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div onClick={() => toggleForm()} className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm animate-in fade-in" />
          <div className="relative w-full max-w-[450px] bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in slide-in-from-bottom-10">
            <button onClick={() => toggleForm()} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900"><X size={20} /></button>
            <h3 className="text-xl font-black uppercase italic mb-1">{editingData ? 'Edit Entry' : 'New Entry'}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Update Ledger</p>
            <TransactionForm editingData={editingData} onSuccess={() => toggleForm()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;