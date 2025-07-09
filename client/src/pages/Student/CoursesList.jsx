import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import SearchBar from '../../components/Student/SearchBar'
import { AppContext } from '../../context/AppContext'
import CourseCard from '../../components/Student/CourseCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/Student/Footer'

const CoursesList = () => {
  const { allCourses } = useContext(AppContext)
  const { input } = useParams()
  const [filteredCourse, setFilteredCourse] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    if (allCourses?.length > 0) {
      const tempCourses = [...allCourses]
      if (input) {
        setFilteredCourse(
          tempCourses.filter(course =>
            course.courseTitle.toLowerCase().includes(input.toLowerCase())
          )
        )
      } else {
        setFilteredCourse(tempCourses)
      }
    }
  }, [allCourses, input])

  return (
    <>
    <div className='relative md:px-36 px-6 pt-20 text-left'>
      {/* Header + Search */}
      <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
        <div>
          <h1 className='text-3xl sm:text-4xl font-semibold text-gray-800'>Course List</h1>
          <p className='text-gray-500 text-sm mt-1'>
            <Link to='/' className='text-blue-600 hover:underline'>Home</Link> / <span>Course List</span>
          </p>
        </div>
        <SearchBar data={input} />
      </div>

      {/* Filter pill */}
      {input && (
        <div className='inline-flex items-center gap-3 px-4 py-2 mt-8 mb-4 rounded-full bg-gray-100 text-gray-600 shadow-sm'>
          <span className='text-sm font-medium'>{input}</span>
          <img
            src={assets.cross_icon}
            alt='Clear'
            className='w-4 h-4 cursor-pointer'
            onClick={() => navigate('/course-list')}
          />
        </div>
      )}

      {/* Course Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
        {filteredCourse?.length > 0 ? (
          filteredCourse.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))
        ) : (
          <div className='col-span-full flex flex-col items-center justify-center mt-12'>
            <img src={assets.empty_icon} alt="No results" className='w-40 mx-auto opacity-50' />
            <p className='text-gray-500 mt-4 text-sm'>No courses found for “{input}”.</p>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  )
}

export default CoursesList
