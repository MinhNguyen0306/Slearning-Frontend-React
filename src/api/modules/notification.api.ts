import { DeviceType } from "../../types/payload/enums/DeviceType";
import privateClient from "../config/private.client";
import { ApiResponse } from "../../types/payload/response/ApiResponse";
import { isAxiosError } from "../../util/utils";
import { Notice } from "../../types/model/Notice";

const notificationEndpoints = {
    storeDeviceToken: 'notification/firebase/store/device-token',
    sendNotification: 'notification/firebase/send-notification',
    subcribeTopic: (userId: string) => `${userId}/notification/firebase/subscribe-topic`,
    unSubcribeTopic: (userId: string) => `${userId}/notification/firebase/unsubscribe-topic`,
}

const notificationApi = {
    storeDeviceToken: async (userId: string, token: string, deviceType: DeviceType) => {
        try {
            const response = await privateClient.post<ApiResponse>(
                notificationEndpoints.storeDeviceToken,
                null, {
                    params: {
                        userId,
                        token, 
                        deviceType
                    }
                }
            )

            return { response };
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    sendNotification: async (notice: Notice, link: string) => {
        try {
            const response = await privateClient.post<string>(
                notificationEndpoints.sendNotification,
                notice, {
                    params: { link }
                }
            )

            return { response };
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    subscribeTopic: async (userId: string, topic: string) => {
        try {
            const response = await privateClient.post<ApiResponse>(
                notificationEndpoints.subcribeTopic(userId),
                null, {
                    params: {
                        topic
                    }
                }
            )

            return { response };
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },

    unSubscribeTopic: async (userId: string, topic: string) => {
        try {
            const response = await privateClient.post<ApiResponse>(
                notificationEndpoints.unSubcribeTopic(userId),
                null, {
                    params: {
                        topic
                    }
                }
            )

            return { response };
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            }  else {
                throw new Error("System error")
            }
        }
    },
}

export default notificationApi;