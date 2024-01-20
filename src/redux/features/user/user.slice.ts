import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import initialState from "./user.selector";
import { AuthenticationResponse } from "../../../types/payload/response/AuthenticationResponse";
import { User } from "../../../types/model/User";

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser: (state, action: PayloadAction<AuthenticationResponse>) => {
            console.log(action.payload)
            if(action.payload.user) {
                if(action.payload.tokens) {
                    localStorage.setItem("access_token", action.payload.tokens.access_token)
                    localStorage.setItem("loggedinId", action.payload.user.id)
                    state.isAuthenticated = true
                }
                
                state.user = action.payload.user
            } else {
                localStorage.setItem("access_token", action.payload.tokens.access_token)
                state.isAuthenticated = true
            }
        },

        setLoggedinUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },

        logout: (state) => {
            localStorage.removeItem('access_token')
            localStorage.removeItem('loggedinId')
            state.isAuthenticated = false
            state.user = initialState.user
        }
    }
})

export const {
    setUser,
    setLoggedinUser,
    logout
} = userSlice.actions

export default userSlice.reducer;