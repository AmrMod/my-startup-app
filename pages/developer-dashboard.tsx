// pages/developer-dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Layout_2 from "../components/Layout_2";
import { User } from "@supabase/supabase-js";

// Extend the Project type to include the developer's email
type Project = {
  id: string;
  title: string;
  email: string;
  developer_email?: string | null;
  status?: string; 
  inserted_at: string;
};

export default function DeveloperDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Checks for user authentication and redirects if not logged in
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/login");
      } else {
        setUser(user);
      }

      setLoading(false);
    };

    getUser();
  }, [router]);

  // Fetches projects assigned to the developer
  useEffect(() => {
    const fetchAssignedProjects = async () => {
      if (!user) return;
      setProjectsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, status, inserted_at")
        .eq("developer_email", user.email) // Crucial filter for the developer
        .order("inserted_at", { ascending: false });

      if (!error && data) {
        setProjects(data as Project[]);
      }
      setProjectsLoading(false);
    };

    fetchAssignedProjects();
  }, [user]);

  // Function to update the project status in the database
  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    // Optimistic UI update: update the state immediately for a better user experience
    setProjects(projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    
    // Send the update to the Supabase database
    const { error } = await supabase
      .from("projects")
      .update({ status: newStatus })
      .eq("id", projectId);

    if (error) {
      console.error("Error updating project status:", error);
      // Revert the UI update if the API call fails
      const oldProjects = await supabase
        .from("projects")
        .select("status")
        .eq("id", projectId)
        .single();
      if (oldProjects.data) {
        setProjects(projects.map(p => p.id === projectId ? { ...p, status: oldProjects.data.status } : p));
      }
    }
  };

  if (loading) {
    return (
      <Layout_2>
        <div className="text-center mt-32 text-gray-600">Loading dashboard...</div>
      </Layout_2>
    );
  }

  return (
    <Layout_2>
      <div className="max-w-3xl mx-auto mt-24 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-4">
          Developer Dashboard
        </h1>
        <p className="text-gray-700 mb-6">
          Welcome, {user?.email}! Here are your assigned projects.
        </p>

        <h2 className="text-xl font-bold mb-2">Your Assigned Projects</h2>
        {projectsLoading ? (
          <div className="text-gray-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-gray-500">No projects assigned to you yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li key={project.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{project.title}</div>
                  <div className="text-xs text-gray-500">
                    Client: {project.email}
                  </div>
                  <div className="text-xs text-gray-500">
                    Status: {project.status ?? "Pending"}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateProjectStatus(project.id, "In Progress")}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition
                      ${project.status === "In Progress" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800 hover:bg-blue-200"}`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateProjectStatus(project.id, "Done")}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition
                      ${project.status === "Done" ? "bg-green-600 text-white" : "bg-green-100 text-green-800 hover:bg-green-200"}`}
                  >
                    Done
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout_2>
  );
}