// pages/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Layout_2 from "../components/Layout_2";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Now that the user is logged in, fetch their role
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        // Log the error but default to client dashboard
        console.error("Error fetching user profile:", profileError);
        router.push("/dashboard");
      } else {
        if (profile.role === "admin") {
          router.push("/admin/dashboard");
        } else if (profile.role === "developer") {
          router.push("/developer-dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } else {
        router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <Layout_2>
      <div className="max-w-md mx-auto mt-24 bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
        </form>
      </div>
    </Layout_2>
  );
}