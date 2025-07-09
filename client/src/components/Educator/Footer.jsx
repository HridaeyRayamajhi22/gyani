import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-12 py-6 border-t border-gray-200 bg-gray-50 text-gray-600 gap-4">
      
      {/* Left Section */}
      <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
        <img
          className="hidden md:block w-24"
          src={assets.logo_light}
          alt="logo"
        />
        <div className="hidden md:block h-6 w-px bg-gray-300"></div>
        <p className="text-xs md:text-sm">
          © 2025 <span className="font-semibold text-gray-700">Gyani</span>. All rights reserved.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          className="p-2 rounded-full hover:bg-blue-100 transition-colors"
        >
          <img
            src={assets.facebook_icon}
            alt="facebook"
            className="w-7 h-7"
          />
        </a>
        <a
          href="#"
          className="p-2 rounded-full hover:bg-green-100 transition-colors"
        >
          <img
            src={assets.twitter_icon}
            alt="twitter"
            className="w-7 h-7"
          />
        </a>
        <a
          href="#"
          className="p-2 rounded-full hover:bg-pink-100 transition-colors"
        >
          <img
            src={assets.instagram_icon}
            alt="instagram"
            className="w-7 h-7"
          />
        </a>
      </div>

    </footer>
  )
}

export default Footer
