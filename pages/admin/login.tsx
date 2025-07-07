// pages/admin/login.tsx
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs'; // Make sure bcryptjs is installed

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Fetch admin user
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

    // Save session (simple example)
    localStorage.setItem('admin_session', JSON.stringify({ email }));
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
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
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
