import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/admin-login', { username, password });
      if (response.data.token) {
        // Pass the token to the login function which will store it in the state
        login(username, 'admin', {}, response.data.token);
        navigate('/admin');
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--adm-bg)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--adm-card-bg)] rounded-3xl shadow-2xl p-8 border border-[var(--adm-border)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-[var(--adm-text-primary)]" size={32} />
          </div>
          <h1 className="text-2xl font-black text-[var(--adm-text-primary)]">Admin Portal</h1>
          <p className="text-[var(--adm-text-secondary)] text-sm mt-2">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-3 border border-red-100">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--adm-text-secondary)] ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--adm-text-secondary)] transition-colors group-focus-within:text-accent" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[var(--adm-bg)] text-[var(--adm-text-primary)] border border-[var(--adm-border)] rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all placeholder:text-[var(--adm-text-secondary)]/30 admin-login-input"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--adm-text-secondary)] ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--adm-text-secondary)] transition-colors group-focus-within:text-accent" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-[var(--adm-bg)] text-[var(--adm-text-primary)] border border-[var(--adm-border)] rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all placeholder:text-[var(--adm-text-secondary)]/30 admin-login-input"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--adm-text-secondary)] hover:text-accent transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
