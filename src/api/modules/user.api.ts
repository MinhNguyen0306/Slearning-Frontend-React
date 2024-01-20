import axios from "axios";
import { WorkExperienceRequest } from "../../types/model/WorkExperience";
import { ApiResponse } from "../../types/payload/response/ApiResponse";
import { PageRequest } from "../../types/payload/PageRequest";
import { UpdateUserRequest } from "../../types/payload/UserPayload";
import privateClient from "../config/private.client";
import publicClient from "../config/public.client";
import { User, UserStatus } from "../../types/model/User";
import { ApiErrorResponse } from "../../types/payload/ApiErrorResponse";
import { ResolveStatus } from "../../types/payload/enums/ResolveStatus";
import { PageResponse } from "../../types/payload/response/PageResponse";
import { isAxiosError } from "../../util/utils";
import { AdminFetchUserState } from "../../types/payload/enums/AdminFetchUserState";
import { AdminFetchCourseState } from "../../types/payload/enums/AdminFetchCourseState";
import { Course } from "../../types/model/Course";

const userEndpoints = {
    getAll: 'users',
    filterUserByStatus: 'users/status',
    getUsersByAdminFetchState: 'users/fetch-state',
    getCoursesByAdminFetchState: 'courses/fetch-state',
    getById: (userId: string) => `users/${userId}`,
    update: (userId: string) => `users/${userId}`,
    updateAbout: (userId: string) => `users/${userId}/about`,
    updateWorkExperience: (userId: string) => `users/${userId}/work-experience`,
    updateAvatar: (userId: string) => `users/${userId}/avatar`,
    registerInstructor: (userId: string) => `users/${userId}/register-instructor`,
    resolveRegisterInstructor: (userId: string) => `users/${userId}/register-instructor/resolve`,
    lock: (userId: string) => `users/${userId}/lock`,

}

const userApi = {
    getAll: async (pageRequest?: PageRequest) => {
        try {
            const response = await publicClient.get<PageResponse<User>>(
                userEndpoints.getAll,
                { params: pageRequest }
            )

            return { response };
        } catch (error) {
            if(axios.isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    filterUserByStatus: async (userStatus: UserStatus) => {
        try {
            const response = await publicClient.get(
                userEndpoints.filterUserByStatus,
                { params: { status: userStatus } }
            )
            
            return { response }
        } catch (error) {
            if(axios.isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    getUsersByAdminFetchState: async (pageRequest: PageRequest, adminFetchUserState: AdminFetchUserState) => {
        try {
            const response = await publicClient.get<PageResponse<User>>(
                userEndpoints.getUsersByAdminFetchState,
                { 
                    params: { 
                        pageNumber: pageRequest.pageNumber,
                        pageSize: pageRequest.pageSize,
                        state: adminFetchUserState 
                    } 
                }
            )

            return { response }
        } catch (error) {
            if(axios.isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    getCoursesByAdminFetchState: async (pageRequest: PageRequest, adminFetchCourseState: AdminFetchCourseState) => {
        try {
            const response = await publicClient.get<PageResponse<Course>>(
                userEndpoints.getCoursesByAdminFetchState,
                { 
                    params: { 
                        pageNumber: pageRequest.pageNumber,
                        pageSize: pageRequest.pageSize,
                        state: adminFetchCourseState 
                    } 
                }
            )

            return { response }
        } catch (error) {
            if(axios.isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    getById: async (userId: string) => {
        try {
            const response = await publicClient.get<User>(
                userEndpoints.getById(userId)
            );

            return { response }
        } catch (error) {
            if(axios.isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    update: async (userId: string, updateRequest: UpdateUserRequest) => {
        try {
            const response = await privateClient.post(
                userEndpoints.update(userId),
                { updateRequest }
            )

            return { response }
        } catch (error) {
            return { error }
        }
    },

    updateAbout: async (userId: string, about: string) => {
        try {
            const response = await privateClient.patch<User>(
                userEndpoints.updateAbout(userId),
                null, { params: { about } }
            )

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            } 
            throw new Error("Loi he thong")
        }
    },

    updateWorkExperience: async (userId: string, workExperience: WorkExperienceRequest) => {
        try {
            const response = await privateClient.put<User>(
                userEndpoints.updateWorkExperience(userId),
                workExperience
            )

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            } 
            throw new Error("Loi he thong")
        }
    },

    updateAvatar: async (userId: string, avatar: FormData) => {
        try {
            const response = await privateClient.put<User>(
                userEndpoints.updateAvatar(userId),
                avatar,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            return { response }
        } catch (error) {
            return { error }
        }
    },

    registerInstructor: async (userId: string) => {
        try {
            const response = await privateClient.patch<ApiResponse>(
                userEndpoints.registerInstructor(userId),
            )

            return { response }
        } catch (error) {
            if(axios.isAxiosError<ApiResponse>(error)) {
                return { error }
            } else {
                throw new Error("System error");
            }
        }
    },

    resolveRegisterInstructor: async (userId: string, resolveStatus: ResolveStatus) => {
        try {
            const response = await privateClient.patch<ApiResponse>(
                userEndpoints.resolveRegisterInstructor(userId),
                null, {params: { status: resolveStatus }}
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiResponse>(error)) {
                return { error }
            } else {
                throw new Error("System error");
            }
        }
    },

    lock: async (userId: string) => {
        try {
            const response = await privateClient.patch(
                userEndpoints.lock(userId)
            )

            return { response }
        } catch (error) {
            return { error }
        }
    }
}

export default userApi;