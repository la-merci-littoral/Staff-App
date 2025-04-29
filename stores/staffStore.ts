import { create } from 'zustand';
import { StaffState } from '@/types/staff';

const useStaffStore = create<StaffState>()((set) => ({
    isLoggedIn: false,
    token: null,
    username: null,
    login: async (username, password) => {
        if (username == process.env.EXPO_PUBLIC_USERNAME! && password == process.env.EXPO_PUBLIC_PWD) {
            set({
                isLoggedIn: true,
                token: process.env.EXPO_PUBLIC_TOKEN,
                username: process.env.EXPO_PUBLIC_USERNAME,
            })
        }
    },
    logout: async () => {
        set({
            isLoggedIn: false,
            token: null,
            username: null,
        })
    },
}));

export default useStaffStore;
