import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Youtube from 'react-youtube' 
import Footer from '../../components/Student/Footer'
import Rating from '../../components/Student/Rating'


const Player = () => {
  const {enrolledCourses, calculateChapterTime} = useContext(AppContext)
  const {courseId} = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSection, setOpenSection] = useState({})
  const [playerData, setPlayerData] = useState(null)


  const getCourseData = ()=>{
    enrolledCourses.map((course)=>{
      if(course._id === courseId){
        setCourseData(course)
      } 
    })
  }

   const toggleSection = (index) => {
    setOpenSection((previous) => ({
      ...previous,
      [index]: !previous[index],
    }));
  };

  useEffect(()=> {
    getCourseData()
  }, [enrolledCourses])
  return (
    <>
    <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
      {/* Left Column */}
       <div className='text-gray-800 '>
         <h2 className='text-xl font-semibold'>Course Structure</h2>

         {/* Course Structure */}
                     <div className="pt-4">
                       <div className="pt-4 space-y-3">
                         {courseData && courseData.courseContent.map((chapter, index) => (
                           <div
                             key={index}
                             className="border border-gray-200 bg-white rounded-lg shadow-xs hover:shadow-sm transition-shadow"
                           >
                             <div
                               className="flex items-center justify-between px-5 py-4 cursor-pointer select-none hover:bg-gray-50 rounded-lg"
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
                                 {chapter.chapterContent.length} Lectures •{' '}
                                 {calculateChapterTime(chapter)}
                               </p>
                             </div>
                             <div className={`overflow-hidden transition-all duration-300 ${openSection[index] ? 'max-h-96' : 'max-h-0'}`}>
                               <ul className="list-none pl-0 pr-4 py-2 text-gray-600 border-t border-gray-100 space-y-2">
                                 {chapter.chapterContent.map((lecture, i) => (
                                   <li key={i} className="flex items-center justify-between px-5 py-2 hover:bg-gray-50 rounded">
                                     <div className="flex items-center gap-3">
                                       <img
                                         src={false ? assets.blue_tick_icon : assets.play_icon}
                                         alt="play_icon"
                                         className="w-4 h-4"
                                       />
                                       <span className="text-gray-700">
                                         {lecture.lectureTitle}
                                       </span>
                                     </div>
                                     <div className="flex gap-3 items-center text-sm">
                                       {lecture.lectureUrl && (
                                         <span
                                           onClick={() => setPlayerData({
                                            ...lecture, chapter:index + 1, lecture: i + 1
                                             
                                           })}
                                           className="text-blue-500 cursor-pointer hover:underline text-xs font-medium">
                                           Watch
                                         </span>
                                       )}
                                       <span className="text-gray-500 text-xs">
                                         {humanizeDuration(
                                           lecture.lectureDuration * 60 * 1000,
                                           { units: ['h', 'm'] }
                                         )}
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
                     <div className='flex items-center gap-2 py-3 mt-10'>
                       <h1 className='text-xl font-bold'>Rate this Course:</h1>
                       <Rating initialRating  = {0}/>
                     </div>
       </div>

       {/* Right Column */}
       <div className='md:mt-10'>
        {playerData ? (
          <div>
              <Youtube videoId={playerData.lectureUrl.split('/').pop()} iframeClassName='w-full aspect-video' />
              <div className='flex justify-between items-center mt-1'>
                 <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                 <button className='text-blue-600'> {false ? 'Completed' : 'Mark Complete'}</button>
              </div>
          </div>
        )
        : 
          <img src={courseData ? courseData.courseThumbnail : ''} alt="" />
        }
       </div>
    </div>
    <Footer />
    </>
  )
}

export default Player
