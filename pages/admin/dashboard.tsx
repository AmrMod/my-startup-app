// pages/admin/dashboard.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

// Add the Project type and a new type for the developer profile
type Project = {
  id: number;
  title: string;
  type: string;
  email: string;
  inserted_at: string;
  status?: string;
  developer_email?: string | null;
};

type DeveloperProfile = {
  id: string;
  name: string;
  email: string;
};

export default function Admin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<DeveloperProfile[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newDeveloper, setNewDeveloper] = useState({ email: '', password: '', name: '' });
  const [addDevError, setAddDevError] = useState('');
  const [addDevSuccess, setAddDevSuccess] = useState('');
  const router = useRouter();

  // Load projects and developers
  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('inserted_at', { ascending: false });

      if (!error && data) setProjects(data as Project[]);
    }

    async function loadDevelopers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email')
        .eq('role', 'developer');

      if (!error && data) setDevelopers(data as DeveloperProfile[]);
    }

    loadProjects();
    loadDevelopers();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === id ? { ...proj, status: newStatus } : proj
        )
      );
    }
  };

  const handleAssignDeveloper = async (projectId: number, developerEmail: string) => {
    // Optimistically update the UI
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === projectId ? { ...proj, developer_email: developerEmail } : proj
      )
    );

    const { error } = await supabase
      .from('projects')
      .update({ developer_email: developerEmail })
      .eq('id', projectId);

    if (error) {
      // Revert the UI update if the API call fails
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === projectId ? { ...proj, developer_email: null } : proj
        )
      );
      console.error('Error assigning developer:', error);
    }
  };

  const handleAddDeveloper = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddDevError('');
    setAddDevSuccess('');

    const response = await fetch('/api/admin/add-developer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDeveloper),
    });

    const result = await response.json();

    if (response.ok) {
      setAddDevSuccess(result.message);
      // After successful creation, clear the form and refresh the developer list
      setNewDeveloper({ email: '', password: '', name: '' });
      const { data } = await supabase.from('profiles').select('id, name, email').eq('role', 'developer');
      if (data) setDevelopers(data as DeveloperProfile[]);
    } else {
      setAddDevError(result.error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
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
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Logout</button>
          </nav>
          <button onClick={toggleMenu} className="md:hidden text-gray-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-sm shadow py-2 px-6 space-y-2">
            <Link href="/" onClick={toggleMenu} className="block hover:text-blue-600 py-2">Home</Link>
            <Link href="/submit" onClick={toggleMenu} className="block hover:text-blue-600 py-2">Submit Project</Link>
            <button onClick={() => { handleLogout(); toggleMenu(); }} className="block text-red-600 text-left w-full">
              Logout
            </button>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 pt-24 pb-6 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>

        {/* Add Developer Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Add New Developer</h3>
          <form onSubmit={handleAddDeveloper} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Developer Name"
                value={newDeveloper.name}
                onChange={(e) => setNewDeveloper({ ...newDeveloper, name: e.target.value })}
                className="p-3 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Developer Email"
                value={newDeveloper.email}
                onChange={(e) => setNewDeveloper({ ...newDeveloper, email: e.target.value })}
                className="p-3 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Temporary Password"
                value={newDeveloper.password}
                onChange={(e) => setNewDeveloper({ ...newDeveloper, password: e.target.value })}
                className="p-3 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Developer
            </button>
          </form>
          {addDevError && <p className="text-red-500 mt-2">{addDevError}</p>}
          {addDevSuccess && <p className="text-green-500 mt-2">{addDevSuccess}</p>}
        </div>

        {/* Project Submissions Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Project Submissions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="min-w-[40px] py-2 px-4 text-left">ID</th>
                  <th className="min-w-[160px] py-2 px-4 text-left">Title</th>
                  <th className="min-w-[120px] py-2 px-4 text-left">Type</th>
                  <th className="min-w-[200px] py-2 px-4 text-left">Email</th>
                  <th className="min-w-[180px] py-2 px-4 text-left">Submitted At</th>
                  <th className="min-w-[120px] py-2 px-4 text-left">Status</th>
                  <th className="min-w-[120px] py-2 px-4 text-left">Assign Dev</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4">{proj.id}</td>
                    <td className="py-2 px-4 break-words">{proj.title}</td>
                    <td className="py-2 px-4 break-words">{proj.type}</td>
                    <td className="py-2 px-4 break-words">{proj.email}</td>
                    <td className="py-2 px-4 whitespace-nowrap">{new Date(proj.inserted_at).toLocaleString()}</td>
                    <td className="py-2 px-4">
                      <select
                        value={proj.status}
                        onChange={(e) => handleStatusChange(proj.id, e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-md p-1 text-sm"
                      >
                        <option value="">Select status</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-2 px-4">
                      <select
                        value={proj.developer_email || ''}
                        onChange={(e) => handleAssignDeveloper(proj.id, e.target.value)}
                        className="bg-gray-50 border border-gray-300 rounded-md p-1 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {developers.map((dev) => (
                          <option key={dev.id} value={dev.email}>
                            {dev.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Blue‑R Admin. Built by Amir Modibbo.
      </footer>
    </div>
  );
}