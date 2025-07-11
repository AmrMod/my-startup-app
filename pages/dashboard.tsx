import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Layout from "../components/Layout";
import { User } from "@supabase/supabase-js"; // ✅ Import User type

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // ✅ Use proper type
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-32 text-gray-600">Loading dashboard...</div>
      </Layout>
    );
  }

  return (
  <Layout>
    <div className="max-w-3xl mx-auto mt-24 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome, {user?.user_metadata?.name ?? "Client"}!
      </h1>
      <p className="text-gray-700 mb-2">Email: {user?.email}</p>
      <p className="text-gray-700">
        Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
      </p>
    </div>
  </Layout>
);
}
