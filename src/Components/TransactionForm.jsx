import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../API/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Tag, ArrowRight, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionForm = ({ editingData, onSuccess }) => {
  const queryClient = useQueryClient();
  const [type, setType] = useState('expense');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (editingData) {
      setType(editingData.amount > 0 ? 'income' : 'expense');
      reset({ name: editingData.name, amount: Math.abs(editingData.amount) });
    } else {
      reset({ name: '', amount: '' });
      setType('expense');
    }
  }, [editingData, reset]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const { data: { user } } = await supabase.auth.getUser();
      const amount = type === 'income' ? Math.abs(data.amount) : -Math.abs(data.amount);
      const payload = { name: data.name, amount, user_id: user.id };
      
      const { error } = editingData 
        ? await supabase.from('transactions').update(payload).eq('id', editingData.id)
        : await supabase.from('transactions').insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      toast.success(editingData ? 'Updated' : 'Confirmed');
      onSuccess();
    }
  });

  const InputWrap = ({ children, err, icon: Icon }) => (
    <div className={`flex items-center bg-slate-50 border rounded-xl px-4 py-3 transition-all ${err ? 'border-rose-200' : 'border-slate-100 focus-within:border-slate-900 focus-within:bg-white'}`}>
      {Icon && <Icon size={16} className="text-slate-300 mr-3" />}
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4 max-w-sm mx-auto">
      <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
        {['income', 'expense'].map(t => (
          <button key={t} type="button" onClick={() => setType(t)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${type === t ? 'bg-white shadow-sm ' + (t === 'income' ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-400'}`}>
            {t === 'income' ? <Plus size={14}/> : <Minus size={14}/>} {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <InputWrap err={errors.name} icon={Tag}>
          <input {...register("name", { required: true })} placeholder="Description" className="w-full bg-transparent text-sm font-semibold outline-none text-slate-700" />
        </InputWrap>

        <InputWrap err={errors.amount}>
          <span className="text-sm font-black text-slate-300 mr-3">$</span>
          <input type="number" step="0.01" {...register("amount", { required: true, valueAsNumber: true })} placeholder="0.00" className="w-full bg-transparent text-sm font-bold outline-none text-slate-700" />
        </InputWrap>
      </div>

      <button disabled={mutation.isPending} className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 text-white shadow-lg ${type === 'income' ? 'bg-emerald-500' : 'bg-slate-900'}`}>
        {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <>{editingData ? 'Update Ledger' : 'Authorize Entry'} <ArrowRight size={14} /></>}
      </button>
    </form>
  );
};

export default TransactionForm;