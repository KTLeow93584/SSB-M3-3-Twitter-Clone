import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { callServerAPI, updateSessionToken } from '../../apis/authApi.jsx';

// Async thunk for login.
export const login = createAsyncThunk(
    "login",
    async (params, api) => {
        const data = {
            email: params.email,
            password: params.password
        };

        const result = await callServerAPI("login", "POST", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for logout.
export const logout = createAsyncThunk(
    "logout",
    async (params, api) => {
        const result = await callServerAPI("logout", "POST", null);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for registration.
export const register = createAsyncThunk(
    "register",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            email: params.email,
            password: params.password,
            first_name: params.first_name,
            last_name: params.last_name,
            profile_image: params.profile_image
        };
        const result = await callServerAPI("register", "POST", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for acquiring user info.
export const getUserInfo = createAsyncThunk(
    "user/get",
    async (params, api) => {
        const result = await callServerAPI("profile", "GET", null);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for updating user info.
export const updateUserInfo = createAsyncThunk(
    "user/update",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            first_name: params.first_name,
            last_name: params.last_name,
            profile_image: params.profile_image
        };
        const result = await callServerAPI("profile", "PUT", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Slice
const activeUserSlice = createSlice({
    name: "activeUser",
    initialState: {
        user: null,
        token: null
    },
    reducers: {
        updateFollowingCount: (state, action) => {
            return {
                user: {
                    first_name: state.user.first_name,
                    last_name: state.user.last_name,
                    profile_image: state.user.profile_image,
                    follower_count: state.user.follower_count,
                    following_count: action.payload.isAdd ? (state.user.following_count + 1) : (state.user.following_count - 1),
                    joined_at_month: state.user.joined_at_month,
                    joined_at_year: state.user.joined_at_year
                },
                token: state.token
            };
        }
    },
    extraReducers: (builder) => {
        // Fetch Posts By User
        builder.addCase(login.fulfilled, (state, action) => {
            // Debug
            //console.log("[On Login] Payload.", action.payload);

            updateSessionToken(action.payload.client_data.token);

            return {
                user: null,
                token: action.payload.client_data.token
            };
        });

        builder.addCase(logout.fulfilled, () => {
            // Debug
            //console.log("[On Logout] Payload.", action.payload);

            return {
                user: null,
                token: null
            };
        });

        builder.addCase(getUserInfo.fulfilled, (state, action) => {
            // Debug
            console.log("[On Acquire User Profile] Payload.", action.payload);

            return {
                user: {
                    first_name: action.payload.client_data.first_name,
                    last_name: action.payload.client_data.last_name,
                    profile_image: action.payload.client_data.profile_image,
                    follower_count: action.payload.client_data.follower_count,
                    following_count: action.payload.client_data.following_count,
                    joined_at_month: action.payload.client_data.joined_at_month,
                    joined_at_year: action.payload.client_data.joined_at_year
                },
                token: state.token
            };
        });

        builder.addCase(updateUserInfo.fulfilled, (state, action) => {
            // Debug
            //console.log("[On Update User Profile] Payload.", action.payload);

            return {
                user: {
                    first_name: action.payload.client_data.first_name,
                    last_name: action.payload.client_data.last_name,
                    profile_image: action.payload.client_data.profile_image,
                    follower_count: state.user.follower_count,
                    following_count: state.user.following_count,
                    joined_at_month: state.user.joined_at_month,
                    joined_at_year: state.user.joined_at_year
                },
                token: state.token
            };
        });
    }
});

export const { updateFollowingCount } = activeUserSlice.actions;
export default activeUserSlice.reducer;