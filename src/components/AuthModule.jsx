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
      let msg = 'Login failed.';
      // PocketBase error structure
      const raw = err?.data?.message || err?.message || '';
      if (!email || !password) {
        msg = 'Please enter both email and password.';
      } else if (raw.toLowerCase().includes('authenticate') || raw.toLowerCase().includes('invalid')) {
        msg = 'Invalid email or password. Please try again.';
      } else if (err?.status === 0 || raw.toLowerCase().includes('network')) {
        msg = 'Network error. Please check your connection and try again.';
      } else if (raw) {
        msg = raw;
      }
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (!email || !password || !passwordConfirm) {
        setMessage('Please fill in all fields.');
        setLoading(false);
        return;
      }
      if (password !== passwordConfirm) {
        setMessage('Passwords do not match.');
        setLoading(false);
        return;
      }
      await pb.collection('users').create({ email, password, passwordConfirm });
      setMessage('Account created! You can now log in.');
      setShowRegister(false);
      resetForms();
    } catch (err) {
      let msg = 'Account creation failed.';
      const raw = err?.data?.message || err?.message || '';
      // PocketBase field errors
      const emailErr = err?.data?.data?.email?.message || '';
      const passErr = err?.data?.data?.password?.message || '';
      if (emailErr.toLowerCase().includes('admin')) {
        msg = 'You cannot register with the admin/superuser email.';
      } else if (emailErr.toLowerCase().includes('already')) {
        msg = 'This email is already registered. Please log in or use a different email.';
      } else if (emailErr.toLowerCase().includes('invalid')) {
        msg = 'Please enter a valid email address.';
      } else if (passErr.toLowerCase().includes('short')) {
        msg = 'Password is too short. Please use a longer password.';
      } else if (passErr.toLowerCase().includes('weak')) {
        msg = 'Password is too weak. Please use a stronger password.';
      } else if (raw.toLowerCase().includes('network')) {
        msg = 'Network error. Please check your connection and try again.';
      } else if (raw) {
        msg = raw;
      }
      setMessage(msg);
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
          <div className="flex gap-3 mb-2 w-full">
            <button
              className="primary-action text-base flex-1 w-full"
              onClick={() => { setShowLogin(!showLogin); setShowRegister(false); setMessage(''); }}
            >
              Login
            </button>
            <button
              className="primary-action text-base flex-1 w-full"
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
            <div className="mt-2 text-base text-red-600 font-semibold bg-red-50 border border-red-200 rounded px-3 py-2 animate-fade-in" style={{fontFamily: 'inherit'}}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 