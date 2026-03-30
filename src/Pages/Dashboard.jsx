import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../API/supabase';
import { useQueryClient, useQuery } from '@tanstack/react-query'; 
import { Plus, ShieldCheck, History, Wallet } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

import DashboardLayout from '../Components/DashboardLayout';
import TransactionList from '../Components/TransactionList';
import TransactionForm from '../Components/TransactionForm';
import Stats from '../Components/Stats';
import AnalyticsChart from '../Components/AnalyticsChart';
import GlassModal from '../Components/GlassModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session, loading: authLoading } = useAuth();
  const [editingData, setEditingData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(() => {
    return !sessionStorage.getItem('dashboard_loaded');
  });

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => (await supabase.from('transactions').select('*').order('created_at', { ascending: false })).data || [],
    enabled: !!session,
  });

  const displayUserName = session?.user?.user_metadata?.display_name || 
                          session?.user?.user_metadata?.full_name || 
                          session?.user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    if (!authLoading && !session) return navigate('/');
    if (showLoader) {
      const timer = setTimeout(() => {
        setShowLoader(false);
        sessionStorage.setItem('dashboard_loaded', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [authLoading, session, navigate, showLoader]);

  const toggleForm = (data = null) => {
    setEditingData(data);
    setIsFormOpen(!!data || !isFormOpen);
  };

  if (showLoader) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <style>{`
        @keyframes fill { 0% { width: 0%; } 100% { width: 100%; } }
      `}</style>
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl">
          <Wallet className="text-white" size={32} />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 ml-[0.5em]">FinanceHub</h2>
          <p className="text-[9px] text-slate-400 italic font-medium">Securing Connection...</p>
        </div>
        <div className="w-40 h-[2px] bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600" style={{ animation: 'fill 2s ease-in-out forwards' }} />
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout onLogout={async () => { 
      await supabase.auth.signOut(); 
      queryClient.clear(); 
      sessionStorage.removeItem('dashboard_loaded');
      navigate('/'); 
    }}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-10 space-y-10 pb-32">
        
        <div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase w-fit mb-2">
            <ShieldCheck size={12}/> Vault Active
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 capitalize">
            Welcome, {displayUserName.split(' ')[0]}<span className="text-indigo-600">.</span>
          </h1>
        </div>

        <Stats transactions={transactions} />

        <div className="space-y-12">
          <section className="bg-white border border-slate-100 rounded-[2rem] p-6 md:p-8 shadow-sm">
            <AnalyticsChart transactions={transactions} />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2 text-slate-800 font-black uppercase text-xs tracking-widest">
              <History size={16} className="text-indigo-600"/> Recent Activity
            </div>
            <TransactionList transactions={transactions} onEdit={toggleForm} />
          </section>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button 
  onClick={() => toggleForm()} 
  className="flex items-center gap-2.5 px-5 py-3 md:px-6 md:py-3 bg-slate-900 text-white rounded-full shadow-lg hover:bg-indigo-600 transition-all active:scale-95"
>
  <Plus 
    className="w-4 h-4 md:w-6 md:h-6" 
    strokeWidth={3} 
  />
  <span className="font-bold text-[10px] md:text-sm uppercase tracking-wider pr-1">
    Add Entry
  </span>
</button>
      </div>

      <GlassModal 
        isOpen={isFormOpen} 
        onClose={() => toggleForm()} 
        title={editingData ? "Edit Entry" : "New Entry"}
      >
        <TransactionForm 
          editingData={editingData} 
          onSuccess={() => { setIsFormOpen(false); queryClient.invalidateQueries(['transactions']); }} 
        />
      </GlassModal>
    </DashboardLayout>
  );
};

export default Dashboard;