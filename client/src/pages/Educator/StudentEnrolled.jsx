import React, { useEffect, useState } from 'react';
import { dummyStudentEnrolled } from '../../assets/assets';
import Loading from '../../components/Student/Loading';

const StudentEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    setEnrolledStudents(dummyStudentEnrolled);
  };

  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  if (!enrolledStudents) return <Loading />;

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="w-full max-w-5xl rounded-xl bg-white shadow border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 p-4 border-b border-gray-100">
          Enrolled Students
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-center hidden sm:table-cell">#</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Course Title</th>
                <th className="px-4 py-3 hidden sm:table-cell">Date</th>
              </tr>
            </thead>

            <tbody>
              {enrolledStudents.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-center hidden sm:table-cell font-medium text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={item.student.imageUrl}
                      alt={`${item.student.name}'s avatar`}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <span className="font-medium text-gray-800 truncate">
                      {item.student.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrolled;
