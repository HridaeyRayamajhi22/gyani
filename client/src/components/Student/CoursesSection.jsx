import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CoursesSection = () => {

  const { allCourses } = useContext(AppContext)
  return (
    <div className='py-16 px-4 md:px-40 text-center'>
      <h2 className='text-3xl md:text-4xl font-semibold text-gray-800'>
        Learn from the best
      </h2>

      <p className='text-sm md:text-base text-gray-500 mt-4 max-w-2xl mx-auto'>
        Explore our top-rated courses—from coding and design to business and wellness—tailored for Nepali learners. Practical, flexible, and built to help you grow.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>


      <div className='mt-8'>
        <Link
          to='/course-list'
          onClick={() => scrollTo(0, 0)}
          className='inline-block text-sm text-blue-600 border border-blue-600/30 px-8 py-2.5 rounded-full transition hover:bg-blue-50 hover:shadow-sm'
        >
          Show all courses
        </Link>
      </div>
    </div>
  )
}

export default CoursesSection
