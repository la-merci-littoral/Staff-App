export interface AuthReq {
    username: string;
    password: string;
}

export interface AuthRes {
    token: string;
    roles: string[];
    name: string;
}