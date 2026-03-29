import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsChart = ({ transactions = [] }) => {
  const [days, setDays] = useState(30);

  const chartData = useMemo(() => {
    const dataMap = {};
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dataMap[label] = { date: label, income: 0, expense: 0 };
    }
    transactions.forEach(t => {
      const d = new Date(t.created_at);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dataMap[label]) {
        const amt = Number(t.amount);
        amt > 0 ? (dataMap[label].income += amt) : (dataMap[label].expense += Math.abs(amt));
      }
    });
    return Object.values(dataMap);
  }, [transactions, days]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm space-y-6">
      {/* 1. CSS STRIKE: This removes the blue/black focus ring from the SVG itself */}
      <style>{`
        .recharts-surface:focus {
          outline: none !important;
        }
        .recharts-wrapper:focus {
          outline: none !important;
        }
        path.recharts-rectangle {
          outline: none !important;
        }
      `}</style>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-black text-slate-900">Cash Flow</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Performance</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setDays(d)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${days === d ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
              {d}D
            </button>
          ))}
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer>
          <AreaChart 
            data={chartData} 
            margin={{ left: -40, right: 0, top: 10, bottom: 0 }}
            accessibilityLayer={false} // 2. DISABLES the keyboard/click focus layer
          >
            <defs>
              <linearGradient id="p-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} minTickGap={30} />
            <YAxis hide />

            <Tooltip 
              cursor={false}
              wrapperStyle={{ outline: 'none' }}
              contentStyle={{ border: 'none', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
            />

            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={3} 
              fill="url(#p-grad)" 
              activeDot={false} // 3. ENSURES no dot outline on click
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              stroke="#f43f5e" 
              strokeWidth={2} 
              strokeDasharray="5 5" 
              fill="transparent" 
              activeDot={false} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;