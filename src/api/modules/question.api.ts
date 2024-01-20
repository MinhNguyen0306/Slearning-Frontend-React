import { Answer } from "../../types/model/Answer";
import { Question } from "../../types/model/Question";
import { ApiErrorResponse } from "../../types/payload/ApiErrorResponse";
import { QuestionType } from "../../types/payload/enums/QuestionType";
import { ApiResponse } from "../../types/payload/response/ApiResponse";
import { isAxiosError } from "../../util/utils";
import privateClient from "../config/private.client";
import publicClient from "../config/public.client";

const questionEndpoints = {
    getById: (questionId: string) => `/questions/${questionId}`,
    getAnswerById: (answerId: string) => `/questions/answers/${answerId}`,
    create: "questions",
    editQuestion: (questionId: string) => `/questions/${questionId}`,
    createAnswer: (questionId: string) => `/questions/${questionId}/answers`,
    editAnswer: (answerId: string) => `/questions/answers/${answerId}`,
    delete: (questionId: string) => `questions/${questionId}`,
    deleteAnswer: (answerId: string) => `questions/answers/${answerId}`,
    chooseCorrectAnswer: (answerId: string) => `questions/answers/${answerId}`,
    checkCorrectAnswer: "/questions/check-correct"
}

const questionApi = {
    getById: async (questionId: string) => {
        try {
            const response = await publicClient.get<Question>(
                questionEndpoints.getById(questionId)
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            } else {
                throw new Error("System error")
            }
        }
    },

    getAnswerById: async (answerId: string) => {
        try {
            const response = await publicClient.get<Answer>(
                questionEndpoints.getAnswerById(answerId)
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            } else {
                throw new Error("System error")
            }
        }
    },

    create: async (chapterId: string, question: string, questionType: QuestionType, answers: string[]) => {
        try {
            const response = await privateClient.post<Question>(
                questionEndpoints.create,
                null, {
                    params: {
                        chapterId,
                        question, 
                        questionType,
                        answers
                    }
                }
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            } else {
                throw new Error("System error")
            }
        }
    },

    editQuestion: async (questionId: string, question: string) => {
        try {
            const response = await privateClient.patch<Question>(
                questionEndpoints.editQuestion(questionId),
                null, {
                    params: {
                        question
                    }
                }
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            } else {
                throw new Error("System error")
            }
        }
    },

    createAnswer: async (questionId: string, answer: string) => {
        try {
            const response = await privateClient.post<Answer>(
                questionEndpoints.createAnswer(questionId),
                null, {
                    params: {
                        answer
                    },
                }
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            } else {
                throw new Error("System error")
            }
        }
    },

    editAnswer: async (answerId: string, answer: string) => {
        try {
            const response = await privateClient.patch<Answer>(
                questionEndpoints.editAnswer(answerId),
                null, {
                    params: {
                        answer
                    },
                }
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            } else {
                throw new Error("System error")
            }
        }
    },

    deleteQuestion: async (questionId: string) => {
        try {
            const response = await privateClient.delete<void>(
                questionEndpoints.delete(questionId),
            )

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            } else {
                throw new Error("System error")
            }
        }
    },

    deleteAnswer: async (answerId: string) => {
        try {
            const response = await privateClient.delete<ApiResponse>(
                questionEndpoints.deleteAnswer(answerId),
            )

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            } else {
                throw new Error("System error")
            }
        }
    },

    chooseCorrectAnswer: async (answerId: string) => {
        try {
            const response = await privateClient.put<Answer>(
                questionEndpoints.chooseCorrectAnswer(answerId),
            )

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            } else {
                throw new Error("System error")
            }
        }
    },

    checkCorrectAnswer: async (questionId: string, answerIds?: string[], shortAnswer?: string) => {
        try {
            const response = await privateClient.get<boolean>(
                questionEndpoints.checkCorrectAnswer,
                {
                    params: {
                        questionId,
                        answerIds,
                        shortAnswer
                    }
                }
            )

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            } else {
                throw new Error("System error")
            }
        }
    },
}

export default questionApi;