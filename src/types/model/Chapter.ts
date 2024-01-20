import { PublishStatus } from "../payload/enums/PublishStatus"
import { Course } from "./Course"
import { Lectures } from "./Lecture"
import { Questions } from "./Question"

export type Chapter = {
    id: string, 
    title: string,
    description?: string,
    position: number,
    publishStatus: PublishStatus,
    completed: boolean,
    lectures: Lectures,
    questions: Questions,
    course?: Course
}

export type Chapters = Chapter[]