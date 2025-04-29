export interface StaffState {
    username: string | null;
    token: string | null;
    isLoggedIn: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}