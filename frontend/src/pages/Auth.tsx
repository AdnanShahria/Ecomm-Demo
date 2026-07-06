import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { loginUser, registerUser } from '../services/api';
import {
  Mail, Lock, AlertCircle, Loader2, Eye, EyeOff,
  UserPlus, User, Phone, CheckCircle2, Shield, ArrowLeft
} from 'lucide-react';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [step] = useState<'auth' | 'otp'>('auth');

  useEffect(() => {
    if (location.pathname.includes('register')) {
      setActiveTab('register');
    } else if (location.pathname.includes('login')) {
      setActiveTab('login');
    }
  }, [location.pathname]);

  // General States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register States
  const [regForm, setRegForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [otpCode, setOtpCode] = useState('');
  const [userId, setUserId] = useState('');

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
  };

  const passwordStrength = (() => {
    const p = regForm.password;
    if (p.length === 0) return { label: '', width: '0%', color: '' };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 2) return { label: 'Weak', width: '33%', color: '#ef4444' };
    if (score <= 3) return { label: 'Fair', width: '55%', color: '#f59e0b' };
    if (score <= 4) return { label: 'Strong', width: '80%', color: '#22c55e' };
    return { label: 'Very Strong', width: '100%', color: '#10b981' };
  })();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      setError('Please enter both username/email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await loginUser({ username: loginUsername, password: loginPassword });
      login(data.username, 'user', {
        id: data.id,
        email: data.email,
        phone: data.phone,
        fullName: data.fullName,
        avatar: data.avatar,
        isVerified: data.isVerified,
      }, data.token);
      navigate('/account');
    } catch (err: unknown) {
      const errorData = err as { response?: { data?: { message?: string } }; message?: string };
      const message = errorData?.response?.data?.message || errorData?.message || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const autoLogin = async () => {
    try {
      const data = await loginUser({ username: regForm.username, password: regForm.password });
      login(data.username, 'user', {
        id: data.id,
        email: data.email,
        phone: data.phone,
        fullName: data.fullName,
        avatar: data.avatar,
        isVerified: data.isVerified,
      }, data.token);
      navigate('/account');
    } catch {
      setActiveTab('login');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (regForm.password !== regForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (regForm.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!regForm.username.match(/^[a-zA-Z0-9_]{3,20}$/)) {
      setError('Username must be 3-20 characters (letters, numbers, underscores only).');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({
        username: regForm.username,
        password: regForm.password,
        email: regForm.email || undefined,
        phone: regForm.phone || undefined,
        fullName: regForm.fullName || undefined,
      });

      setUserId(data.id);
      await autoLogin();
    } catch (err: unknown) {
      const errorData = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = errorData?.response?.data?.message || errorData?.message || 'Registration failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('Please enter a valid OTP code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      await autoLogin();
    } catch (err: unknown) {
      const message = (err as Error).message || 'Verification failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await fetch('/api/v1/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      setError('');
    } catch {
      // Silent fail for resend
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-[2rem] shadow-2xl shadow-primary/5 border border-gray-100">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center mb-3">
              <Shield className="text-green-500" size={24} />
            </div>
            <h2 className="text-2xl font-black text-primary tracking-tight font-garamond">Verify Your Email</h2>
            <p className="mt-1 text-sm text-muted font-medium">
              We've sent a verification code to<br />
              <strong className="text-primary">{regForm.email}</strong>
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Verification Code</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-2xl font-black text-center tracking-[0.5em] placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all bg-gray-50/50"
                placeholder="000000"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length < 4}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all shadow-xl shadow-green-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Verifying...</span>
              ) : 'Verify & Continue'}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[10px] text-muted">
              Didn't receive the code?{' '}
              <button onClick={handleResendOtp} className="font-black text-accent hover:text-accent-dark underline decoration-2 underline-offset-4">
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      
      <div className="max-w-md w-full relative z-10">
        
        {/* Unified Card Body */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-primary/5 border border-gray-100 relative z-10 overflow-hidden">
          
          {/* Integrated Tabs inside the card */}
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button
              onClick={() => { setActiveTab('login'); setError(''); setShowPassword(false); }}
              className={`flex-1 py-4 text-center text-sm font-bold transition-all duration-200 border-r border-gray-100 relative ${
                activeTab === 'login'
                  ? 'bg-white text-blue-600'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 bg-gray-50/50'
              }`}
            >
              Login
              {activeTab === 'login' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => { setActiveTab('register'); setError(''); setShowPassword(false); }}
              className={`flex-1 py-4 text-center text-sm font-bold transition-all duration-200 relative ${
                activeTab === 'register'
                  ? 'bg-white text-blue-600'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 bg-gray-50/50'
              }`}
            >
              Register
              {activeTab === 'register' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>

          {/* Form Content Wrapper */}
          <div className="p-8 sm:p-10">
            {error && (
              <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-100 animate-in fade-in zoom-in-95">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="text-center mb-8">
                  <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
                    <User className="text-blue-500" size={28} />
                  </div>
                  <h2 className="text-3xl font-black text-primary tracking-tight font-garamond">Welcome Back</h2>
                  <p className="mt-1.5 text-sm text-muted font-medium">Sign in to your account</p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-600 ml-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          required
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-[#F8FAFC]"
                          placeholder="nisar.ruet@gmail.com"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-600 ml-1">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="block w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-[#F8FAFC]"
                          placeholder="••••••••••••"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-[#1D4ED8] hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Signing in...</span>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>
                
                <div className="text-center mt-6">
                  <button 
                    onClick={() => setActiveTab('register')}
                    className="text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-800 transition-colors">
                    <ArrowLeft size={14} /> Back to Home
                  </Link>
                </div>
              </div>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-6">
                  <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
                    <UserPlus className="text-blue-500" size={28} />
                  </div>
                  <h2 className="text-2xl font-black text-primary tracking-tight font-garamond">Create Account</h2>
                  <p className="mt-1 text-xs text-muted font-medium">Join Aurelia for the best baby products</p>
                </div>

                <form className="space-y-4" onSubmit={handleRegister}>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600 ml-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={regForm.fullName}
                        onChange={handleRegChange}
                        className="block w-full pl-10 pr-3.5 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-[#F8FAFC]"
                        placeholder="John Doe"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600 ml-1">Username *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-gray-400 font-bold text-sm">@</span>
                      </div>
                      <input
                        type="text"
                        name="username"
                        required
                        value={regForm.username}
                        onChange={handleRegChange}
                        className="block w-full pl-10 pr-3.5 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-[#F8FAFC]"
                        placeholder="john_doe"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-600 ml-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={regForm.email}
                          onChange={handleRegChange}
                          className="block w-full pl-9 pr-3.5 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-[#F8FAFC]"
                          placeholder="john@mail.com"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-600 ml-1">Phone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={regForm.phone}
                          onChange={handleRegChange}
                          className="block w-full pl-9 pr-3.5 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-[#F8FAFC]"
                          placeholder="+880 1XXXXXXXXX"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600 ml-1">Password *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        required
                        value={regForm.password}
                        onChange={handleRegChange}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-[#F8FAFC]"
                        placeholder="Min 6 characters"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {regForm.password && (
                      <div className="flex items-center gap-2 mt-1.5 px-1">
                        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: passwordStrength.width, backgroundColor: passwordStrength.color }}
                          />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-600 ml-1">Confirm Password *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={regForm.confirmPassword}
                        onChange={handleRegChange}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-[#F8FAFC]"
                        placeholder="Re-type password"
                        disabled={loading}
                      />
                      {regForm.confirmPassword && regForm.password === regForm.confirmPassword && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white bg-[#1D4ED8] hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Creating account...</span>
                    ) : 'Sign Up'}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <button 
                    onClick={() => setActiveTab('login')}
                    className="text-[13px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Already have an account? Sign in
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-800 transition-colors">
                    <ArrowLeft size={14} /> Back to Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
