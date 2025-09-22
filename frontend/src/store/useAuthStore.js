import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isLoging: false,

    checkAuth: async () => {
        try {
            // call chekAuth API using axios
            // set authUser from API response
        } catch (error) {
            set({ authUser: null });
            console.log("Error: checking auth: ", error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (data) => {
        set({ isLoging: true });
        try {
            // call login API using axios
            // on login success set authUser from response 
        } catch (error) {
            set({ authUser: null });
            console.log("Error: Loging: ", error);
        } finally {
            set({ isLoging: true });
        }
    }
}));