import { Chapter } from "../../types/model/Chapter";
import { ApiErrorResponse } from "../../types/payload/ApiErrorResponse";
import { isAxiosError } from "../../util/utils";
import privateClient from "../config/private.client";
import publicClient from "../config/public.client";

const chapterEndpoints = {
    create: 'chapters',
    getById: (chapterId: string) => `chapters/${chapterId}`,
    getChapterOfLecture: (lectureId: string) => `/chapters/lectures/${lectureId}`
}

const chapterApi = {
    create: async (courseId: string, title: string, description?: string) => {
        try {
            const response = await privateClient.post<Chapter>(
                chapterEndpoints.create,
                null, { params: { courseId, title, description } }
            )

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    getById: async (chapterId: string) => {
        try {
            const response = await publicClient.get<Chapter>(
                chapterEndpoints.getById(chapterId)
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    getChapterOfLecture: async (chapterId: string) => {
        try {
            const response = await publicClient.get<Chapter>(
                chapterEndpoints.getChapterOfLecture(chapterId)
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },
}

export default chapterApi;