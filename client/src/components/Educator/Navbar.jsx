import React from 'react';
import { assets } from '../../assets/assets';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-300 py-2 bg-green-50">
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo_light}
          alt="logo"
          className="w-28 lg:w-32 cursor-pointer"
        />
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4 text-gray-700">
        <p className="hidden sm:block text-sm">
          Hi! {user ? user.fullName : 'Educator'}
        </p>

        {user ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
        ) : (
          <img
            className="w-8 h-8 rounded-full border cursor-pointer"
            src={assets.profile_img}
            alt="Profile"
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
