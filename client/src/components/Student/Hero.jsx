import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <section aria-label="Hero Section" className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100'>
      <h1 className='text-3xl md:text-5xl font-bold text-gray-800 max-w-3xl relative'>
        Unlock knowledge. <span className='text-blue-600'>Learn your way with Gyani.</span>
        <img src={assets.sketch} alt="" aria-hidden="true" className='md:block hidden absolute -bottom-7 right-0' />
      </h1>

      <p className='hidden md:block text-gray-500 max-w-2xl'>
        From local educators to global experts, Gyani brings you courses tailored for Nepal’s learners—engaging, flexible, and in your language.
      </p>

      <p className='md:hidden text-gray-500 max-w-sm'>
        Learn from top Nepali instructors with flexible, engaging courses designed just for you.
      </p>

      <SearchBar />
    </section>
  )
}

export default Hero
