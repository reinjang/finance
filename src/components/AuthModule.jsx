import React, { useState } from 'react';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://<your-domain>/pb'); // TODO: Replace with your actual domain

export default function AuthModule() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(pb.authStore.model);

  React.useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    });
    return unsubscribe;
  }, []);

  const resetForms = () => {
    setEmail('');
    setPassword('');
    setPasswordConfirm('');
    setMessage('');
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await pb.collection('users').authWithPassword(email, password);
      setMessage('Login successful!');
      setShowLogin(false);
      resetForms();
    } catch (err) {
      setMessage(err?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await pb.collection('users').create({ email, password, passwordConfirm });
      setMessage('Account created! You can now log in.');
      setShowRegister(false);
      resetForms();
    } catch (err) {
      setMessage(err?.message || 'Account creation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    pb.authStore.clear();
    setUser(null);
    setMessage('Logged out.');
  };

  return (
    <div className="w-full flex flex-col items-start px-2 pt-2 pb-0 bg-transparent text-sm">
      {user ? (
        <div className="flex items-center gap-2 w-full text-xs text-gray-300">
          <span>Logged in as: <span className="font-mono text-cyan-300">{user.email}</span></span>
          <button
            className="ml-2 px-2 py-0.5 bg-gray-700 hover:bg-gray-800 text-xs text-white rounded transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-1 w-full">
          <div className="flex gap-2 mb-1">
            <button
              className="px-2 py-0.5 bg-cyan-500 hover:bg-cyan-600 text-xs text-white rounded transition"
              onClick={() => { setShowLogin(!showLogin); setShowRegister(false); setMessage(''); }}
            >
              Login
            </button>
            <button
              className="px-2 py-0.5 bg-pink-500 hover:bg-pink-600 text-xs text-white rounded transition"
              onClick={() => { setShowRegister(!showRegister); setShowLogin(false); setMessage(''); }}
            >
              Create Account
            </button>
          </div>
          {showLogin && (
            <form onSubmit={handleLogin} className="flex flex-col gap-1 w-full animate-fade-in">
              <input
                type="email"
                className="w-full px-2 py-1 rounded bg-gray-800 text-xs text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full px-2 py-1 rounded bg-gray-800 text-xs text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-1 bg-cyan-500 hover:bg-cyan-600 text-xs text-white rounded transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}
          {showRegister && (
            <form onSubmit={handleRegister} className="flex flex-col gap-1 w-full animate-fade-in">
              <input
                type="email"
                className="w-full px-2 py-1 rounded bg-gray-800 text-xs text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full px-2 py-1 rounded bg-gray-800 text-xs text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full px-2 py-1 rounded bg-gray-800 text-xs text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-1 bg-pink-500 hover:bg-pink-600 text-xs text-white rounded transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          )}
          {message && (
            <div className="mt-1 text-xs text-yellow-300 animate-fade-in">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 