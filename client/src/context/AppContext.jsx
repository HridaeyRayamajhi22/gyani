// import { createContext, useEffect, useState } from "react";
// import { dummyCourses } from "../assets/assets"
// import humanizeDuration from 'humanize-duration'
// import { useAuth, useUser } from '@clerk/clerk-react'
// import axios from 'axios'
// import { toast } from "react-toastify";


// export const AppContext = createContext()
// export const AppContextProvider = (props) => {

//     const backendUrl = import.meta.env.VITE_BACKEND_URL

//     const currency = import.meta.env.VITE_CURRENCY

//     const { getToken } = useAuth()
//     const { user } = useUser()

//     const [allCourses, setAllCourses] = useState([])
//     const [isEducator, setIsEducator] = useState(true)

//     const [enrolledCourses, setEnrolledCourses] = useState([])
//     const [userData, setUserData] = useState(null)

//     // Fetch All CoursesSection
//     const fetchAllCourses = async () => {
//         try {
//             const response = await axios.get(backendUrl + '/api/course/all');
//             const data = response.data; // extract actual data

//             if (data.success) {
//                 setAllCourses(data.courses);
//             } else {
//                 toast.error(data.message);
//             }

//         } catch (error) {
//             toast.error(error.message)
//         }
//     }

//     // Fetch user data
//     const fetchUserData = async () => {

//         if (user.publicMetadata === 'educator') {
//             setIsEducator(true)
//         }
//         try {
//             const token = await getToken()
//             const { data } = await axios.get(backendUrl + '/api/user/data', { headers: { Authorization: `Bearer${token}` } })

//             if (data.success) {
//                 setUserData(data.user)
//             } else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(data.message)
//         }
//     }

//     // Function to calculate average rating of courses
//     const calculateRating = (course) => {
//         if (course.courseRatings.length === 0) {
//             return 0;
//         }
//         let totalRating = 0
//         course.courseRatings.forEach(rating => {
//             totalRating += rating.rating
//         })
//         return Math.floor(totalRating / course.courseRatings.length) 
//     }

//     //Function to calculate Course ChapterTime
//     const calculateChapterTime = (chapter) => {
//         let time = 0
//         chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
//         return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
//     }

//     // Function to calculate the course duration 
//     const calculateCourseDuration = (course) => {
//         let time = 0
//         course.courseContent.map((chapter) => chapter.chapterContent.map(
//             (lecture) => time += lecture.lectureDuration
//         ))
//         return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
//     }

//     // Function to calculate the number of function in the course
//     const calculateNoOfLectures = (course) => {
//         let totalLecture = 0
//         course.courseContent.forEach(chapter => {
//             if (Array.isArray(chapter.chapterContent)) {
//                 totalLecture += chapter.chapterContent.length
//             }
//         })
//         return totalLecture
//     }

//     // Fetch user Enrolled Courses
//     const fetchUserEnrolledCourses = async () => {
//         try {

//             const token = await getToken()
//             const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses',
//                 { headers: { Authorization: `Bearer ${token}` } })

//             if (data.success) {
//                 setEnrolledCourses(data.enrolledCourses.reverse())
//             } else {
//                 toast.error(data.message)
//             }
//         } catch (error) {
//             toast.error(error.message)
//       }
//     }

//     useEffect(() => {
//         fetchAllCourses()
//     }, [])

//     useEffect(() => {
//         if (user) {
//             fetchUserData()
//             fetchUserEnrolledCourses()
//         }
//     }, [user])
//     const value = {
//         currency, allCourses, calculateRating, isEducator, setIsEducator, calculateNoOfLectures, calculateCourseDuration, calculateChapterTime, enrolledCourses, fetchUserEnrolledCourses, backendUrl, userData, setUserData, getToken, fetchAllCourses
//     }
//     return (
//         <AppContext.Provider value={value}>
//             {props.children}
//         </AppContext.Provider>
//     )
// }




import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false); // default false
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  /** ---------------------------
   * Fetch All Courses
   ----------------------------*/
  const fetchAllCourses = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/course/all`);
      const data = response.data;

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /** ---------------------------
   * Fetch user data from backend
   ----------------------------*/
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/user/data`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /** ---------------------------
   * Calculate course rating
   ----------------------------*/
  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) return 0;
    const totalRating = course.courseRatings.reduce((acc, r) => acc + r.rating, 0);
    return Math.floor(totalRating / course.courseRatings.length);
  };

  /** ---------------------------
   * Calculate chapter time
   ----------------------------*/
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach((lecture) => {
      time += lecture.lectureDuration;
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  /** ---------------------------
   * Calculate total course duration
   ----------------------------*/
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  /** ---------------------------
   * Calculate total lectures
   ----------------------------*/
  const calculateNoOfLectures = (course) => {
    return course.courseContent.reduce((total, chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        return total + chapter.chapterContent.length;
      }
      return total;
    }, 0);
  };

  /** ---------------------------
   * Fetch user enrolled courses
   ----------------------------*/
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/user/enrolled-courses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /** ---------------------------
   * Initial Fetch All Courses
   ----------------------------*/
  useEffect(() => {
    fetchAllCourses();
  }, []);

  /** ---------------------------
   * Watch for user changes
   ----------------------------*/
  useEffect(() => {
    if (user) {
      // ✅ Check role dynamically
      setIsEducator(user.publicMetadata?.role === "educator");

      fetchUserData();
      fetchUserEnrolledCourses();
    } else {
      setIsEducator(false);
      setUserData(null);
      setEnrolledCourses([]);
    }
  }, [user]);

  /** ---------------------------
   * Context Value
   ----------------------------*/
  const value = {
    currency,
    allCourses,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
 