import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/Student/Loading';
import Footer from '../../components/Student/Footer';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Youtube from 'react-youtube';

const CourseDetails = () => {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
  } = useContext(AppContext);

  useEffect(() => {
    const findCourse = allCourses.find(course => course._id === id);
    setCourseData(findCourse);
  }, [allCourses, id]);

  if (!courseData) {
    return <Loading />;
  }

  const toggleSection = (index) => {
    setOpenSection((previous) => ({
      ...previous,
      [index]: !previous[index],
    }));
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-cyan-100 via-white to-white pt-16 pb-20">
        <div className="flex md:flex-row flex-col-reverse gap-8 items-start justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

          {/* Left Column */}
          <div className="flex-1 max-w-3xl w-full z-10 text-gray-800 space-y-8 bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-shadow hover:shadow-lg">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {courseData.courseTitle}
              </h1>
              <div className="h-1 w-16 bg-blue-500 rounded my-2"></div>

              <p
                className="leading-relaxed text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription.slice(0, 200) + '...'
                }}
              />

              {/* Ratings */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900">{calculateRating(courseData).toFixed(1)}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={
                          i < Math.floor(calculateRating(courseData))
                            ? assets.star
                            : assets.star_blank
                        }
                        alt="star"
                        className="w-4 h-4"
                      />
                    ))}
                  </div>
                </div>
                <span className="text-blue-600 text-sm">
                  ({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})
                </span>
                <span className="text-gray-500 text-sm">•</span>
                <p className="text-gray-700 text-sm">
                  {courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}
                </p>
                <span className="text-gray-500 text-sm">•</span>
                <p className="text-sm">
                  Created by <span className="text-blue-600 font-medium">GreatStack</span>
                </p>
              </div>
            </div>

            {/* Course Content */}
            <div className="pt-8">
              <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b border-gray-200">Course Content</h2>
              <div className="pt-6 space-y-4">
                {courseData.courseContent.map((chapter, index) => (
                  <div
                    key={index}
                    className="border border-gray-100 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="flex items-center justify-between px-5 py-3 cursor-pointer select-none hover:bg-gray-100 rounded-lg"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          className={`transform transition-transform duration-200 ${openSection[index] ? 'rotate-180' : ''}`}
                          src={assets.down_arrow_icon}
                          alt="down_arrow"
                        />
                        <p className="font-semibold text-gray-800">
                          {chapter.chapterTitle}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {chapter.chapterContent.length} Lectures • {calculateChapterTime(chapter)}
                      </p>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-96' : 'max-h-0'}`}>
                      <ul className="list-none pl-0 pr-4 py-2 text-gray-600 border-t border-gray-100 space-y-2">
                        {chapter.chapterContent.map((lecture, i) => (
                          <li key={i} className="flex items-center justify-between px-5 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                              <img src={assets.play_icon} alt="play_icon" className="w-4 h-4" />
                              <span className="text-gray-700">
                                {lecture.lectureTitle}
                              </span>
                            </div>
                            <div className="flex gap-3 items-center text-sm">
                              {lecture.isPreviewFree && (
                                <span
                                  onClick={() => setPlayerData({ videoId: lecture.lectureUrl.split('/').pop() })}
                                  className="text-blue-500 cursor-pointer hover:underline text-xs font-medium"
                                >
                                  Preview
                                </span>
                              )}
                              <span className="text-gray-500 text-xs">
                                {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Description */}
            <div className="py-8">
              <h3 className="text-2xl font-bold text-gray-900 pb-3 border-b border-gray-200">Description</h3>
              <div
                className="pt-4 prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription
                }}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="md:sticky md:top-20 w-full md:w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {playerData ? (
              <Youtube
                videoId={playerData.videoId}
                opts={{ playerVars: { autoplay: 1 } }}
                iframeClassName='w-full aspect-video'
              />
            ) : (
              // <div className="bg-gradient-to-tr from-blue-500 to-blue-400 text-white flex items-center justify-center h-40">
              //   <img
              //     src={courseData.courseThumbnail}
              //     alt="Course"
              //     className="h-36 rounded shadow-md"
              //   />
              // </div>
              <div className="relative w-full aspect-video overflow-hidden">
                <img
                  src={courseData.courseThumbnail}
                  alt="Course Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>

            )}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-red-500">
                <p><span className="font-medium">5 days</span> left at this price!</p>
              </div>

              <div className="flex gap-2 items-baseline">
                <p className="text-gray-800 text-2xl font-semibold">
                  {currency} {(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}
                </p>
                <p className="text-gray-500 line-through text-sm">
                  {currency} {courseData.coursePrice}
                </p>
                <p className="text-green-600 text-sm">{courseData.discount}% off</p>
              </div>

              <button
                className={`mt-4 w-full py-2 rounded-lg text-white text-sm font-medium shadow-md transition-colors ${isAlreadyEnrolled ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isAlreadyEnrolled ? "Continue Learning" : "Enroll Now"}
              </button>

              <div className="pt-4">
                <p className="text-base font-medium text-gray-800">What's in the course?</p>
                <ul className="ml-4 pt-1 text-sm list-disc text-gray-500 space-y-1">
                  <li>Lifetime access with free updates</li>
                  <li>Step-by-step, hands-on project guidance</li>
                  <li>Downloadable resources and course code</li>
                  <li>Quizzes to test your knowledge</li>
                  <li>Certificate of completion</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="font-medium text-gray-900 mb-2">Share this course:</p>
                <div className="flex gap-3">
                  <button className="p-2 rounded-full hover:bg-gray-100 ring-1 ring-gray-200 transition">
                    <img src={assets.facebook_icon} alt="Facebook" className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 ring-1 ring-gray-200 transition">
                    <img src={assets.twitter_icon} alt="Twitter" className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 ring-1 ring-gray-200 transition">
                    <img src={assets.instagram_icon} alt="Insta" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;
