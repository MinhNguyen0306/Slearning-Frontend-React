import { User } from "../model/User"

export type UserSlice = {
    loading: boolean,
    error: any
    user: User,
    isAuthenticated: boolean,
}