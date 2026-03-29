import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2, Mail, Lock, UserPlus, ArrowRight, AlertCircle, User } from 'lucide-react'; // Added User icon
import { supabase } from '../API/supabase';
import toast from 'react-hot-toast';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur'
  });

  const onSubmit = async ({ email, password, full_name }) => {
    toast.dismiss();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          // This saves the name into user_metadata so the Dashboard can read it
          data: { 
            full_name: full_name,
            display_name: full_name 
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success('Account Created!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <UserPlus size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase italic">Join FinanceHub</h2>
        </div>
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800">Create Account</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Start tracking your finances today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Full Name Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className={`flex items-center bg-slate-50 border rounded-xl px-4 py-3 transition-all ${errors.full_name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-100 focus-within:border-indigo-500 focus-within:bg-white'}`}>
                <User size={16} className={errors.full_name ? 'text-rose-400 mr-3' : 'text-slate-300 mr-3'} />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-transparent text-sm font-bold outline-none text-slate-700 placeholder:text-slate-300"
                  {...register("full_name", { 
                    required: "Name is required",
                    minLength: { value: 2, message: "Name is too short" }
                  })}/>
              </div>
              {errors.full_name && <p className="text-[9px] font-bold text-rose-500 uppercase ml-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.full_name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className={`flex items-center bg-slate-50 border rounded-xl px-4 py-3 transition-all ${errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-100 focus-within:border-indigo-500 focus-within:bg-white'}`}>
                <Mail size={16} className={errors.email ? 'text-rose-400 mr-3' : 'text-slate-300 mr-3'} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-transparent text-sm font-bold outline-none text-slate-700 placeholder:text-slate-300"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                  })}/>
              </div>
              {errors.email && <p className="text-[9px] font-bold text-rose-500 uppercase ml-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Set Password</label>
              <div className={`flex items-center bg-slate-50 border rounded-xl px-4 py-3 transition-all ${errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-100 focus-within:border-indigo-500 focus-within:bg-white'}`}>
                <Lock size={16} className={errors.password ? 'text-rose-400 mr-3' : 'text-slate-300 mr-3'} />
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  className="w-full bg-transparent text-sm font-bold outline-none text-slate-700 placeholder:text-slate-300"
                  {...register("password", { 
                    required: "Password is required", 
                    minLength: { value: 8, message: "Must be at least 8 characters" } 
                  })}/>
              </div>
              {errors.password && <p className="text-[9px] font-bold text-rose-500 uppercase ml-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.password.message}</p>}
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg mt-2">
              {loading ? <Loader2 className="animate-spin" size={18}/> : (
                <>
                  Get Started
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
          <div className="mt-8 text-center border-t border-slate-50 pt-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Already a partner? 
              <Link to="/login" className="ml-2 text-indigo-600 hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;