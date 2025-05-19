export interface InternalStaffInfo {
    username: string;
    pwdH: string;
    name: string;
    roles: string[]
}

export interface StaffState {
    username: string | null;
    token: string | null;
    roles: string[];
    name: string | null;
    isLoggedIn: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}