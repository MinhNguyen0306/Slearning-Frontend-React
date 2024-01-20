import { toast } from "react-toastify";
import authApi from "../api/modules/auth.api";

const useRefreshToken = () => {
    const refresh = async () => {
        const userId = localStorage.getItem("loggedinId");
        
        if(userId) {
            const { response, error } = await authApi.refreshToken(userId);
            if(response) {
                console.log(response)
                return response.data
            }
    
            if(error) {
                console.log(error)
                toast.error(error.message)
                throw new Error("Ngoi dung da dang xuat")
            }
        } else {
            throw new Error("Ngoi dung da dang xuat")
        }
    }

    return refresh;
}

export default useRefreshToken;