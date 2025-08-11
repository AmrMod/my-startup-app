import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Layout_2 from "../components/Layout_2";
import { User } from "@supabase/supabase-js";

type Project = {
  id: string;
  title: string;
  email: string;
  inserted_at: string;
  status?: string; 
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfileName(data.name);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      setProjectsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, email, inserted_at, status") 
        .eq("email", user.email)
        .order("inserted_at", { ascending: false });

      if (!error && data) {
        setProjects(data as Project[]);
      }
      setProjectsLoading(false);
    };

    fetchProjects();
  }, [user]);

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
          Welcome, {profileName}
        </h1>
        <p className="text-gray-700 mb-2">Email: {user?.email}</p>
        <p className="text-gray-700 mb-6">
          Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
        </p>

        <h2 className="text-xl font-bold mb-2">Your Submitted Projects</h2>
        {projectsLoading ? (
          <div className="text-gray-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-gray-500">No projects submitted yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => (
              <li key={project.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{project.title}</div>
                  <div className="text-xs text-gray-500">
                    Submitted: {new Date(project.inserted_at).toLocaleDateString()}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${project.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    project.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                    project.status === "Done" ? "bg-green-100 text-green-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                  {project.status ?? "Pending"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout_2>
  );
}
