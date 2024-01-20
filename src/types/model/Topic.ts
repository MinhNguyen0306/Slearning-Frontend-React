import { Courses } from "./Course";
import { SubCategory } from "./SubCategory";

export interface Topic {
    id: string
    title: string,
    lock?: boolean,
    subCategory: SubCategory,
    courses?: Courses
}

export type Topics = Topic[]