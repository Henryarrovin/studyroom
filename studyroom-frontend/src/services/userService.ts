import create from "./HttpService";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
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
const registerService = create("/users/register");

export { loginService, registerService };