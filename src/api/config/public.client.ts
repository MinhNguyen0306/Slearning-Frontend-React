import axios, { AxiosError } from "axios";
import queryString from "query-string";

const baseURL = "http://localhost:9090/api/v1";

const publicClient = axios.create({
    baseURL,
    paramsSerializer: (params) => {
        return queryString.stringify(params)
    }
})

publicClient.interceptors.request.use(async (config: any) => {
    return {
        ...config,
        headers: {
          "Content-Type": "application/json"
        }
    };
})

publicClient.interceptors.response.use((response) => {
    return response
}, (err: AxiosError) => {
    if(err.response?.data) {
        throw Promise.reject(err.response.data)
    }
})

export default publicClient;