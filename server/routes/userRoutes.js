import { getUserData, purchaseCourse, userEnrolledCourses } from "../controllers/userController.js"
import express from 'express'

const userRouter = express.Router()
userRouter.get('/data', getUserData)
userRouter.get('/enrolled-Courses', userEnrolledCourses)
userRouter.post('/purchase', purchaseCourse)

export default userRouter