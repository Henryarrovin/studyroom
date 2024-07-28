import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User } from "../services/userService";

const initialState: User = {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: [],
    username: "",
    password: "",
    roles: []
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            const user = action.payload;
            state.id = user.id;
            state.firstName = user.firstName;
            state.lastName = user.lastName;
            state.email = user.email;
            state.dateOfBirth = user.dateOfBirth;
            state.username = user.username;
            state.password = user.password;
            state.roles = user.roles;
        },
        removeUser: (state) => {
            state.id = 0;
            state.firstName = "";
            state.lastName = "";
            state.email = "";
            state.dateOfBirth = [];
            state.username = "";
            state.password = "";
            state.roles = [];
        }
    }
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.user;