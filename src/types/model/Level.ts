import { Courses } from "./Course"

export type Level = {
    id: string,
    title: string,
    courses?: Courses
}

export type Levels = Level[]