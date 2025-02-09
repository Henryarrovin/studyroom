import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import userReducer from './features/userSlice';
import fileSystemReducer from './features/fileSystemSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        fileSystem: fileSystemReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;