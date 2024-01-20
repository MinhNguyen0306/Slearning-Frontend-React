import { Question } from "./Question";

export interface Answer {
    id: string,
    answer: string,
    correct: boolean,
    question: Question
}

export type Answers = Answer[]