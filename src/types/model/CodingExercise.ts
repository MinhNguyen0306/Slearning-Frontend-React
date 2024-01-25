import { PublishStatus } from "../payload/enums/PublishStatus";
import { Chapter } from "./Chapter";
import { Lecture } from "./Lecture";

export interface CodingExercise {
    id: number,
    title: string,
    solution: string,
    evaluation: string,
    result: string,
    languageId: number,
    instruction: string,
    solutionExplanation: string,
    codeStarter: string,
    hint: string,
    publishStatus: PublishStatus,
    lecture: Lecture,
    chapter: Chapter
}