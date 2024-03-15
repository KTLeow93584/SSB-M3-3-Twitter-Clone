import { createSlice } from '@reduxjs/toolkit';

const activeUserSlice = createSlice({
    name: 'activeUser',
    initialState: {
        user: null,
        token: null
    },
    reducers: {
        login: (state, action) => {
            // Debug
            //console.log("[On Login] Payload.", action.payload);

            return {
                user: action.payload.user,
                token: action.payload.token,
            };
        },
        logout: () => {
            // Debug
            //console.log("[On Logout] Payload.", action.payload);

            return {
                user: null,
                token: null
            };
        },
        updateUserProfileData: (state, action) => {
            // Debug
            console.log("[On Update User Profile] Payload.", action.payload);
            return {
                user: {
                    firstName: action.payload.first_name,
                    lastName: action.payload.last_name,
                    profileImage: action.payload.profile_image
                },
                token: state.token,
            };
        },
    }
});

export const { login, logout, updateUserProfileData } = activeUserSlice.actions;

export default activeUserSlice.reducer;