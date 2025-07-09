import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Line } from 'rc-progress';
import Footer from '../../components/Student/Footer';

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration } = useContext(AppContext);
  const navigate = useNavigate();

  const [progressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 3 },
    { lectureCompleted: 5, totalLectures: 7 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 2, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 10 },
    { lectureCompleted: 3, totalLectures: 5 },
    { lectureCompleted: 7, totalLectures: 7 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 2 },
    { lectureCompleted: 5, totalLectures: 5 },
  ]);

  return (
    <>
      <div className="md:px-36 px-4 pt-10 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          My Enrollments
        </h1>
        <div className="overflow-x-auto shadow rounded-lg bg-white">
          <table className="table-auto w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-900 border-b text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3 max-sm:hidden">Duration</th>
                <th className="px-4 py-3 max-sm:hidden">Completed</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map((course, index) => {
                const progress = progressArray[index];
                const progressPercent =
                  progress?.lectureCompleted && progress?.totalLectures
                    ? (progress.lectureCompleted / progress.totalLectures) * 100
                    : 0;

                const completed = progressPercent === 100;

                return (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 flex items-center space-x-3">
                      <img
                        src={course.courseThumbnail}
                        alt="thumbnail"
                        className="w-14 sm:w-20 md:w-24 rounded shadow"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 mb-1">
                          {course.courseTitle}
                        </p>
                        <Line
                          percent={progressPercent}
                          strokeWidth={4}
                          strokeLinecap="round"
                          trailWidth={4}
                          strokeColor={
                            progressPercent === 100
                              ? '#22c55e' // green
                              : progressPercent > 50
                              ? '#3b82f6' // blue
                              : '#facc15' // yellow
                          }
                          trailColor="#e5e7eb"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {calculateCourseDuration(course)}
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {progress &&
                        `${progress.lectureCompleted} / ${progress.totalLectures} Lectures`}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow cursor-pointer ${
                          completed
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        onClick={() => navigate('/player/' + course._id)}
                      >
                        {completed ? 'Completed' : 'On Going'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyEnrollments;
