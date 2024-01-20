import { QuestionType } from "../payload/enums/QuestionType";
import { Answers } from "./Answer";
import { Chapter } from "./Chapter";

export interface Question {
    id: string,
    question: string,
    questionType: QuestionType,
    chapter: Chapter,
    answers: Answers
}

export type Questions = Question[]