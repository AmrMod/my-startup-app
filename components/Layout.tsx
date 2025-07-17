// components/Layout.tsx
import Link from 'next/link';
import { useState } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 w-full z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Blue‑R
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-800"
          >
            ☰
          </button>

          <nav className="hidden md:flex space-x-6">
            <Link href="#features" className="hover:text-blue-600">Features</Link>
            <Link href="#testimonials" className="hover:text-blue-600">Testimonials</Link>
            <Link href="/submit" className="hover:text-blue-600">
              Submit Request
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-6 py-2 bg-white shadow">
            <Link href="#features" className="block py-2" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="#testimonials" className="block py-2" onClick={() => setMenuOpen(false)}>Testimonials</Link>
            <Link href="/submit" className="block bg-blue-600 text-white px-4 py-2 rounded text-center mt-2" onClick={() => setMenuOpen(false)}>
              Submit Request
            </Link>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="pt-24 px-4 flex-grow">{children}</main>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-gray-100 text-center text-sm text-gray-600 space-y-1">
  <p>
    © {new Date().getFullYear()} Blue‑R. Built by Amir Modibbo.{' '}
    <a href="https://github.com/AmrMod/my-startup-app" className="underline">
      GitHub
    </a>
  </p>
  <p>
    📞 <a href="tel:+2347063022632" className="underline text-blue-600">+234 706 3022 632</a>
  </p>
</footer>
    </div>
  );
};

export default Layout;
