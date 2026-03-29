import React, { useMemo } from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, ChevronRight } from 'lucide-react';

const Stats = ({ transactions = [] }) => {
  const totals = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      const amt = Number(curr.amount) || 0;
      if (amt > 0) acc.income += amt;
      else acc.expense += Math.abs(amt);
      acc.balance += amt;
      return acc;
    }, { balance: 0, income: 0, expense: 0 });
  }, [transactions]);

  return (
    <div className="w-full">
      {/* MOBILE VIEW: Single Premium Card */}
      <div className="block md:hidden bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
        
        <div>
          <div className="flex items-center gap-2 mb-2 opacity-50">
            <Wallet size={12} className="text-white" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Net Balance</p>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white">
            ${totals.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
              <ArrowUpCircle size={10} /> Income
            </p>
            <p className="text-lg font-black text-white">
              ${totals.income.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </p>
          </div>
          
          <div className="w-px h-8 bg-white/10" />

          <div className="space-y-1 text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-rose-400 flex items-center justify-end gap-1">
              Expense <ArrowDownCircle size={10} />
            </p>
            <p className="text-lg font-black text-white">
              ${totals.expense.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW: 3 Column Grid */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        <StatCard 
          title="Net Balance" 
          val={totals.balance} 
          icon={Wallet} 
          colorClass="text-indigo-600" 
          isNegative={totals.balance < 0}
        />
        <StatCard 
          title="Total Income" 
          val={totals.income} 
          icon={ArrowUpCircle} 
          colorClass="text-emerald-500" 
        />
        <StatCard 
          title="Total Expenses" 
          val={totals.expense} 
          icon={ArrowDownCircle} 
          colorClass="text-rose-500" 
        />
      </div>
    </div>
  );
};

// Internal Sub-component for Desktop
const StatCard = ({ title, val, icon: Icon, colorClass, isNegative }) => (
  <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md group">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2.5 rounded-xl bg-slate-50 transition-colors group-hover:bg-white border border-transparent group-hover:border-slate-100 ${colorClass}`}>
        <Icon size={18} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</p>
    </div>
    <h3 className={`text-2xl font-black tracking-tighter ${isNegative ? 'text-rose-600' : 'text-slate-900'}`}>
      {val < 0 ? '-' : ''}${Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </h3>
  </div>
);

export default Stats;