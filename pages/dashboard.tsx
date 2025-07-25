import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Layout_2 from "../components/Layout_2";
import { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState<string | null>(null);

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
        <p className="text-gray-700">
          Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
        </p>
      </div>
    </Layout_2>
  );
}
