import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets, dummyDashboardData } from '../../assets/assets'
import Loading from '../../components/Student/Loading'

const Dashboard = () => {
  const { currency } = useContext(AppContext)
  const [dashboardData, settDashboardData] = useState(null)

  const fetchDashboardData = async () => {
    settDashboardData(dummyDashboardData)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return dashboardData ? (
    <div className="min-h-screen bg-gray-50 flex flex-col gap-8 p-4 md:p-8">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-blue-100 p-5 hover:shadow-md transition">
          <img src={assets.patients_icon} alt="students" className="w-12 h-12" />
          <div>
            <p className="text-3xl font-semibold text-gray-700">
              {dashboardData.enrolledStudentsData.length}
            </p>
            <p className="text-sm text-gray-500">Total Enrollments</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-blue-100 p-5 hover:shadow-md transition">
          <img src={assets.appointments_icon} alt="courses" className="w-12 h-12" />
          <div>
            <p className="text-3xl font-semibold text-gray-700">
              {dashboardData.totalCourses}
            </p>
            <p className="text-sm text-gray-500">Total Courses</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-blue-100 p-5 hover:shadow-md transition">
          <img src={assets.earning_icon} alt="earnings" className="w-12 h-12" />
          <div>
            <p className="text-3xl font-semibold text-gray-700">
              {currency}{dashboardData.totalEarnings}
            </p>
            <p className="text-sm text-gray-500">Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Latest Enrollments */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Latest Enrollments
        </h2>

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-center hidden sm:table-cell">#</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Course Title</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={item.student.imageUrl}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <span className="truncate">{item.student.name}</span>
                  </td>
                  <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default Dashboard
