import { Payment } from "../../types/model/Payment";
import { ApiErrorResponse } from "../../types/payload/ApiErrorResponse";
import { Top5CourseResponse } from "../../types/payload/response/Top5CourseResponse";
import { Top5RateResponse } from "../../types/payload/response/Top5RateResponse";
import { Top5TopicResponse } from "../../types/payload/response/Top5TopicResponse";
import { isAxiosError } from "../../util/utils";
import privateClient from "../config/private.client";

const statisticEndpoints = {
    statisticTurnOverMentor: (mentorId: string) => `/statistic/${mentorId}/turnover`,
    statisticTop5Course: (mentorId: string) => `/statistic/${mentorId}/top-5-course`,
    statisticTop5Topic: (mentorId: string) => `/statistic/${mentorId}/top-5-topic`,
    statisticTop5Rate: (mentorId: string) => `/statistic/${mentorId}/top-5-rate`,
}

const statisticApi = {
    statisticTurnOverMentor: async (mentorId: string) => {
        try {
            const response = await privateClient.get<Payment[]>(
                statisticEndpoints.statisticTurnOverMentor(mentorId)
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

    Top5CourseResponse: async (mentorId: string) => {
        try {
            const response = await privateClient.get<Top5CourseResponse>(
                statisticEndpoints.statisticTop5Course(mentorId)
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

    statisticTop5Topic: async (mentorId: string) => {
        try {
            const response = await privateClient.get<Top5TopicResponse>(
                statisticEndpoints.statisticTop5Topic(mentorId)
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

    statisticTop5Rate: async (mentorId: string) => {
        try {
            const response = await privateClient.get<Top5RateResponse>(
                statisticEndpoints.statisticTop5Rate(mentorId)
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

export default statisticApi;