import React, { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import { Trash2, Edit3, Loader2, Search, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionList = ({ transactions = [], isLoading, onEdit }) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // 1. DELETE LOGIC: One-tap delete with feedback
  const { mutate: deleteTx, isLoading: isDeletingTx, variables: deletingId } = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      toast.success('Purged');
      setExpandedId(null);
    }
  });

  // 2. FILTERING: Memoized for performance
  const filtered = useMemo(() => transactions.filter(t => {
    const isInc = t.amount > 0;
    const typeMatch = filter === 'all' || (filter === 'income' ? isInc : !isInc);
    return typeMatch && t.name?.toLowerCase().includes(search.toLowerCase());
  }), [transactions, filter, search]);

  if (isLoading && !transactions.length) return <Loader2 className="mx-auto animate-spin py-20 opacity-40" />;

  return (
    <div className="w-full space-y-4">
      {/* SEARCH & FILTERS */}
      <div className="p-2 bg-white/30 backdrop-blur-xl border border-white/60 rounded-[2rem] space-y-2">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input onChange={e => setSearch(e.target.value)} placeholder="Filter Ledger..." className="w-full pl-12 pr-4 py-3 bg-white/40 rounded-2xl text-xs font-bold outline-none" />
        </div>
        <div className="flex p-1 bg-slate-900/5 rounded-xl">
          {['all', 'income', 'expense'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}>{f}</button>
          ))}
        </div>
      </div>

      {/* TRANSACTION ITEMS */}
      <div className="space-y-3">
        {filtered.map(t => {
          const isInc = t.amount > 0;
          const isDeleting = isDeletingTx && deletingId === t.id;
          
          return (
            <div key={t.id} className={`overflow-hidden bg-white/40 backdrop-blur-md border border-white/60 rounded-[1.5rem] transition-all duration-300 ${isDeleting ? 'opacity-50 grayscale scale-95' : ''}`}>
              <div onClick={() => !isDeleting && setExpandedId(expandedId === t.id ? null : t.id)} className="flex items-center justify-between p-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl border ${isInc ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <div className={`w-1.5 h-1.5 rounded-full ${isInc ? 'bg-emerald-500' : 'bg-rose-500'}`} />}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 capitalize">{t.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`text-base md:text-xs font-black ${isInc ? 'text-emerald-600' : 'text-slate-900'}`}>{isInc ? '+' : '-'}${Math.abs(t.amount).toLocaleString()}</p>
                  <div className="hidden md:flex gap-2">
                    <button disabled={isDeleting} onClick={(e) => { e.stopPropagation(); onEdit(t); }} className="p-2 text-slate-400 hover:text-blue-600"><Edit3 size={14}/></button>
                    <button disabled={isDeleting} onClick={(e) => { e.stopPropagation(); deleteTx(t.id); }} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>

              {/* MOBILE ACTIONS */}
              <div className={`md:hidden grid transition-all duration-300 ${expandedId === t.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="flex gap-2 px-5 pb-5 pt-1 border-t border-white/20">
                    <button disabled={isDeleting} onClick={(e) => { e.stopPropagation(); onEdit(t); }} className="flex-1 py-3 bg-white/60 rounded-xl text-blue-600 text-[10px] font-black uppercase tracking-widest shadow-sm">Edit</button>
                    <button disabled={isDeleting} onClick={(e) => { e.stopPropagation(); deleteTx(t.id); }} className="flex-1 py-3 bg-rose-50 rounded-xl text-rose-600 text-[10px] font-black uppercase tracking-widest shadow-sm">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!filtered.length && <div className="py-20 text-center opacity-30 text-[10px] font-black uppercase tracking-widest"><Inbox className="mx-auto mb-2" /> Vault Empty</div>}
    </div>
  );
};

export default TransactionList;