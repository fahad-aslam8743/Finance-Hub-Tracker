import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../API/supabase';
import { Command, Loader2, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ 
    mode: 'onBlur' 
  });

  const onSubmit = async ({ email, password }) => {
    toast.dismiss();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        toast.success('Welcome Back!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Command size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase italic">FinanceHub</h2>
        </div>
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800">Login</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Email</label>
              <div className={`flex items-center bg-slate-50 border rounded-xl px-4 py-3 transition-all ${errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-100 focus-within:border-indigo-500 focus-within:bg-white'}`}>
                <Mail size={16} className={errors.email ? 'text-rose-400 mr-3' : 'text-slate-300 mr-3'} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-transparent text-sm font-bold outline-none text-slate-700 placeholder:text-slate-300"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                  })}
                />
              </div>
              {errors.email && <p className="text-[9px] font-bold text-rose-500 uppercase ml-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className={`flex items-center bg-slate-50 border rounded-xl px-4 py-3 transition-all ${errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-100 focus-within:border-indigo-500 focus-within:bg-white'}`}>
                <Lock size={16} className={errors.password ? 'text-rose-400 mr-3' : 'text-slate-300 mr-3'} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm font-bold outline-none text-slate-700 placeholder:text-slate-300"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 8, message: "Must be at least 8 characters" }
                  })}
                />
              </div>
              {errors.password && <p className="text-[9px] font-bold text-rose-500 uppercase ml-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.password.message}</p>}
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : (
                <>
                  Enter Dashboard
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-50 pt-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              No account? 
              <Link to="/signup" className="ml-2 text-indigo-600 hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;