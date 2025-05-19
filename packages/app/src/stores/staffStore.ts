import { create } from 'zustand';
import { AuthRes, codes, StaffState } from 'types';
import { post, RestRes } from '@/utils/rest';

const useStaffStore = create<StaffState>()((set) => ({
    isLoggedIn: false,
    token: null,
    username: null,
    roles: [],
    name: null,
    login: async (username, password) => {
        const response: RestRes<AuthRes> = await post('/auth/token', {username, password})
        if (response.status == codes.ok){
            set({
                isLoggedIn: true,
                token: response.data.token,
                roles: response.data.roles,
                name: response.data.name
            });
            return
        } else if (response.status == codes.forbidden){
            throw new Error('Codes invalides')
        }
    },
    logout: async () => {
        set(useStaffStore.getInitialState())
    },
}));

export default useStaffStore;
