import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { callServerAPI } from '../../apis/authApi.jsx';

// Async thunk for fetching a user's post.
export const fetchPostsByUser = createAsyncThunk(
    "posts/fetchByUser",
    async () => {
        return callServerAPI("posts", "GET", null);
    }
);

// Async thunk for creating a new post.
export const createANewPost = createAsyncThunk(
    "post/create",
    async (postContent) => {
        // Prepare data to be sent to API.
        const data = {
            post_content: postContent
        };
        return callServerAPI("post", "POST", data);
    }
);

// Async thunk for modifying an existing new post.
export const updatePost = createAsyncThunk(
    "post/modify",
    async (post) => {
        // Prepare data to be sent to API.
        const data = {
            post_id: post.id,
            post_content: post.content
        };

        return callServerAPI("post", "PUT", data);
    }
);

// Async thunk for deleting an existing new post.
export const deletePost = createAsyncThunk(
    "post/delete",
    async (postId) => {
        // Prepare data to be sent to API.
        const data = {
            post_id: postId
        };
        return callServerAPI("post", "DELETE", data);
    }
);

// Async thunk for liking a post.
export const likeAPost = createAsyncThunk(
    "post/like",
    async (postId) => callServerAPI("post/like", "POST", { post_id: postId })
);

// Async thunk for unliking post.
export const unlikeAPost = createAsyncThunk(
    "post/unlike",
    async (postId) => callServerAPI("post/like", "DELETE", { post_id: postId })
);

// Slice
const postsSlice = createSlice({
    name: "posts",
    initialState: { posts: [], loading: true },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Posts By User
        builder.addCase(fetchPostsByUser.fulfilled, (state, action) => {
            // Debug
            //console.log("[Fetch Posts By User] Payload.", action.payload);

            state.posts = action.payload.clientData.posts;
            state.loading = false;
        }).addCase(createANewPost.fulfilled, (state, action) => {
            // Debug
            //console.log("[Create a New Post] Payload.", action.payload);

            state.posts.push(action.payload.clientData);
            state.loading = false;
        }).addCase(updatePost.fulfilled, (state, action) => {
            // Debug
            //console.log("[Modify an Existing New Post] Payload.", action.payload);

            const postIndex = state.posts.findIndex((post) => post.id === action.payload.clientData.id);

            const newPost = state.posts[postIndex];
            newPost.content = action.payload.clientData.content;

            state.posts[postIndex] = newPost;
            state.loading = false;
        }).addCase(deletePost.fulfilled, (state, action) => {
            // Debug
            console.log("[Delete an Existing New Post] Payload.", action.payload);

            const postIndex = state.posts.findIndex((post) => post.id === action.payload.clientData.id);

            state.posts.splice(postIndex, 1);
            state.loading = false;
        }).addCase(likeAPost.fulfilled, (state, action) => {
            // Debug
            //console.log("[Like a Post] Payload.", action.payload);

            const postIndex = state.posts.findIndex((post) => post.id === action.payload.clientData.post_id);

            state.posts[postIndex].liked = "True";
            state.posts[postIndex].like_count++;
            state.loading = false;
        }).addCase(unlikeAPost.fulfilled, (state, action) => {
            // Debug
            //console.log("[Unlike a Post] Payload.", action.payload);

            const postIndex = state.posts.findIndex((post) => post.id === action.payload.clientData.post_id);

            state.posts[postIndex].liked = "False";
            state.posts[postIndex].like_count--;
            state.loading = false;
        })
    }
});

export default postsSlice.reducer;