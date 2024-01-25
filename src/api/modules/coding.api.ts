import { CodingExercise } from "../../types/model/CodingExercise";
import { TrackingCodingEx } from "../../types/model/TrackingCodingEx";
import { ApiErrorResponse } from "../../types/payload/ApiErrorResponse";
import { isAxiosError } from "../../util/utils";
import privateClient from "../config/private.client";

const codingEndpoints = {
    updateUserCoding: (trackId: number) => `/coding-exercise/tracking-coding-exercise/${trackId}/userCoding`,
    completeTracking: (trackId: number) => `/coding-exercise/tracking-coding-exercise/${trackId}/complete`,
    getTrackingExOfUser: (exId: number) => `/coding-exercise/${exId}/tracking-coding-exercise`,
    getById: (exId: number) => `/coding-exercise/${exId}`,
    createDraft: "/coding-exercise",
    addAuthorSolution: (exId: number) => `/coding-exercise/${exId}/author-solution`,
    addLanguage: (exId: number) => `/coding-exercise/${exId}/language`,
    addRelatedLecture: (exId: number) => `/coding-exercise/${exId}/relatedLecture`,
    addCodeStarter: (exId: number) => `/coding-exercise/${exId}/codeStarter`,
    addHint: (exId: number) => `/coding-exercise/${exId}/hint`,
    addSolutionExplanation: (exId: number) => `/coding-exercise/${exId}/solutionExplanation`,
    addInstruction: (exId: number) => `/coding-exercise/${exId}/instruction`,
    addEvaluation: (exId: number) => `/coding-exercise/${exId}/evaluation`,
    publishCodingExercise: (exId: number) => `/coding-exercise/${exId}/publish`,
    getByLecture: "/coding-exercise/lecture",
    getByChapter: "/coding-exercise"
}

const codingApi = {
    updateUserCoding: async (trackId: number, code: string) => {
        try {
            const response = await privateClient.put<TrackingCodingEx>(
                codingEndpoints.updateUserCoding(trackId),
                null, {
                    params: {
                        code
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

    completeTracking: async (trackId: number) => {
        try {
            const response = await privateClient.put<TrackingCodingEx>(
                codingEndpoints.completeTracking(trackId)
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

    getTrackingExOfUser: async (userId: string, exId: number) => {
        try {
            const response = await privateClient.get<TrackingCodingEx>(
                codingEndpoints.getTrackingExOfUser(exId),
                {
                    params: {
                        userId
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

    getById: async (exId: number) => {
        try {
            const response = await privateClient.get<CodingExercise>(
                codingEndpoints.getById(exId)
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

    createDraft: async (chapterId: string, title: string) => {
        try {
            const response = await privateClient.post<CodingExercise>(
                codingEndpoints.createDraft, 
                null, {
                    params: { chapterId, title }
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

    addAuthorSolution: async (exId: number, solution: string, evaluation: string, result: string) => {
        try {
            const response = await privateClient.put<CodingExercise>(
                codingEndpoints.addAuthorSolution(exId), 
                null, {
                    params: {
                        solution,
                        evaluation,
                        result
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

    addRelatedLecture: async (exId: number, lectureId: string) => {
        try {
            const response = await privateClient.put<string>(
                codingEndpoints.addRelatedLecture(exId), 
                null, {
                    params: {
                        lectureId
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

    addCodeStarter: async (exId: number, codeStarter: string) => {
        try {
            const response = await privateClient.put<string>(
                codingEndpoints.addCodeStarter(exId), 
                null, {
                    params: {
                        codeStarter
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

    addHint: async (exId: number, hint: string) => {
        try {
            const response = await privateClient.put<string>(
                codingEndpoints.addHint(exId), 
                null, {
                    params: {
                        hint
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

    addSolutionExplanation: async (exId: number, solutionExplanation: string) => {
        try {
            const response = await privateClient.put<string>(
                codingEndpoints.addSolutionExplanation(exId), 
                null, {
                    params: {
                        solutionExplanation
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

    addLanguage: async (exId: number, languageId: number) => {
        try {
            const response = await privateClient.put<number>(
                codingEndpoints.addLanguage(exId), 
                null, {
                    params: {
                        languageId
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

    addInstruction: async (exId: number, instruction: string) => {
        try {
            const response = await privateClient.put<string>(
                codingEndpoints.addInstruction(exId), 
                null, {
                    params: {
                        instruction
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

    addEvaluation: async (exId: number, evaluation: string) => {
        try {
            const response = await privateClient.put<string>(
                codingEndpoints.addEvaluation(exId), 
                null, {
                    params: {
                        evaluation
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

    publishCodingExercise: async (exId: number) => {
        try {
            const response = await privateClient.put<string>(
                codingEndpoints.publishCodingExercise(exId)
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

    getByLecture: async (lectureId: string) => {
        try {
            const response = await privateClient.get<CodingExercise[]>(
                codingEndpoints.getByLecture, 
                {
                    params: { lectureId }
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

    getByChapter: async (chapterId: string) => {
        try {
            const response = await privateClient.get<CodingExercise[]>(
                codingEndpoints.getByChapter, 
                {
                    params: { chapterId }
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
}

export default codingApi