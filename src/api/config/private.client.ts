import axios, { AxiosError, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import queryString from "query-string";
import useRefreshToken from "../../hooks/useRefreshToken";

export const BASE_URL = "http://localhost:9090/api/v1";

const refresh = useRefreshToken();

// Item trong hàng đợi request để gửi lại
interface RetryQueueItem {
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
    config: AxiosRequestConfig;
}

// Hàng đợi request để gửi lại
const refreshAndRetryQueue: RetryQueueItem[] = [];

// Tránh gửi request liên tục
let isRefreshing = false;

const privateClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    paramsSerializer: (params) => {
        return queryString.stringify(params)
    }
})

privateClient.interceptors.request.use(async (config: any): Promise<any> => {
    return {
        ...config,
        headers: {
            // "Content-Type": "application/json", 
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        }
    }
}, (error) => {
    return Promise.reject(error)
})

privateClient.interceptors.response.use(function (response: AxiosResponse) {
    return response 
}, function (error: AxiosError) {
    // const originalRequest = error.config || error.request.config;
    // const status = error.response ? error.response.status : null;

    // if(status !== null && status === 403 || status === 401) {
    //     if(!isRefreshing) {
    //         isRefreshing = true;
    //         try {
    //             const data = await refresh();
    //             console.log(refreshAndRetryQueue)
    //             if(data) {
    //                 localStorage.setItem('access_token', data.tokens.access_token);
    //                 if(error.config) {
    //                     store.dispatch(setUser(data))
    //                     error.config.headers['Authorization'] = `Bearer ${data.tokens.access_token}`;

    //                     // Lấy tất cả request đang đợi và request lại với NEW TOKEN
    //                     // refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
    //                     //     privateClient
    //                     //         .request(config)
    //                     //         .then((response) => resolve(response))
    //                     //         .catch((err) => reject(err));
    //                     // });

    //                     // Làm sạch hàng đợi
    //                     refreshAndRetryQueue.length = 0;

    //                     // // Gửi lại yêu cầu ban đầu
    //                     // return privateClient(originalRequest)
    //                 }
    //             } else {
    //                 // Refresh token hết hạn -> logout
    //                 store.dispatch(logout())
    //             }
    //         } catch (error) {
    //             // Refresh token hết hạn -> logout
    //             store.dispatch(logout())
    //             return Promise.reject(error)
    //         } finally {
    //             // Kết thúc request
    //             isRefreshing = false
    //         }
    //     }

    //     // Đẩy request ban đầu vào hàng đợi
    //     return new Promise<void>((resolve, reject) => {
    //         refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
    //     });
    // } else {
    // }
    return Promise.reject(error)
})

export default privateClient;