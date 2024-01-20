import { Course } from "../../types/model/Course";
import { Progress } from "../../types/model/Progress";
import { ApiErrorResponse } from "../../types/payload/ApiErrorResponse";
import { PageRequest } from "../../types/payload/PageRequest";
import { PageResponse } from "../../types/payload/response/PageResponse";
import { isAxiosError } from "../../util/utils";
import privateClient from "../config/private.client";

const progressEndpoints = {
    getMyLearning: (userId: string) => `/progress/${userId}`,
    getCurrentProgress: (userId: string, courseId: string) => `/progress/${userId}/course/${courseId}`,
    getNextProgress: (userId: string, courseId: string) => `/progress/${userId}/course/${courseId}/next`,
    getProgressCourseOfUser: (userId: string, courseId: string) => `/progress/user/${userId}/course/${courseId}`,
    getProgressOfLecture: (userId: string, lectureId: string) => `/progress/${userId}/lecture/${lectureId}`,
    checkOpenTest: '/progress/test',
}

const progressApi = {
    getMyLearning: async(userId: string, pageRequest?: PageRequest) => {
        try {
            const response = await privateClient.get<PageResponse<Course>>(
                progressEndpoints.getMyLearning(userId),
                {
                    params: pageRequest
                }
            )

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            } else {
                throw new Error("Loi he thong")
            }
        }
    },

    getCurrentProgress: async (userId: string, courseId: string) => {
        try {   
            const response = await privateClient.get<Progress>(
                progressEndpoints.getCurrentProgress(userId, courseId)
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            } else {
                throw new Error("Loi he thong")
            }
        }
    },

    getNextProgress: async (userId: string, courseId: string, lectureId: string, grade?: number) => {
        try {
            const response = await privateClient.post<Progress>(
                progressEndpoints.getNextProgress(userId, courseId),
                null, {
                    params: {
                        lectureId,
                        grade
                    }
                }
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            } else {
                throw new Error("Loi he thong")
            }
        }
    },

    getProgressCourseOfUser: async (userId: string, courseId: string) => {
        try {
            const response = await privateClient.get<Progress[]>(
                progressEndpoints.getProgressCourseOfUser(userId, courseId)
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            } else {
                throw new Error("Loi he thong")
            }
        }
    },

    getProgressOfLecture: async (userId: string, lectureId: string) => {
        try {
            const response = await privateClient.get<Progress>(
                progressEndpoints.getProgressOfLecture(userId, lectureId)
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            } else {
                throw new Error("Loi he thong")
            }
        }
    },

    checkOpenTest: async (userId: string, chapterId: string) => {
        try {
            const response = await privateClient.get<boolean>(
                progressEndpoints.checkOpenTest,
                {
                    params: {
                        userId, chapterId
                    }
                }
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            } else {
                throw new Error("Loi he thong")
            }
        }
    }
}

export default progressApi;