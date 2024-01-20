import { Lecture } from "../../types/model/Lecture";
import { LectureFileAttachs } from "../../types/model/LectureFileAttach";
import { ApiErrorResponse } from "../../types/payload/ApiErrorResponse";
import { PublishStatus } from "../../types/payload/enums/PublishStatus";
import { isAxiosError } from "../../util/utils";
import privateClient from "../config/private.client";
import publicClient from "../config/public.client";

const lectureEndpoints = {
    create: "lectures",
    getById: (lectureId: string) => `lectures/${lectureId}`,
    uploadVideo: (lectureId: string) => `lectures/${lectureId}/upload-video`,
    updateTitle: (lectureId: string) => `/lectures/${lectureId}/update/title`,
    updateDescription: (lectureId: string) => `/lectures/${lectureId}/update/description`,
    updatePreviewed: (lectureId: string) => `/lectures/${lectureId}/previewed`,
    updatePublishing: (lectureId: string) => `/lectures/${lectureId}/publishing`,
    getFilesAttachOfLecture: (lectureId: string) => `/lectures/${lectureId}/file-attach`,
    uploadLectureFileAttach: (lectureId: string) => `/lectures/${lectureId}/upload-file-attach`,
    deleteLectureFileAttach: (fileAttachId: string) => `/lectures/${fileAttachId}`
}

const lectureApi = {
    create: async (chapterId: string, title: string, description?: string) => {
        try {
            const response = await privateClient.post<Lecture>(
                lectureEndpoints.create,
                null, { params: { chapterId, title, description } }
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

    getById: async (lectureId: string, publishStatus?: PublishStatus) => {
        try {
            const response = await publicClient.get<Lecture>(
                lectureEndpoints.getById(lectureId),
                {
                    params: {
                        publishStatus
                    }
                }
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

    uploadVideo: async (lectureId: string, video: FormData, videoDuration: number) => {
        try {
            const response = await privateClient.post<Lecture>(
                lectureEndpoints.uploadVideo(lectureId),
                video, {
                    params: {
                        videoDuration
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
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

    getFilesAttachOfLecture: async (lectureId: string) => {
        try {
            const response = await publicClient.get<LectureFileAttachs>(
                lectureEndpoints.getFilesAttachOfLecture(lectureId),
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

    uploadLectureFileAttach: async (lectureId: string, formData: FormData) => {
        try {
            const response = await privateClient.post<boolean>(
                lectureEndpoints.uploadLectureFileAttach(lectureId),
                formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
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

    deleteLectureFileAttach: async (fileAttachId: string) => {
        try {
            const response = await privateClient.delete(
                lectureEndpoints.deleteLectureFileAttach(fileAttachId),
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

    updateTitle: async (lectureId: string, title: string) => {
        try {
            const response = await privateClient.patch<string>(
                lectureEndpoints.updateTitle(lectureId), 
                null, { params: { title } }
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

    updateDescription: async (lectureId: string, description: string) => {
        try {
            const response = await privateClient.patch<string>(
                lectureEndpoints.updateDescription(lectureId), 
                null, { params: { description } }
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

    updatePreviewed: async (lectureId: string) => {
        try {
            const response = await privateClient.patch<boolean>(
                lectureEndpoints.updatePreviewed(lectureId), 
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

    updatePublishing: async (lectureId: string) => {
        try {
            const response = await privateClient.patch<PublishStatus>(
                lectureEndpoints.updatePublishing(lectureId), 
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
}

export default lectureApi;