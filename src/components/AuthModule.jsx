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

  // Listen for auth changes
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
    <div className="w-full max-w-md mx-auto mt-8 p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-center text-cyan-400 mb-4">User Authentication</h2>
      {user ? (
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="text-cyan-200 text-lg">Logged in as: <span className="font-mono">{user.email}</span></div>
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-center gap-4 mb-4">
            <button
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded transition"
              onClick={() => { setShowLogin(!showLogin); setShowRegister(false); setMessage(''); }}
            >
              Login
            </button>
            <button
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded transition"
              onClick={() => { setShowRegister(!showRegister); setShowLogin(false); setMessage(''); }}
            >
              Create Account
            </button>
          </div>
          {showLogin && (
            <form onSubmit={handleLogin} className="space-y-3 animate-fade-in">
              <input
                type="email"
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}
          {showRegister && (
            <form onSubmit={handleRegister} className="space-y-3 animate-fade-in">
              <input
                type="email"
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          )}
        </>
      )}
      {message && (
        <div className="mt-4 text-center text-sm text-yellow-300 animate-fade-in">
          {message}
        </div>
      )}
    </div>
  );
} 