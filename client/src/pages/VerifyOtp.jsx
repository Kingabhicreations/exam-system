import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

export default function VerifyOtp() {
  const { verifyOtp } = useAuth();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [code, setCode] = useState('');
  const email = params.get('email') || '';

  const submit = async (e) => {
    e.preventDefault();
    try {
      const u = await verifyOtp(email, code);
      toast.success('Verified!');
      nav(u.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code');
    }
  };

  return (
    <div className="glass mx-auto max-w-md rounded-2xl p-8">
      <h1 className="text-2xl font-bold">Verify your email</h1>
      <p className="mt-2 text-sm text-slate-500">We sent a 6-digit code to <b>{email}</b>.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input className="input tracking-widest text-center text-xl" maxLength={6} value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="••••••" />
        <button className="btn-primary w-full">Verify</button>
      </form>
    </div>
  );
}
