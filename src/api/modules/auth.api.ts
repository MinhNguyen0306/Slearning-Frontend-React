import publicClient from "../config/public.client";
import { LoginRequest } from "../../types/payload/request/LoginRequest"
import { RegisterRequest } from "../../types/payload/RegisterPayload";
import axios from "axios";
import { ApiErrorResponse } from "../../types/payload/ApiErrorResponse";
import { ApiResponse } from "../../types/payload/response/ApiResponse";
import { AuthenticationResponse, Tokens } from "../../types/payload/response/AuthenticationResponse";
import { isAxiosError } from "../../util/utils";

const authEntpoints = {
    register: (role: number) => `auth/register?role=${role}`,
    login: 'auth/login',
    refreshToken: (userId: string) => `auth/${userId}/refresh-token`
}

const authApi = {
    login: async (loginRequest: LoginRequest) => {
        try {
            const response = await publicClient.post<AuthenticationResponse>(
                authEntpoints.login,
                loginRequest                
            )
            return { response };
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            } else {
                throw new Error("Lỗi hệ thống");
            }
        }
    },
    
    register: async (role: number, registerRequest: RegisterRequest) => {
        try {
            const response = await publicClient.post<AuthenticationResponse>(
                authEntpoints.register(role),
                registerRequest
            )

            return { response }
        } catch (error) {
            if(isAxiosError(error)) {
                return { error }
            } else {
                throw new Error("Lỗi hệ thống");
            }
        }
    },

    refreshToken: async (userId: string) => {
        try {
            const response = await publicClient.post<AuthenticationResponse>(
                authEntpoints.refreshToken(userId)
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiResponse>(error)) {
                return { error }
            } else {
                throw new Error("Lỗi hệ thống");
            }
        }
    }
}

export default authApi
