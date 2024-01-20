import { PublishStatus } from "../payload/enums/PublishStatus"
import { Chapter } from "./Chapter"
import { videoStorage } from "./VideoStorage"

export type Lecture = {
    id: string,
    title: string,
    description: string,
    position: number,
    previewed: boolean,
    publishStatus: PublishStatus,
    videoStorage?: videoStorage,
    createAt?: string,
    updateAt?: string
    chapter?: Chapter
}

export type Lectures = Lecture[]