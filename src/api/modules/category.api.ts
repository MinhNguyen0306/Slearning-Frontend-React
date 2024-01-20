import { Category } from "../../types/model/Category";
import { Levels } from "../../types/model/Level";
import { SubCategory } from "../../types/model/SubCategory";
import { Topic } from "../../types/model/Topic";
import { ApiErrorResponse } from "../../types/payload/ApiErrorResponse";
import { PageRequest } from "../../types/payload/PageRequest";
import { PageResponse } from "../../types/payload/response/PageResponse";
import { isAxiosError } from "../../util/utils";
import privateClient from "../config/private.client";
import publicClient from "../config/public.client";

const categoryEndpoints = {
    getAll: 'categories',
    getAllSubcategories: 'categories/subCategories',
    getAllSubcategoriesOfCategory: (categoryId: string) => `categories/${categoryId}/subCategories`,
    getAllTopics: 'categories/topics',
    getAllTopicsOfSubCategory: (subCategoryId: string) => `categories/${subCategoryId}/topics`,
    getAllLevels: 'categories/levels',
    getById: (categoryId: string) => `categories/${categoryId}`,
    create: 'categories/create',
    createSubCategory: 'categories/subCategories',
    createTopic: 'categories/topics',
    update: (categoryId: string) => `categories/${categoryId}`,
    delete: (categoryId: string) => `categories/${categoryId}`,
}

const categoryApi = {
    getAll: async (pageRequest?: PageRequest) => {
        try {
            const response = await publicClient.get<PageResponse<Category>>(
                categoryEndpoints.getAll,
                {
                    params: pageRequest
                }
            )

            return { response };
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    getAllSubCategories: async (pageRequest?: PageRequest) => {
        try {
            const response = await publicClient.get<PageResponse<SubCategory>>(
                categoryEndpoints.getAllSubcategories,
                {
                    params: pageRequest
                }
            )

            return { response };
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    getAllSubCategoriesOfCategory: async (categoryId: string, pageRequest?: PageRequest) => {
        try {
            const response = await publicClient.get<PageResponse<SubCategory>>(
                categoryEndpoints.getAllSubcategoriesOfCategory(categoryId),
                {
                    params: pageRequest
                }
            )

            return { response };
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    getAllTopics: async (pageRequest?: PageRequest) => {
        try {
            const response = await publicClient.get<PageResponse<Topic>>(
                categoryEndpoints.getAllTopics,
                {
                    params: pageRequest
                }
            )

            return { response };
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    getAllTopicsOfSubCategory: async (subCategoryId: string, pageRequest?: PageRequest) => {
        try {
            const response = await publicClient.get<PageResponse<Topic>>(
                categoryEndpoints.getAllTopicsOfSubCategory(subCategoryId),
                {
                    params: pageRequest
                }
            )

            return { response };
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    getAllLevels: async () => {
        try {
            const response = await publicClient.get<Levels>(
                categoryEndpoints.getAllLevels,
            )

            return { response };
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    getById: async (categoryId: string) => {
        try {
            const response = await privateClient.get(
                categoryEndpoints.getById(categoryId)
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

    create: async (title: string) => {
        try {
            const response = await privateClient.post<Category>(
                categoryEndpoints.create,
                null, { params: { title } }
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

    createSubCategory: async (title: string, categoryId: string) => {
        try {
            const response = await privateClient.post<Category>(
                categoryEndpoints.createSubCategory,
                null, { params: { title, categoryId } }
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

    createTopic: async (title: string, subCategoryId: string) => {
        try {
            const response = await privateClient.post<Category>(
                categoryEndpoints.createTopic,
                null, { params: { title, subCategoryId } }
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

    update: async (categoryId: string, title: string) => {
        try {
            const response = await privateClient.post<Category>(
                categoryEndpoints.update(categoryId),
                { title }
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

    delete: async (categoryId: string) => {
        try {
            const response = await privateClient.delete(
                categoryEndpoints.delete(categoryId)
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

export default categoryApi;