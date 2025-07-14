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
    <div className="card p-3 pb-2 mb-2 text-base">
      <h2 className="text-base font-bold mb-2">Authentication</h2>
      {user ? (
        <div className="flex items-center gap-3 w-full text-base text-gray-700">
          <span>Logged in as: <span className="font-mono text-gray-900">{user.email}</span></span>
          <button
            className="ml-3 primary-action text-base"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex gap-3 mb-2">
            <button
              className="primary-action text-base"
              onClick={() => { setShowLogin(!showLogin); setShowRegister(false); setMessage(''); }}
            >
              Login
            </button>
            <button
              className="primary-action text-base"
              onClick={() => { setShowRegister(!showRegister); setShowLogin(false); setMessage(''); }}
            >
              Create Account
            </button>
          </div>
          {showLogin && (
            <form onSubmit={handleLogin} className="flex flex-col gap-2 w-full animate-fade-in">
              <div>
                <label className="text-base font-semibold mb-1">Email:</label>
                <input
                  type="email"
                  className="text-base px-3 py-2 mb-2"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-base font-semibold mb-1">Password:</label>
                <input
                  type="password"
                  className="text-base px-3 py-2 mb-2"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="primary-action w-full text-base disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}
          {showRegister && (
            <form onSubmit={handleRegister} className="flex flex-col gap-2 w-full animate-fade-in">
              <div>
                <label className="text-base font-semibold mb-1">Email:</label>
                <input
                  type="email"
                  className="text-base px-3 py-2 mb-2"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-base font-semibold mb-1">Password:</label>
                <input
                  type="password"
                  className="text-base px-3 py-2 mb-2"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-base font-semibold mb-1">Confirm Password:</label>
                <input
                  type="password"
                  className="text-base px-3 py-2 mb-2"
                  placeholder="Confirm your password"
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="primary-action w-full text-base disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          )}
          {message && (
            <div className="mt-2 text-base text-yellow-700 animate-fade-in">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 