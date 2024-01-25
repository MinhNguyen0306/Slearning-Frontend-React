import { CodingExercise } from "./CodingExercise";
import { User } from "./User";

export interface TrackingCodingEx {
    id: number,
    prevLectureId: string,
    nextLectureId: string,
    completed: boolean,
    userCoding: string,
    codingExercise: CodingExercise,
    user: User,
}