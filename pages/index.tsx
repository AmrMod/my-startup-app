// pages/index.tsx
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Layout from "../components/Layout";

export default function Home() {
  const [quickQuoteForm, setQuickQuoteForm] = useState({
    title: "",
    email: "",
    description: "",
  });
  const [loadingQuickQuote, setLoadingQuickQuote] = useState(false);
  const [quickQuoteMessage, setQuickQuoteMessage] = useState("");

  const handleQuickQuoteChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setQuickQuoteForm({ ...quickQuoteForm, [e.target.name]: e.target.value });
  };

  const handleQuickQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingQuickQuote(true);
    setQuickQuoteMessage("");

    const { title, email, description } = quickQuoteForm;
    const { error } = await supabase.from("projects").insert([
      {
        title,
        email,
        description,
      },
    ]);

    if (error) {
      console.error("Error submitting quick quote:", error);
      setQuickQuoteMessage("❌ Error submitting your request. Please try again.");
    } else {
      setQuickQuoteMessage("✅ Your request has been sent! We'll get back to you soon.");
      setQuickQuoteForm({ title: "", email: "", description: "" });
    }

    setLoadingQuickQuote(false);
  };

  return (
    <Layout>
      {/* Hero */}
      {/* Hero */}
<section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white">
  <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center">
    <div className="md:w-1/2 space-y-6">
      <h1 className="text-5xl font-extrabold text-blue-700">
        Professional Web Development & Maintenance
      </h1>
      <p className="text-lg text-gray-700">
        Blue‑R delivers custom software solutions and ongoing website care so you can focus
        on growing your business.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/register" className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition">
          Register
        </Link>
        <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
          Login
        </Link>
      </div>
    </div>

    <div className="md:w-1/2 mt-8 md:mt-0">
      <div className="w-full">
        <Image
          src="/Blue-R.png"
          alt="Web development illustration"
          width={500}
          height={400}
          className="mx-auto object-contain"
        />
      </div>
    </div>
  </div>
</section>


      {/* Features */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">What We Offer</h2>
          <p className="text-gray-600 mt-2">
            From full-stack builds to performance tuning and support.
          </p>
        </div>
        <div className="max-w-5xl mx-auto px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['💡', 'Custom Builds', 'Tailored web apps & sites'],
            ['🔧', 'Maintenance', 'Regular updates, bug fixes'],
            ['⚡', 'Performance', 'Speed optimization & SEO'],
            ['🔒', 'Security', 'Vulnerability assessments'],
            ['📈', 'Analytics', 'Data-driven insights'],
            ['🤝', 'Support', '24/7 SLA-backed help'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="p-6 border rounded-lg hover:shadow-lg transition">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Trusted by Clients</h2>
        </div>
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {[
            ['\u201cBlue‑R built our new site in weeks and handles all updates flawlessly.\u201d', '— Jane Doe, CEO of Acme Corp'],
            ['\u201cTheir team optimized our performance by 50% and secured our data.\u201d', '— John Smith, CTO of TechCo'],
          ].map(([quote, author], i) => (
            <blockquote key={i} className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-700 italic mb-4">{quote}</p>
              <footer className="text-gray-500">{author}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Quick Quote Form */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Need a quick chat?</h2>
          <p className="text-gray-600">Tell us the basics and we’ll get back to you ASAP.</p>
        </div>
        <form
          onSubmit={handleQuickQuoteSubmit}
          className="max-w-3xl mx-auto px-6 grid gap-4 sm:grid-cols-2"
        >
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={quickQuoteForm.title}
            onChange={handleQuickQuoteChange}
            required
            className="p-3 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={quickQuoteForm.email}
            onChange={handleQuickQuoteChange}
            required
            className="p-3 border rounded-lg"
          />
          <textarea
            name="description"
            placeholder="Brief Description"
            value={quickQuoteForm.description}
            onChange={handleQuickQuoteChange}
            className="p-3 border rounded-lg sm:col-span-2 h-24"
          />
          <button
            type="submit"
            disabled={loadingQuickQuote}
            className="sm:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {loadingQuickQuote ? "Sending..." : "Send Request"}
          </button>
          {quickQuoteMessage && (
            <p className="sm:col-span-2 text-center text-sm mt-2">
              {quickQuoteMessage}
            </p>
          )}
        </form>
      </section>
    </Layout>
  );
}
