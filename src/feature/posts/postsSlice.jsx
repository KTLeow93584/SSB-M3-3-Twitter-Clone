import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { callServerAPI } from '../../apis/authApi.jsx';

// Async thunk for fetching a specific user's posts.
export const fetchPostsByUserId = createAsyncThunk(
    "posts/fetch/user",
    async (params, api) => {
        const result = await callServerAPI(`posts/user/${params.user_id}`, "GET", null);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for fetching own posts.
export const fetchPostsSelf = createAsyncThunk(
    "posts/fetch",
    async (params, api) => {
        const result = await callServerAPI("posts", "GET", null);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

export const fetchPostComments = createAsyncThunk(
    "post/fetch/comments",
    async (params, api) => {
        const result = await callServerAPI(`post/${params.post_id}/comments`, "GET", null);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for creating a new post.
export const createANewPost = createAsyncThunk(
    "post/create",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            post_content: params.post_content
        };
        const result = await callServerAPI("post", "POST", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for modifying an existing new post.
export const updatePost = createAsyncThunk(
    "post/modify",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            post_id: params.post_id,
            post_content: params.post_content
        };

        const result = await callServerAPI("post", "PUT", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for deleting an existing new post.
export const deletePost = createAsyncThunk(
    "post/delete",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            post_id: params.post_id
        };

        const result = await callServerAPI("post", "DELETE", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for liking a post.
export const likeAPost = createAsyncThunk(
    "post/like",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            post_id: params.post_id
        };

        const result = await callServerAPI("post/like", "POST", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for unliking post.
export const unlikeAPost = createAsyncThunk(
    "post/unlike",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            post_id: params.post_id
        };

        const result = await callServerAPI("post/like", "DELETE", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Slice
const postsSlice = createSlice({
    name: "posts",
    initialState: { posts: [] },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch all Posts by specific User ID.
        builder.addCase(fetchPostsByUserId.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[Fetch Posts By User] Payload.", action.payload);

            state.posts = action.payload.client_data.posts;
        });

        // Fetch all Posts tied to own account.
        builder.addCase(fetchPostsSelf.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[Fetch Posts By User] Payload.", action.payload);

            state.posts = action.payload.client_data.posts;
        });

        // Creating a new post.
        builder.addCase(createANewPost.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[Create a New Post] Payload.", action.payload);

            state.posts.unshift(action.payload.client_data.post);
        });

        // Updating an existing post.
        builder.addCase(updatePost.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[Modify an Existing Post] Payload.", action.payload);

            const postIndex = state.posts.findIndex((post) => post.post_id === action.payload.client_data.post.post_id);

            const newPost = state.posts[postIndex];
            newPost.post_content = action.payload.client_data.post.post_content;

            state.posts[postIndex] = newPost;
        });

        // Deleting an existing post.
        builder.addCase(deletePost.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[Delete an Existing Post] Payload.", action.payload);

            const postIndex = state.posts.findIndex((post) => post.post_id === action.payload.client_data.post.post_id);

            state.posts.splice(postIndex, 1);
        });

        // Liking an existing post.
        builder.addCase(likeAPost.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[Like a Post] Payload.", action.payload);

            const postIndex = state.posts.findIndex((post) => post.post_id === action.payload.client_data.post.post_id);

            state.posts[postIndex].liked = "True";
            state.posts[postIndex].like_count = action.payload.client_data.post.like_count;
        });

        // Unliking an existing post.
        builder.addCase(unlikeAPost.fulfilled, (state, action) => {
            if (!action.payload.success)
                return state;
            // Debug
            //console.log("[Unlike a Post] Payload.", action.payload);

            const postIndex = state.posts.findIndex((post) => post.post_id == action.payload.client_data.post.post_id);

            state.posts[postIndex].liked = "False";
            state.posts[postIndex].like_count = action.payload.client_data.post.like_count;
        });
    }
});

export default postsSlice.reducer;