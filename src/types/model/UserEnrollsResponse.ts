import { User } from "./User";

export interface UserEnrollsResponse {
    user: User,
    coursesName: string[]
}