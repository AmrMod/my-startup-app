import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">Blue‑R</span>

          {/* Hamburger menu for small screens */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 focus:outline-none focus:text-blue-600"
              aria-label="Toggle navigation menu"
            >
              {/* You can replace this with an actual SVG icon for three dots */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>

          {/* Navigation links - hidden on small screens, shown on medium and larger */}
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="hover:text-blue-600">
              Features
            </a>
            <a href="#testimonials" className="hover:text-blue-600">
              Testimonials
            </a>
            <Link href="/submit" passHref legacyBehavior>
              <a className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Submit Request
              </a>
            </Link>
          </div>
        </div>

        {/* Mobile menu - conditionally rendered based on isMenuOpen state */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-sm py-2 px-6 shadow-sm">
            <div className="flex flex-col space-y-2">
              <a
                href="#features"
                className="block hover:text-blue-600 py-2"
                onClick={toggleMenu} // Close menu on click
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block hover:text-blue-600 py-2"
                onClick={toggleMenu} // Close menu on click
              >
                Testimonials
              </a>
              <Link href="/submit" passHref legacyBehavior>
                <a
                  className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                  onClick={toggleMenu} // Close menu on click
                >
                  Submit Request
                </a>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-5xl font-extrabold text-blue-700">
              Contracted Web Development & Maintenance
            </h1>
            <p className="text-lg text-gray-700">
              Blue‑R delivers custom software solutions and ongoing website care so you can focus
              on growing your business.
            </p>
            <Link href="/submit" passHref legacyBehavior>
              <a className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
                Get Started
              </a>
            </Link>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="relative w-full h-64 md:h-80 lg:h-96">
              <Image
                src="/Blue-R.png"
                alt="Web development illustration"
                layout="fill"
                objectFit="contain"
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
            ['&ldquo;Blue‑R built our new site in weeks and handles all updates flawlessly.&rdquo;', '— Jane Doe, CEO of Acme Corp'],
            ['&ldquo;Their team optimized our performance by 50% and secured our data.&rdquo;', '— John Smith, CTO of TechCo'],
          ].map(([quote, author], i) => (
            <blockquote key={i} className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-700 italic mb-4" dangerouslySetInnerHTML={{ __html: quote }} />
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
          action="/submit"
          method="get"
          className="max-w-3xl mx-auto px-6 grid gap-4 sm:grid-cols-2"
        >
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            required
            className="p-3 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="p-3 border rounded-lg"
          />
          <textarea
            name="description"
            placeholder="Brief Description"
            className="p-3 border rounded-lg sm:col-span-2 h-24"
          />
          <button
            type="submit"
            className="sm:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Send Request
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-gray-100 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Blue‑R. Built by Amir Modibbo.{' '}
        <a href="https://github.com/AmrMod/my-startup-app" className="underline">
          GitHub
        </a>
      </footer>
    </div>
  );
}

