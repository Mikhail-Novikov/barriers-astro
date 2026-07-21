import "../styles/global.css";
import "swiper/swiper.css"
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-neutral-50 text-neutral-800 px-16 py-10 font-sans mt-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Kiri: Logo & Deskripsi */}
        <div className="space-y-4">
          <div>
            <a href="/" className="text-2xl font-semibold font-sans">
              Burung 2025
            </a>
            <p className="text-neutral-500 text-sm mt-1">
              Temukan produk yang kamu cari, bandingkan dengan mudah, dan dapatkan tanpa drama.
            </p>
          </div>
          <div className="flex space-x-3 text-base text-neutral-500">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="hover:text-pink-500 transition-colors cursor-pointer" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="hover:text-blue-600 transition-colors cursor-pointer" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className="hover:text-blue-400 transition-colors cursor-pointer" />
            </a>
          </div>
        </div>

        {/* Kanan: Links */}
        <nav
          className="grid grid-cols-3 gap-8 text-sm text-neutral-500"
          aria-label="Footer Navigation"
        >
          <div>
            <h3 className="text-base font-medium mb-2 text-neutral-800">Features</h3>
            <ul className="space-y-1">
              <li><a href="/features/core" className="hover:underline">Core features</a></li>
              <li><a href="/features/pro" className="hover:underline">Pro experience</a></li>
              <li><a href="/features/integrations" className="hover:underline">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-medium mb-2 text-neutral-800">Learn more</h3>
            <ul className="space-y-1">
              <li><a href="/blog" className="hover:underline">Blog</a></li>
              <li><a href="/case-studies" className="hover:underline">Case studies</a></li>
              <li><a href="/customers" className="hover:underline">Customer stories</a></li>
              <li><a href="/best-practices" className="hover:underline">Best practices</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-medium mb-2 text-neutral-800">Support</h3>
            <ul className="space-y-1">
              <li><a href="/contact" className="hover:underline">Contact</a></li>
              <li><a href="/support" className="hover:underline">Support</a></li>
              <li><a href="/legal" className="hover:underline">Legal</a></li>
            </ul>
          </div>
        </nav>

      </div>

      {/* Bottom line */}
      <div className="mt-8 border-t border-neutral-200 pt-4 text-neutral-400 text-xs text-center">
        &copy; 2025 Burung. All rights reserved.
      </div>
    </footer>
  );
};
