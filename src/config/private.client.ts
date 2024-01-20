import axios from "axios";
import queryString from "query-string";

const BASE_URL = "http://localhost:8080";

const privateClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "*",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    },
    withCredentials: true,
    paramsSerializer: (param) => {
        return queryString.stringify(param)
    },
    onUploadProgress(progressEvent) {
        console.log(progressEvent)
    },
})

axios.interceptors.request.use(async (config) => {
    return config;
}, (error) => {
    return Promise.reject(error)
});

axios.interceptors.response.use((response) => {
    if(response.data === undefined || response.data === null || response.status === 404) {
        throw new Error("No content be finded")
    }
    return response.data
}, (error) => {
    throw error;
});

export default privateClient;