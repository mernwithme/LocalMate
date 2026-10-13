import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Mail, Lock, User, Briefcase, MapPin, ShieldCheck, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { CBE_AREAS } from '../data/mockServices';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('customer@localmate.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loggedInUser = await login(email, password);
    setLoading(false);
    if (loggedInUser) {
      if (loggedInUser.role === 'provider') {
        navigate('/dashboard/provider');
      } else if (loggedInUser.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/');
      }
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    toast.success('Reset link sent.');
    setShowForgotPassword(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 bg-white dark:bg-slate-900 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/20">
            <Wrench className="w-5 h-5 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Log In to Local<span className="text-blue-600 dark:text-blue-400">Mate</span>
          </h2>
          <p className="text-xs text-slate-500">
            "Find trusted services near you." - Coimbatore Marketplace
          </p>
        </div>

        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            One-Click Demo Accounts (Coimbatore):
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { setEmail('customer@localmate.com'); setPassword('Password123!'); }}
              className="py-1.5 text-[11px] font-bold rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => { setEmail('provider@localmate.com'); setPassword('Password123!'); }}
              className="py-1.5 text-[11px] font-bold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            >
              Provider
            </button>
            <button
              type="button"
              onClick={() => { setEmail('admin@localmate.com'); setPassword('Password123!'); }}
              className="py-1.5 text-[11px] font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
          >
            {loading ? 'Please wait...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Sign Up
          </Link>
        </p>

        {showForgotPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="glass-card w-full max-w-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Reset Password</h3>
              <p className="text-xs text-slate-500">Enter your email address to receive a password reset link.</p>

              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-sm"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('role') === 'admin') return 'admin';
      if (params.get('role') === 'provider') return 'provider';
    }
    return 'customer';
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('Peelamedu');
  const [adminSecret, setAdminSecret] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error('Please agree to the Terms and Conditions to create your account.');
      return;
    }
    setLoading(true);
    const registeredUser = await register({
      name,
      email,
      password,
      role,
      phone,
      area,
      city: 'Coimbatore',
      adminSecret: role === 'admin' ? (adminSecret.trim() || 'localmate_admin') : undefined,
    });
    setLoading(false);
    if (registeredUser) {
      if (role === 'admin' || registeredUser.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (role === 'provider' || registeredUser.role === 'provider') {
        navigate('/dashboard/provider');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 bg-white dark:bg-slate-900 shadow-xl">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Join Local<span className="text-blue-600 dark:text-blue-400">Mate</span>
          </h2>
          <p className="text-xs text-slate-500">
            Select your account type to access Coimbatore's local service network
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`p-2.5 rounded-2xl border text-center transition-all ${
              role === 'customer'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 shadow-sm ring-1 ring-blue-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300'
            }`}
          >
            <User className="w-4 h-4 mx-auto mb-1" />
            <span className="font-bold text-xs block">Customer</span>
            <span className="text-[10px] text-slate-400">Need help</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`p-2.5 rounded-2xl border text-center transition-all ${
              role === 'provider'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 shadow-sm ring-1 ring-blue-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Briefcase className="w-4 h-4 mx-auto mb-1" />
            <span className="font-bold text-xs block">Provider</span>
            <span className="text-[10px] text-slate-400">Offer jobs</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`p-2.5 rounded-2xl border text-center transition-all ${
              role === 'admin'
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-600 shadow-sm ring-1 ring-purple-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:border-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
            <span className="font-bold text-xs block">Admin</span>
            <span className="text-[10px] text-slate-400">Management</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {role === 'admin' && (
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-1.5 transition-all">
              <div className="flex items-center gap-1.5 text-purple-900 dark:text-purple-300">
                <Key className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-bold">Admin Security Passcode</span>
              </div>
              <input
                type="password"
                placeholder="Enter admin passcode (default: localmate_admin)"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-[10px] text-purple-700 dark:text-purple-400">
                Security key for administrative privileges. Default: <span className="font-mono font-bold">localmate_admin</span>
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder={role === 'admin' ? 'e.g. Administrator Name' : 'e.g. Suresh Kumar'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder={role === 'admin' ? 'admin@localmate.com' : 'you@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 98400 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Coimbatore Area
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {CBE_AREAS.filter((a) => a !== 'All Coimbatore Areas').map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-2 pt-1 text-left">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
              required
            />
            <label htmlFor="agreeTerms" className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug cursor-pointer">
              I agree to the{' '}
              <Link to="/terms" target="_blank" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" target="_blank" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Privacy Policy
              </Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all mt-2 ${
              role === 'admin'
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/25'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
            }`}
          >
            {loading
              ? 'Creating account...'
              : `Create ${role === 'admin' ? 'Administrator' : role === 'provider' ? 'Provider' : 'Customer'} Account`}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
