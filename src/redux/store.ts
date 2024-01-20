import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { useDispatch } from "react-redux";
import userSlice from "./features/user/user.slice";
import appStateSlice from "./features/appState/appState.slice";

const userPersistConfig = {
    key: 'reduxPersist:loggedin',
    storage,
    whiteList: ['isAuthenticated', 'user']
}

const persistedReducer = persistReducer(userPersistConfig, userSlice)

const store = configureStore({
    reducer: {
        user: persistedReducer,
        appState: appStateSlice
    },
    middleware: [thunk]
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const persistor = persistStore(store)

export default store;