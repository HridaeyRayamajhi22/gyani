import React from 'react'
import { assets } from '../../assets/assets'

const Companies = () => {
  return (
    <div className='pt-16 text-center px-4'>
      <p className='text-sm md:text-base text-gray-600 font-medium'>
        Trusted by learners from
      </p>

      <div className='flex flex-wrap items-center justify-center gap-6 md:gap-16 mt-6 md:mt-10'>
        <img
          src={assets.microsoft_logo}
          alt="Microsoft"
          className='w-20 md:w-28 opacity-90 hover:opacity-100 transition'
        />
        <img
          src={assets.walmart_logo}
          alt="Walmart"
          className='w-20 md:w-28 opacity-90 hover:opacity-100 transition'
        />
        <img
          src={assets.accenture_logo}
          alt="Accenture"
          className='w-20 md:w-28 opacity-90 hover:opacity-100 transition'
        />
        <img
          src={assets.adobe_logo}
          alt="Adobe"
          className='w-20 md:w-28 opacity-90 hover:opacity-100 transition'
        />
        <img
          src={assets.paypal_logo}
          alt="Paypal"
          className='w-20 md:w-28 opacity-90 hover:opacity-100 transition'
        />
      </div>
    </div>
  )
}

export default Companies
