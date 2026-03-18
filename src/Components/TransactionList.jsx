import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import { Trash2, Edit3, Loader2, ArrowUpRight, ArrowDownLeft, Search, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionList = ({ onEdit }) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
  }, []);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      const { data, error } = await supabase.from('transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await supabase.from('transactions').delete().eq('id', id),
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      toast.success('Deleted');
    }
  });

  const filteredData = transactions?.filter(t => {
    const matchesFilter = filter === 'all' ? true : filter === 'income' ? t.amount > 0 : t.amount < 0;
    return matchesFilter && t.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading && !transactions) return <div className="py-20 text-center"><Loader2 className="mx-auto animate-spin text-indigo-500" /><p className="text-[10px] font-black text-slate-400 uppercase mt-4 tracking-widest">Syncing...</p></div>;

  return (
    <div className="w-full bg-white">
      <div className="p-6 border-b border-slate-50 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none font-medium" />
        </div>
        <div className="flex bg-slate-100/50 p-1 rounded-xl">
          {['all', 'income', 'expense'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {filteredData?.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-5 hover:bg-slate-50/30 group">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl border ${t.amount > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                {t.amount > 0 ? <ArrowUpRight size={18}/> : <ArrowDownLeft size={18}/>}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate capitalize">{t.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <p className={`text-sm font-black ${t.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>{t.amount > 0 ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}</p>
              <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(t)} className="p-1.5 text-slate-300 hover:text-indigo-600"><Edit3 size={14}/></button>
                <button onClick={() => deleteMutation.mutate(t.id)} className="p-1.5 text-slate-300 hover:text-rose-600"><Trash2 size={14}/></button>
              </div>
            </div>
          </div>
        ))}
        {filteredData?.length === 0 && <div className="py-24 text-center"><Inbox className="mx-auto text-slate-200 mb-2" size={32} /><p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No Data</p></div>}
      </div>
    </div>
  );
};

export default TransactionList;