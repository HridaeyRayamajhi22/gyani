import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Courses', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-course', icon: assets.my_course_icon },
    { name: 'Students Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  return isEducator && (
    <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-300 bg-white shadow-sm py-4 flex flex-col'>
      <div className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === '/educator'}
            className={({ isActive }) =>
              `group flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-6 gap-3 
              text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all
              ${isActive ? 'bg-indigo-100 text-indigo-600 font-medium border-r-4 border-indigo-500' : ''}`
            }
          >
            <img
              src={item.icon}
              alt={item.name}
              className='w-6 h-6'
            />
            <p className='md:block hidden text-sm'>{item.name}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
