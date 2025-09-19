import { AxiosInstance } from "axios";
export interface LoginData {
    email: string;
    password: string;
}
export declare const login: (axios: AxiosInstance, data: LoginData) => unknown;
export declare const logout: (logoutFn?: () => Promise<void>) => any;
export declare function register(axios: AxiosInstance, { email, firstName, lastName, password, }: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}): Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare function forgotPassword(axios: AxiosInstance, email: string): Promise<void>;
export declare function resetPassword(axios: AxiosInstance, { token, new_password, }: {
    token: string;
    new_password: string;
}): unknown;
