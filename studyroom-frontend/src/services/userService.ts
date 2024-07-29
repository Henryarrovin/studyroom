import { create, getAll, getUserByUsername } from "./HttpService";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: number[];
    username: string;
    password: string;
    roles: string[];
}

export interface Login {
    username: string;
    password: string;
}

export interface Register {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    username: string;
    password: string;
    roles: string[];
}

const loginService = create("/users/login");
const registerService = create("/users/create-user");
const getAllUsersService = getAll("/users/get-all-user");
const getUserByUsernameService = getUserByUsername("/users/get-user-by-username");

export { loginService, registerService, getAllUsersService, getUserByUsernameService };