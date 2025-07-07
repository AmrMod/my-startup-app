// pages/admin/index.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const AdminDashboard = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*');

      if (error) {
        console.error("Error fetching projects:", error);
        setError("Error loading projects.");
      } else {
        setProjects(data || []);
      }

      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {loading ? (
        <p className="text-center">Loading projects...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-500">No submitted projects yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full table-auto border">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Budget</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">{proj.title}</td>
                  <td className="p-2 border">{proj.type}</td>
                  <td className="p-2 border">{proj.description}</td>
                  <td className="p-2 border">{proj.budget || '—'}</td>
                  <td className="p-2 border">{proj.email}</td>
                  <td className="p-2 border">
                    {new Date(proj.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
