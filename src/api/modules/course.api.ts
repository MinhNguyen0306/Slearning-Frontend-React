import { PageRequest } from "../../types/payload/PageRequest";
import { CourseStatus } from "../../types/payload/enums/CourseStatus";
import privateClient from "../config/private.client";
import publicClient from "../config/public.client";
import { Topics } from "../../types/model/Topic";
import { Levels } from "../../types/model/Level";
import { CreateRequest } from "../../types/payload/CoursePayload";
import { isAxiosError } from "../../util/utils";
import { Course } from "../../types/model/Course";
import { PageResponse } from "../../types/payload/response/PageResponse";
import { ApiResponse } from "../../types/payload/response/ApiResponse";
import { ResolveStatus } from "../../types/payload/enums/ResolveStatus";
import { ApiErrorResponse } from "../../types/payload/ApiErrorResponse";
import { CourseRating, CourseRatings } from "../../types/model/CourseRating";

const courseEndpoints = {
    search: '/courses/search',
    getAll: 'courses',
    getById: (courseId: string) => `courses/${courseId}`,
    getPublishingById: (courseId: string) => `courses/${courseId}/publishing`,
    getByUser: (userId: string) => `courses/user/${userId}`,
    getByStatus: 'courses/status',
    getByPayment: (paymentId: string) => `courses/payment/${paymentId}`,
    getByRating: 'courses/rating',
    getByTopic: 'courses/topic',
    getByLevel: 'courses/level',
    getByPrice: 'courses/price',
    createDraft: 'courses/create/draft',
    update: (courseId: string) => `courses/${courseId}`,
    updateTitle: (courseId: string) => `/courses/${courseId}/update/title`,
    updatePrice: (courseId: string) => `/courses/${courseId}/update/price`,
    updateIntro: (courseId: string) => `/courses/${courseId}/update/introduce`,
    updateDescription: (courseId: string) => `/courses/${courseId}/update/description`,
    updateAchievement: (courseId: string) => `/courses/${courseId}/update/achievement`,
    updateRequirement: (courseId: string) => `/courses/${courseId}/update/requirement`,
    updateImageCourse: (courseId: string) => `/courses/${courseId}/update/image`,
    updateTopic: (courseId: string) => `/courses/${courseId}/update/topic`,
    updateLevel: (courseId: string) => `/courses/${courseId}/update/level`,
    publishCourse: (courseId: string) => `courses/${courseId}/request-publish`,
    unPublish: (courseId: string) => `courses/publishing/${courseId}`,
    resolve: (courseId: string) => `courses/resolving/${courseId}`,
    ratingCourse: "/courses/rating",
    getRatings: (courseId: string) => `/courses/${courseId}/ratings`
}

const courseApi = {
    search: async (searchKey: string, pageRequest: PageRequest) => {
        try {
            const response = await publicClient.get<PageResponse<Course>>(
                courseEndpoints.search,
                { 
                    params: {
                        searchKey,
                        pageRequest
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

    getAll: async (pageRequest: PageRequest) => {
        try {
            const response = await publicClient.get<PageResponse<Course>>(
                courseEndpoints.getAll,
                { params: pageRequest }
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

    getById: async (courseId: string) => {
        try {
            const response = await publicClient.get<Course>(
                courseEndpoints.getById(courseId)
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

    getByPayment: async (paymentId: string) => {
        try {
            const response = await privateClient.get<Course>(
                courseEndpoints.getByPayment(paymentId)
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("Loi he thong")
            }
        }
    },

    getPublishingById: async (courseId: string) => {
        try {
            const response = await publicClient.get<Course>(
                courseEndpoints.getPublishingById(courseId)
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

    getByUser: async (userId: string, pageRequest?: PageRequest) => {
        try {
            const response = await publicClient.get(
                courseEndpoints.getByUser(userId)
            )

            return { response }
        } catch (error) {
            return { error }
        }
    },

    getByStatus: async (courseStatus: CourseStatus, pageRequest: PageRequest, userId?: string) => {
        try {
            const response = await publicClient.get<PageResponse<Course>>(
                courseEndpoints.getByStatus,
                {
                    params: {
                        pageRequest, 
                        userId,
                        status: courseStatus
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

    getByRating: async (rating: number, pageRequest: PageRequest) => {
        try {
            const response = await privateClient.get(
                courseEndpoints.getByRating,
                {
                    params: {
                        rating,
                        pageRequest
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

    getByTopic: async (topics: Topics, pageRequest: PageRequest) => {
        try {
            const response = await publicClient.get(
                courseEndpoints.getByTopic,
                {
                    params: {
                        topics,
                        pageRequest
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

    getByLevel: async (levels: Levels, pageRequest: PageRequest) => {
        try {
            const response = await publicClient.get(
                courseEndpoints.getByLevel,
                {
                    params: {
                        levels,
                        pageRequest
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

    getByPrice: async (fromPrice: number, toPrice:number, pageRequest: PageRequest) => {
        try {
            const response = await publicClient.get(
                courseEndpoints.getByPrice,
                {
                    params: {
                        fromPrice,
                        toPrice,
                        pageRequest
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

    createDraft: async (userId: string, title: string) => {
        try {
            const response = await privateClient.post<Course>(
                courseEndpoints.createDraft,
                null, { params: { userId, title } }
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

    update: async (courseId: string, updateRequest: CreateRequest) => {
        try {
            const response = await privateClient.put(
                courseEndpoints.update(courseId),
                null, {
                    params: {
                        updateRequest
                    }
                }
            )

            return { response }
        } catch (error) {
            return { error }
        }
    },

    updateTitle: async (courseId: string, title: string) => {
        try {
            const response = await privateClient.patch<string>(
                courseEndpoints.updateTitle(courseId), 
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

    updatePrice: async (courseId: string, price: number) => {
        try {
            const response = await privateClient.patch<string>(
                courseEndpoints.updatePrice(courseId), 
                null, { params: { price } }
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

    updateIntro: async (courseId: string, introduce: string) => {
        try {
            const response = await privateClient.patch<string>(
                courseEndpoints.updateIntro(courseId), 
                null, { params: { introduce } }
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

    updateDescription: async (courseId: string, description: string) => {
        try {
            const response = await privateClient.patch<string>(
                courseEndpoints.updateDescription(courseId), 
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

    updateAchievement: async (courseId: string, achievement: string) => {
        try {
            const response = await privateClient.patch<string>(
                courseEndpoints.updateAchievement(courseId), 
                null, { params: { achievement } }
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

    updateRequirement: async (courseId: string, requirement: string) => {
        try {
            const response = await privateClient.patch(
                courseEndpoints.updateRequirement(courseId), 
                null, { params: { requirement } }
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

    updateImageCourse: async (courseId: string, image: FormData) => {
        try {
            const response = await privateClient.put<ApiResponse>(
                courseEndpoints.updateImageCourse(courseId), 
                image, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    updateTopic: async (courseId: string, topicId: string) => {
        try {
            const response = await privateClient.put<ApiResponse>(
                courseEndpoints.updateTopic(courseId), 
                null, {
                    params: { topicId }
                }
            );

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    updateLevel: async (courseId: string, levelId: number) => {
        try {
            const response = await privateClient.put<ApiResponse>(
                courseEndpoints.updateLevel(courseId), 
                null, {
                    params: { levelId }
                }
            );

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    publishCourse: async (courseId: string) => {
        try {
            const response = await privateClient.put<ApiResponse>(
                courseEndpoints.publishCourse(courseId)
            );

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    unPublish: async (courseId: string) => {
        try {
            const response = await privateClient.patch(
                courseEndpoints.unPublish(courseId)
            )

            return { response }
        } catch (error) {
            return { error }
        }
    },

    resolve: async (courseId: string, resolveStatus: ResolveStatus) => {
        try {
            const response = await privateClient.patch<ApiResponse>(
                courseEndpoints.resolve(courseId),
                null, {
                    params: {
                        status: resolveStatus
                    }
                }
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

    ratingCourse: async (userId: string, courseId: string, rating: number, comment?: string) => {
        try {
            const response = await privateClient.post<ApiResponse>(
                courseEndpoints.ratingCourse,
                null, {
                    params: {
                        userId, 
                        courseId, 
                        rating,
                        comment 
                    }
                }
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

    getRatings: async (courseId: string) => {
        try {
            const response = await privateClient.get<CourseRatings>(
                courseEndpoints.getRatings(courseId)
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    }
}

export default courseApi;