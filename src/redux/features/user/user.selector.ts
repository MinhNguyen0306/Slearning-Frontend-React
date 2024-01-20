import { UserSlice } from "../../../types/system/UserSlice";

const initialState: UserSlice = {
    loading: false,
    error: "",
    isAuthenticated: false,
    user: {
        id: "",
        fullName: "",
        email: "",
        phone: "",
        age: 0,
        instructor: false,
        lock: false,
        workExperiences: [],
        userStatus: 'ACTIVE',
        monthlyPayments: [],
        deviceTokens: [],
        roles: [
            {
                id: 0,
                role: ""
            }
        ]
    },
}

export default initialState;