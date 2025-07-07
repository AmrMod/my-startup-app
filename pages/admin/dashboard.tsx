import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Fetch projects on mount
  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('inserted_at', { ascending: false });
      if (!error) setProjects(data);
    }
    loadProjects();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Blue‑R Admin</h1>
          <nav className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/submit" className="hover:text-blue-600">Submit Project</Link>
            <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
              Logout
            </button>
          </nav>
          <button onClick={toggleMenu} className="md:hidden text-gray-800 focus:outline-none">
            {/* Hamburger Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-sm shadow py-2 px-6 space-y-2">
            <Link href="/" onClick={toggleMenu} className="block hover:text-blue-600 py-2">Home</Link>
            <Link href="/submit" onClick={toggleMenu} className="block hover:text-blue-600 py-2">Submit Project</Link>
            <button onClick={() => { handleLogout(); toggleMenu(); }} className="block text-red-600 text-left w-full">Logout</button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-6 px-6 bg-gray-50">
  <h2 className="text-3xl font-bold mb-4">Project Submissions</h2>
  <div className="overflow-x-auto">
    <table className="table-fixed w-full bg-white rounded-lg shadow">
      <thead>
        <tr className="bg-blue-600 text-white">
          <th className="w-1/12 py-2 px-4 text-left">ID</th>
          <th className="w-3/12 py-2 px-4 text-left">Title</th>
          <th className="w-2/12 py-2 px-4 text-left">Type</th>
          <th className="w-3/12 py-2 px-4 text-left">Email</th>
          <th className="w-3/12 py-2 px-4 text-left">Submitted At</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((proj: any) => (
          <tr key={proj.id} className="border-b hover:bg-gray-100">
            <td className="py-2 px-4 text-left">{proj.id}</td>
            <td className="py-2 px-4 text-left">{proj.title}</td>
            <td className="py-2 px-4 text-left">{proj.type}</td>
            <td className="py-2 px-4 text-left">{proj.email}</td>
            <td className="py-2 px-4 text-left">
              {new Date(proj.inserted_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</main>


      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Blue‑R Admin. Built by Amir Modibbo.
      </footer>
    </div>
  );
}
