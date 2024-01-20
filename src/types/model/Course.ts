import { CourseStatus } from "../payload/enums/CourseStatus"
import { Chapters } from "./Chapter"
import { CourseRatings } from "./CourseRating"
import { Enrolls } from "./Enroll"
import { ImageStorage } from "./ImageStorage"
import { Level } from "./Level"
import { Topic } from "./Topic"
import { User } from "./User"

export interface Course {
    id: string,
    title: string,
    image?: ImageStorage,
    description: string,
    introduce: string,
    requirement: string,
    achievement: string,
    price: number,
    status?: CourseStatus,
    advertising?: boolean,
    complete?: boolean,
    chapters: Chapters,
    level: Level,
    topic: Topic,
    user?: User,
    enrolls?: Enrolls,
    ratings: CourseRatings,
    create_at?: Date,
    update_at?: Date
}

export type Courses = Course[]