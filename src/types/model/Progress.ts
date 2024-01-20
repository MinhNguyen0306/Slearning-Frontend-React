import { Lecture } from "./Lecture";
import { User } from "./User";

export interface Progress {
    id: string,
    completed: boolean,
    lecture: Lecture,
    user: User,
    createAt?: string,
}