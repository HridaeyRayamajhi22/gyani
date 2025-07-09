import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0 text-center'>
      <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>
        Learn anything, anytime, anywhere
      </h1>

      <p className='sm:text-sm md:text-base text-gray-500 max-w-3xl'>
        Flexible, expert-led courses designed to fit your schedule and help you grow.
      </p>

      <div className='flex flex-col sm:flex-row items-center font-medium gap-4 mt-4'>
        <button className='px-8 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200 cursor-pointer'>
          Get Started
        </button>
        <button className='flex items-center gap-2 hover:underline cursor-pointer'>
          Learn more
          <img src={assets.arrow_icon} alt="arrow_icon" className='w-4 h-4' />
        </button>
      </div>
    </div>
  )
}

export default CallToAction
