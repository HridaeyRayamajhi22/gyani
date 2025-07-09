import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialsSection = () => {
  return (
    <div className='pb-14 px-6 md:px-10 max-w-7xl mx-auto'>
      <h2 className='text-3xl font-semibold text-gray-800 text-center'>Testimonials</h2>
      <p className='text-base text-gray-500 mt-3 text-center max-w-2xl mx-auto'>
        Hear from our learners as they share their journeys of transformation, success, and how our platform has made a difference in their lives.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className='bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col h-full'
          >
            {/* Top: Image and Name */}
            <div className='flex items-center gap-4 px-5 py-4 bg-gray-50'>
              <img
                className='h-12 w-12 rounded-full object-cover'
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <h3 className='text-base font-semibold text-gray-800'>
                  {testimonial.name}
                </h3>
                <p className='text-sm text-gray-500'>{testimonial.role}</p>
              </div>
            </div>

            {/* Middle: Star Ratings */}
            <div className='px-5 pt-4'>
              <div className='flex items-center gap-1'>
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={
                      i < Math.floor(testimonial.rating)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                    className='w-4 h-4'
                  />
                ))}
                <span className='text-sm text-gray-500 ml-2'>
                  {testimonial.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Bottom: Feedback */}
            <div className='px-5 pb-5 pt-3'>
              <p className='text-sm text-gray-600 leading-relaxed'>
                {testimonial.feedback}
              </p>
              <a href="#" className='text-sm text-blue-600 hover:underline self-start'>
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialsSection
