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

  return (
    <Link to={'./course/' + course._id} onClick={()=> scrollTo(0,0)} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300">
      <img
        src={course.courseThumbnail}
        alt="Course Thumbnail"
        className="w-full h-40 object-cover"
      />

      <div className="p-4 space-y-2 text-left">
        <h3 className="text-md font-semibold text-gray-800">
          {course.courseTitle}
        </h3>
        <p className="text-sm text-gray-500">GreatStack</p>

       

        <p className="text-blue-600 font-bold">
          {currency}{priceAfterDiscount}
        </p>
      </div>
    </Link>
  )
}

export default CourseCard
