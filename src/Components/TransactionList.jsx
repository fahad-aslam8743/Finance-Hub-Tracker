import React, { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import { Trash2, Edit3, Loader2, Search, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionList = ({ transactions = [], isLoading, onEdit }) => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { mutate: deleteTx, isLoading: isDeletingTx, variables: deletingId } = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      toast.success('Deleted Successfully');
    }
  });


  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const isIncome = t.amount > 0;
      const typeMatch =filter === 'all' ||(filter === 'income' ? isIncome : !isIncome);
      const searchMatch = t.name?.toLowerCase().includes(search.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [transactions, filter, search]);

  if (isLoading && !transactions.length) {return <Loader2 className="mx-auto animate-spin py-20 opacity-40" />}

  return (
    <div className="w-full space-y-4">
      <div className="p-3 bg-white/30 backdrop-blur-xl border border-white/60 rounded-2xl space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions..."className="w-full pl-10 pr-4 py-2 bg-white/40 rounded-xl text-xs font-bold outline-none"/>
        </div>

        <div className="flex gap-2">
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition ${
                filter === f
                  ? 'bg-black text-white'
                  : 'bg-white/50 text-slate-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 📋 TRANSACTION LIST */}
      <div className="space-y-3">

        {filtered.map((t) => {
          const isIncome = t.amount > 0;
          const isDeleting = isDeletingTx && deletingId === t.id;
          return (
            <div
              key={t.id} className={`flex items-center justify-between p-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-xl ${isDeleting ? 'opacity-50' : ''}`}>
              
              <div>
                <p className="text-sm font-bold text-slate-800 capitalize">
                  {t.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {new Date(t.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p
                  className={`text-sm font-bold ${
                    isIncome ? 'text-green-600' : 'text-red-500'
                  }`}>
                  {isIncome ? '+' : '-'}$
                  {Math.abs(t.amount)}
                </p>
                <button
                  disabled={isDeleting} onClick={() => onEdit(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit3 size={16} />
                </button>

                <button
                  disabled={isDeleting} onClick={() => deleteTx(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  {isDeleting ? (<Loader2 size={16} className="animate-spin" />) : (<Trash2 size={16} />)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {!filtered.length && (
        <div className="py-20 text-center opacity-40 text-xs font-bold">
          <Inbox className="mx-auto mb-2" />
          No Transactions Found
        </div>
      )}
    </div>
  );
};

export default TransactionList;
