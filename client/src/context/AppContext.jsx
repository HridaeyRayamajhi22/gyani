import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets"
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from "react-toastify";


export const AppContext = createContext()
export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const currency = import.meta.env.VITE_CURRENCY

    const { getToken } = useAuth()
    const { user } = useUser()

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setisEducator] = useState(true)

    const [enrolledCourses, setEnrolledCourses] = useState([])

    // Fetch All CoursesSection
    const fetchAllCourses = async () => {
        try {
           const data = await axios.get(backendUrl + '/api/course/all')

           if(data.success){
             setAllCourses(data.courses)
           }else{
              toast.error(data.message)
           }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to calculate average rating of courses
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return totalRating / course.courseRatings.length

    }

    //Function to calculate Course ChapterTime
    const calculateChapterTime = (chapter) => {
        let time = 0
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    // Function to calculate the course duration 
    const calculateCourseDuration = (course) => {
        let time = 0
        course.courseContent.map((chapter) => chapter.chapterContent.map(
            (lecture) => time += lecture.lectureDuration
        ))
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    // Function to calculate the number of function in the course
    const calculateNoOfLectures = (course) => {
        let totalLecture = 0
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLecture += chapter.chapterContent.length
            }
        })
        return totalLecture
    }

    // Fetch user Enrolled Courses
    const fetchUserEnrolledCourses = async () => {
        setEnrolledCourses(dummyCourses)
    }

    useEffect(() => {
        fetchAllCourses()
        fetchUserEnrolledCourses()
    }, [])

    const logToken = async () => {
        console.log(await getToken())
    }

    useEffect(() => {
        if (user) {
            logToken()
        }
    }, [user])
    const value = {
        currency, allCourses, calculateRating, isEducator, setisEducator, calculateNoOfLectures, calculateCourseDuration, calculateChapterTime, enrolledCourses, fetchUserEnrolledCourses
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}