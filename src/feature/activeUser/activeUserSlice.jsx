import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { callServerAPI, updateSessionToken } from '../../apis/authApi.jsx';

// Async thunk for login.
export const login = createAsyncThunk(
    "login",
    async (credentials) => {
        const data = {
            email: credentials.email,
            password: credentials.password
        };

        return callServerAPI("login", "POST", data);
    }
);

// Async thunk for logout.
export const logout = createAsyncThunk(
    "logout",
    async () => {
        return callServerAPI("logout", "POST", null);
    }
);

// Async thunk for registration.
export const register = createAsyncThunk(
    "register",
    async (credentials) => {
        // Prepare data to be sent to API.
        const data = {
            email: credentials.email,
            password: credentials.password,
            first_name: credentials.first_name,
            last_name: credentials.last_name,
            profile_image: credentials.profile_image
        };
        return callServerAPI("register", "POST", data);
    }
);

// Async thunk for acquiring user info.
export const getUserInfo = createAsyncThunk(
    "user/get",
    async () => {
        return callServerAPI("profile", "GET", null);
    }
);

// Async thunk for updating user info.
export const updateUserInfo = createAsyncThunk(
    "user/update",
    async (userInfo) => {
        // Prepare data to be sent to API.
        const data = {
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            profile_image: userInfo.profile_image
        };
        return callServerAPI("profile", "PUT", data);
    }
);

// Slice
const activeUserSlice = createSlice({
    name: "activeUser",
    initialState: {
        user: null,
        token: null
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Posts By User
        builder.addCase(login.fulfilled, (state, action) => {
            // Debug
            //console.log("[On Login] Payload.", action.payload);

            updateSessionToken(action.payload.clientData.token);

            return {
                user: null,
                token: action.payload.clientData.token,
            };
        }).addCase(logout.fulfilled, (state, action) => {
            // Debug
            //console.log("[On Logout] Payload.", action.payload);

            return {
                user: null,
                token: null
            };
        }).addCase(getUserInfo.fulfilled, (state, action) => {
            // Debug
            console.log("[On Acquire User Profile] Payload.", action.payload);

            return {
                user: {
                    first_name: action.payload.clientData.first_name,
                    last_name: action.payload.clientData.last_name,
                    profile_image: action.payload.clientData.profile_image,
                    follower_count: action.payload.clientData.follower_count,
                    following_count: action.payload.clientData.following_count,
                    joined_at_month: action.payload.clientData.joined_at_month,
                    joined_at_year: action.payload.clientData.joined_at_year
                },
                token: state.token
            };
        }).addCase(updateUserInfo.fulfilled, (state, action) => {
            // Debug
            //console.log("[On Update User Profile] Payload.", action.payload);

            return {
                user: {
                    first_name: action.payload.clientData.first_name,
                    last_name: action.payload.clientData.last_name,
                    profile_image: action.payload.clientData.profile_image,
                    follower_count: state.user.follower_count,
                    following_count: state.user.following_count,
                    joined_at_month: state.user.joined_at_month,
                    joined_at_year: state.user.joined_at_year
                },
                token: state.token
            };
        })
    }
});

export default activeUserSlice.reducer;