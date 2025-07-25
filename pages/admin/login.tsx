import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs';
import { supabase } from '../../lib/supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !data) {
      setError('Invalid credentials');
      setLoading(false);
      return;
    }

    const match = await bcrypt.compare(password, data.password_hash);
    if (!match) {
      setError('Invalid credentials');
      setLoading(false);
      return;
    }
    
    localStorage.setItem('admin_session', JSON.stringify({ email }));
    router.push('/admin/dashboard');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 w-full z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Blue‑R Admin
          </Link>
          <nav className="space-x-4">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link href="/submit" className="hover:text-blue-600">
              Submit
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow pt-24 flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          autoComplete="on"
          className="bg-white p-8 rounded shadow-md w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 border rounded"
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-3 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Blue‑R. All rights reserved.</p>
        <p>
          Built by{' '}
          <a href="https://github.com/AmrMod" className="text-blue-600 underline">
            Amir Modibbo
          </a>
        </p>
      </footer>
    </div>
  );
}