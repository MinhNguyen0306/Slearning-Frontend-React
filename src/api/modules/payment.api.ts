import { AdminPayment } from "../../types/model/AdminPayment";
import { Payment } from "../../types/model/Payment";
import { ApiErrorResponse } from "../../types/payload/ApiErrorResponse";
import { PageRequest } from "../../types/payload/PageRequest";
import { CreateVnpayRequest } from "../../types/payload/request/CreateVnpayRequest";
import { PageResponse } from "../../types/payload/response/PageResponse";
import { isAxiosError } from "../../util/utils";
import privateClient from "../config/private.client";
import publicClient from "../config/public.client";

const paymentEndpoints = {
    withdrawMoney: "/payments/withdraw-money",
    vnpay: '/payments/vnpay',
    createPaymentVnpay: '/payments/create/vnpay-payment',
    adminVnpay: '/payments/vnpay/admin',
    resolveAdminPaymentVnpay: '/payments/create/vnpay-payment/admin',
    getPendingAdminPayment: '/payments/admin-payment/pending',
    getSuccessAdminPayment: '/payments/admin-payment/success',
    getPaymentOfCourse: (courseId: string) => `/payments/course/${courseId}`,
    getPaymentOfUser: (userId: string) => `/payments/user/${userId}`,
    getMonthlyPaymentOfUser: (userId: string) => `/payments/user/${userId}/monthly-payment`,
    getAllAdminPaymentsOfUser: (userId: string) => `/payments/user/${userId}/admin-payment/all`,
    getExcelPaymentsInMonthOfUser: "/payments/payments-in-month/excel",
    getCurrentRevenueOfMentor: ("/payments/current-month-revenue")
}

const paymentApi = {
    withdrawMoney: async (userId: string, amount: number) => {
        try {
            const response = await privateClient.post<AdminPayment>(
                paymentEndpoints.withdrawMoney, 
                null, {
                    params: {
                        userId, 
                        amount
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

    getPendingAdminPayment: async (pageRequest?: PageRequest) => {
        try {
            const response = await privateClient.get<PageResponse<AdminPayment>>(
                paymentEndpoints.getPendingAdminPayment,
                {
                    params: {
                        pageRequest
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

    getSuccessAdminPayment: async (pageRequest?: PageRequest) => {
        try {
            const response = await privateClient.get<PageResponse<AdminPayment>>(
                paymentEndpoints.getSuccessAdminPayment,
                {
                    params: {
                        pageRequest
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

    getCurrentRevenueOfMentor: async (userId: string) => {
        try {
            const response = await privateClient.get<number>(
                paymentEndpoints.getCurrentRevenueOfMentor,
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
    } ,

    vnpay: async (amount: number, courseId: string, userId: string) => {
        try {
            const response = await privateClient.post<string>(
                paymentEndpoints.vnpay, 
                null, {
                    params: {
                        amount,
                        bankCode: 'VNBANK',
                        courseId,
                        userId
                    }
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

    createVnpayPayment: async (createVnpayRequest: CreateVnpayRequest) => {
        try {
            const response = await privateClient.post<string>(
                paymentEndpoints.createPaymentVnpay, 
                null, {
                    params: {
                        vnp_Amount: createVnpayRequest.vnp_Amount,
                        vnp_BankCode: createVnpayRequest.vnp_BankCode,
                        vnp_BankTranNo: createVnpayRequest.vnp_BankTranNo,
                        vnp_CardType: createVnpayRequest.vnp_CardType,
                        vnp_OrderInfo: createVnpayRequest.vnp_OrderInfo,
                        vnp_PayDate: createVnpayRequest.vnp_PayDate,
                        vnp_ResponseCode: createVnpayRequest.vnp_ResponseCode,
                        vnp_SecureHash: createVnpayRequest.vnp_SecureHash,
                        vnp_TmnCode: createVnpayRequest.vnp_TmnCode,
                        vnp_TransactionNo: createVnpayRequest.vnp_TransactionNo,
                        vnp_TransactionStatus: createVnpayRequest.vnp_TransactionStatus,
                        vnp_TxnRef: createVnpayRequest.vnp_TxnRef,
                    }
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

    vnpayAdmin: async (amount: number, adminPaymentId: string) => {
        try {
            const response = await privateClient.post<string>(
                paymentEndpoints.adminVnpay, 
                null, {
                    params: {
                        amount,
                        bankCode: 'VNBANK',
                        adminPaymentId
                    }
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

    resolveAdminVnpayPayment: async (createVnpayRequest: CreateVnpayRequest) => {
        try {
            const response = await privateClient.post<string>(
                paymentEndpoints.resolveAdminPaymentVnpay, 
                null, {
                    params: {
                        vnp_Amount: createVnpayRequest.vnp_Amount,
                        vnp_BankCode: createVnpayRequest.vnp_BankCode,
                        vnp_BankTranNo: createVnpayRequest.vnp_BankTranNo,
                        vnp_CardType: createVnpayRequest.vnp_CardType,
                        vnp_OrderInfo: createVnpayRequest.vnp_OrderInfo,
                        vnp_PayDate: createVnpayRequest.vnp_PayDate,
                        vnp_ResponseCode: createVnpayRequest.vnp_ResponseCode,
                        vnp_SecureHash: createVnpayRequest.vnp_SecureHash,
                        vnp_TmnCode: createVnpayRequest.vnp_TmnCode,
                        vnp_TransactionNo: createVnpayRequest.vnp_TransactionNo,
                        vnp_TransactionStatus: createVnpayRequest.vnp_TransactionStatus,
                        vnp_TxnRef: createVnpayRequest.vnp_TxnRef,
                    }
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

    getPaymentOfCourse: async (userId: string, courseId: string) => {
        try {
            const response = await privateClient.get<Payment>(
                paymentEndpoints.getPaymentOfCourse(userId),
                {
                    params: {
                        courseId
                    }
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

    getPaymentOfUser: async (userId: string, pageRequest?: PageRequest) => {
        try {
            const response = await privateClient.get<PageResponse<Payment>>(
                paymentEndpoints.getPaymentOfUser(userId),
                {
                    params: {
                        pageRequest
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

    getMonthlyPaymentOfUser: async (userId: string, yearMonth: string) => {
        try {
            const response = await privateClient.get<AdminPayment>(
                paymentEndpoints.getMonthlyPaymentOfUser(userId),
                {
                    params: {
                        yearMonth
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

    getAllAdminPaymentsOfUser: async (userId: string, pageRequest?: PageRequest) => {
        try {
            const response = await privateClient.get<PageResponse<AdminPayment>>(
                paymentEndpoints.getAllAdminPaymentsOfUser(userId),
                {
                    params: {
                        pageRequest
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

    getExcelPaymentsInMonthOfUser: async (monthlyPaymentId: string) => {
        try {
            const response = await publicClient.get(
                paymentEndpoints.getExcelPaymentsInMonthOfUser,
                {
                    params: {
                        monthlyPaymentId
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
}

export default paymentApi;