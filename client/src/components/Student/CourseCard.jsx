import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext)

  const priceAfterDiscount = (
    course.coursePrice -
    (course.discount * course.coursePrice) / 100
  ).toFixed(2)

  const rating = Math.floor(calculateRating(course)) // Number between 0 and 5

  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => scrollTo(0, 0)}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300"
    >
      <img
        src={course.courseThumbnail}
        alt="Course Thumbnail"
        className="w-full h-40 object-cover"
      />

      <div className="p-4 space-y-2 text-left">
        <h3 className="text-md font-semibold text-gray-800">
          {course.courseTitle}
        </h3>
        <p className="text-sm text-gray-500">
          {course.educator?.name || 'Unknown Instructor'}
        </p>

        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={i < rating ? assets.star : assets.star_blank}
              alt={i < rating ? "Filled star" : "Empty star"}
              className="w-3.5 h-3.5"
            />
          ))}
          <span className="text-gray-500 text-sm ml-2">
            ({course.courseRatings?.length || 0})
          </span>
        </div>

        <p className="text-blue-600 font-bold">
          {currency}{priceAfterDiscount}
        </p>
      </div>
    </Link>
  )
}

export default CourseCard
