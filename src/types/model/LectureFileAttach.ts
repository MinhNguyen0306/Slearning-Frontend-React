import { Lecture } from "./Lecture"

export interface LectureFileAttach {
    id: string,
    fileName: string,
    fileUrl: string,
    fileType: string
    fileSize: number,
    Lecture: Lecture,
    createAt?: string,
    updateAt?: string
}

export type LectureFileAttachs = LectureFileAttach[]