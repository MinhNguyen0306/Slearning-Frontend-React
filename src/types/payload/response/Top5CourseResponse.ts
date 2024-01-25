import { Course } from "../../model/Course";

export interface Top5CourseResponse {
    courses: Course[],
    turnoverOfCourses: number[]
}