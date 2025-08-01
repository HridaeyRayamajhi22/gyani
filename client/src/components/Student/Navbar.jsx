
import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isEducator, backendUrl, setIsEducator, getToken } = useContext(AppContext);

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
        return
      }

      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setIsEducator(true)
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(data.message)
    }
  }

  // If we are on home page exactly → use `logo`, else use `logo_light`
  const isHomePage = location.pathname === '/';
  const logoSrc = isHomePage ? assets.logo : assets.logo_light;

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-2 ${isHomePage ? 'bg-cyan-100' : 'bg-green-50'
        }`}
    >
      <Link to='/'>
        <img
          src={logoSrc}
          alt="GYani"
          className='w-40 lg:w-32 cursor-pointer'
        />
      </Link>

      {/* Desktop Links */}
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
          {user && (
            <>
              <button
                className='cursor-pointer hover:text-blue-600 hover:font-semibold'
                onClick={becomeEducator}
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>
              |
              <Link
                className='hover:text-blue-600 hover:font-semibold'
                to='/my-enrollments'
              >
                My Enrollments
              </Link>
            </>
          )}
        </div>

        {user ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10',
              },
            }}
          />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg font-semibold tracking-wide cursor-pointer"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile Links */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs cursor-pointer'>
          {user && (
            <>
              <button className='cursor-pointer hover:text-blue-600 hover:font-semibold' onClick={becomeEducator}>
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>
              |
              <Link to='/my-enrollments' className='cursor-pointer hover:text-blue-600 hover:font-semibold'>My Enrollments</Link>
            </>
          )}
        </div>

        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-green-400 p-1 rounded-full hover:bg-green-500 transition cursor-pointer"
          >
            <img className='w-5 h-5' src={assets.user_icon} alt="User Icon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
