import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callServerAPI } from '../../apis/authApi.jsx';

// Async thunk for acquiring user info.
export const getUserInfo = createAsyncThunk(
    "user/other/get",
    async (params, api) => {
        const result = await callServerAPI(`profile/${params.user_id}`, "GET", null);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for acquiring user info.
export const getPersonalInfo = createAsyncThunk(
    "user/self/get",
    async (params, api) => {
        const result = await callServerAPI(`profile`, "GET", null);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Slice
const viewedUserSlice = createSlice({
    name: "viewedUser",
    initialState: { user: null },
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
                    joined_at_year: state.user.joined_at_year,
                    is_authorized: state.user.is_authorized
                }
            };
        },
        clearViewedUserProfile: (state, action) => {
            return { user: null };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserInfo.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;

            // Debug
            //console.log("[On Acquire User Profile] Payload.", action.payload);

            state.user = { ...action.payload.client_data.user };
        });

        builder.addCase(getPersonalInfo.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;

            // Debug
            //console.log("[On Acquire User Profile] Payload.", action.payload);

            state.user = { ...action.payload.client_data.user };
        });
    }
});

export const { updateFollowingCount, clearViewedUserProfile } = viewedUserSlice.actions;
export default viewedUserSlice.reducer;