import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white w-full mt-10">
      <div className="flex flex-col md:flex-row justify-between gap-12 px-8 md:px-36 py-12 border-b border-white/20">

        {/* Logo & About */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <img src={assets.logo_dark} alt="logo" className="h-10" />
          <p className="mt-5 text-sm text-center md:text-left text-white/70 max-w-sm leading-relaxed">
            Empowering learners with flexible, accessible education designed to help you grow — at your pace, on your terms.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h2 className="text-base font-semibold mb-4">Company</h2>
          <ul className="space-y-2 text-sm text-white/70">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex-1 hidden md:flex flex-col items-start">
          <h2 className="text-base font-semibold mb-4">Subscribe to our newsletter</h2>
          <p className="text-sm text-white/70 mb-4 leading-relaxed max-w-xs">
            Get the latest updates, articles, and learning tips straight to your inbox.
          </p>
          <div className="flex w-full max-w-xs">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-3 py-2 rounded-l-md bg-gray-700 text-sm text-white placeholder-white/50 outline-none border border-gray-600"
            />
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md text-sm font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <p className="text-center py-4 text-xs text-white/50">
        © 2025 Gyani. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
