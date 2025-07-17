// pages/submit.tsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Layout_2 from "../components/Layout_2";

export default function Submit() {
  const [form, setForm] = useState({
    title: "",
    type: "",
    description: "",
    budget: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("projects").insert([form]);

    if (error) {
      setMessage("❌ Error submitting project.");
    } else {
      setMessage("✅ Project submitted successfully!");
      setForm({
        title: "",
        type: "",
        description: "",
        budget: "",
        email: "",
      });
    }

    setLoading(false);
  };

  return (
    <Layout_2>
      <h1 className="text-2xl font-bold mb-4 text-center">Submit a Software Project</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow space-y-4"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Project Title"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Project Type (e.g., Web App, Mobile App)"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Project Description"
          required
          className="w-full p-2 border border-gray-300 rounded h-24"
        />
        <input
          name="budget"
          value={form.budget}
          onChange={handleChange}
          placeholder="Estimated Budget"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Project"}
        </button>
        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </form>
    </Layout_2>
  );
}
