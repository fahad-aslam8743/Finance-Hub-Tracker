import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../API/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Tag, ArrowRight, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionForm = ({ editingData, onSuccess }) => {
  const queryClient = useQueryClient();
  const [type, setType] = useState('expense');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { name: '', amount: '' }
  });

  useEffect(() => {
    if (editingData) {
      setType(editingData.amount > 0 ? 'income' : 'expense');
      setValue('name', editingData.name);
      setValue('amount', Math.abs(editingData.amount));
    } else {
      reset();
    }
  }, [editingData, setValue, reset]);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      toast.dismiss();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const finalAmount = type === 'income' 
        ? Math.abs(parseFloat(formData.amount)) 
        : -Math.abs(parseFloat(formData.amount));
      const payload = {
        name: formData.name,     
        amount: finalAmount,      
        user_id: user.id,        
        created_at: editingData ? editingData.created_at : new Date().toISOString(),
      };

      const { error } = editingData 
        ? await supabase.from('transactions').update(payload).eq('id', editingData.id)
        : await supabase.from('transactions').insert([payload]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      toast.success(editingData ? 'Updated' : 'Confirmed');
      reset();
      onSuccess();
    },
    onError: (error) => toast.error(error.message)
  });

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-4">
        <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100">
          <button type="button" onClick={() => setType('income')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}><Plus size={14}/> Income</button>
          <button type="button" onClick={() => setType('expense')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}><Minus size={14}/> Expense</button>
        </div>
        <div className="space-y-3">
          <div className={`flex items-center bg-slate-50 border rounded-xl px-4 py-3 ${errors.name ? 'border-rose-200' : 'border-slate-100 focus-within:border-indigo-500 focus-within:bg-white'}`}>
            <Tag size={16} className="text-slate-300 mr-3" /><input {...register("name", { required: true })} placeholder="Description" className="w-full bg-transparent text-sm font-semibold outline-none text-slate-700" />
          </div>
          <div className={`flex items-center bg-slate-50 border rounded-xl px-4 py-3 ${errors.amount ? 'border-rose-200' : 'border-slate-100 focus-within:border-indigo-500 focus-within:bg-white'}`}>
            <span className="text-sm font-black text-slate-400 mr-3">$</span><input type="number" step="0.01" {...register("amount", { required: true, min: 0.01 })} placeholder="0.00" className="w-full bg-transparent text-sm font-bold outline-none text-slate-700" />
          </div>
        </div>
        <button disabled={mutation.isPending} type="submit" className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-white shadow-lg ${type === 'income' ? 'bg-emerald-500' : 'bg-slate-900'}`}>
          {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <>{editingData ? 'Save Changes' : 'Add Record'} <ArrowRight size={14} /></>}
        </button>
      </form>
    </div>
  );
};
export default TransactionForm;