import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../API/supabase';
import { Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const Stats = () => {
  const { data: stats = { balance: 0, income: 0, expense: 0 }, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('transactions').select('amount');
      if (error) throw error;
      
      return data.reduce((acc, { amount: amt }) => {
        if (amt > 0) acc.income += amt;
        else acc.expense += Math.abs(amt);
        acc.balance += amt;
        return acc;
      }, { balance: 0, income: 0, expense: 0 });
    },
  });

  const Card = ({ title, val, icon: Icon, dark }) => (
    <div className={`p-8 rounded-[2.5rem] border transition-all ${dark ? 'bg-slate-900 border-transparent shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${dark ? 'bg-white/10' : 'bg-slate-50'}`}>
          <Icon className={dark ? 'text-white' : 'text-slate-400'} size={20} />
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</p>
      </div>
      <h3 className={`text-2xl font-black tracking-tighter ${dark ? 'text-white' : 'text-slate-900'}`}>
        {val < 0 ? '-' : val > 0 && title !== 'Net Worth' ? '+' : ''}${Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </h3>
    </div>
  );

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-[2.5rem]" />)}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Net Worth" val={stats.balance} icon={Wallet} dark />
      <Card title="Total Income" val={stats.income} icon={ArrowUpCircle} />
      <Card title="Total Expenses" val={stats.expense} icon={ArrowDownCircle} />
    </div>
  );
};

export default Stats;