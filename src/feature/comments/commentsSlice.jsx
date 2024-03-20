import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { callServerAPI } from '../../apis/authApi.jsx';

// Async thunk for fetching a user's post.
export const fetchPostComments = createAsyncThunk(
    "post/comments/fetch",
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

// Async thunk for creating a new comment for a post.
export const createNewComment = createAsyncThunk(
    "post/comment/create",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            post_id: params.post_id,
            comment_content: params.comment_content
        };

        const result = await callServerAPI("post/comment", "POST", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for modifying an existing new post.
export const updateComment = createAsyncThunk(
    "post/comment/modify",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            comment_id: params.comment_id,
            comment_content: params.comment_content
        };

        const result = await callServerAPI("post/comment", "PUT", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Async thunk for deleting an existing new post.
export const deleteComment = createAsyncThunk(
    "post/comment/delete",
    async (params, api) => {
        // Prepare data to be sent to API.
        const data = {
            post_id: params.post_id,
            comment_id: params.comment_id
        };

        const result = await callServerAPI("post/comment", "DELETE", data);

        // API errored callback.
        if (result.code)
            return api.rejectWithValue({ code: result.code, status: result.request.status });
        // API successful callback.
        else
            return result;
    }
);

// Slice
const commentsSlice = createSlice({
    name: "comments",
    initialState: { comments: [] },
    reducers: {
        loadCommentsFromPostData: (state, action) => {
            // Debug
            //console.log("[Preloading Comments from Fetching Post Data] Payload.", action.payload);

            state.comments = action.payload.comments;
        }
    },
    extraReducers: (builder) => {
        // Fetch all Comments tied to a Post.
        builder.addCase(fetchPostComments.fulfilled, (state, action) => {
            // Debug
            //console.log("[Fetch Post's Comments] Payload.", action.payload);

            state.comments = action.payload.client_data.comments;
        });

        // Creating a new comment.
        builder.addCase(createNewComment.fulfilled, (state, action) => {
            // Debug
            //console.log("[Create a New Comment] Payload.", action.payload);

            state.comments.unshift(action.payload.client_data.comment);
        });

        // Updating an existing comment.
        builder.addCase(updateComment.fulfilled, (state, action) => {
            // Debug
            //console.log("[Modify an Existing Comment] Payload.", action.payload);

            const commentIndex = state.comments.findIndex((comment) => comment.comment_id === action.payload.client_data.comment_id);

            const newComment = state.comments[commentIndex];
            newComment.comment_content = action.payload.client_data.comment_content;

            state.comments[commentIndex] = newComment;
        });

        // Deleting an existing comment.
        builder.addCase(deleteComment.fulfilled, (state, action) => {
            // Debug
            //console.log("[Delete an Existing Comment] Payload.", action.payload);

            const commentIndex = state.comments.findIndex((comment) => comment.comment_id === action.payload.client_data.comment_id);
            state.comments.splice(commentIndex, 1);
        });
    }
});

export const { loadCommentsFromPostData } = commentsSlice.actions;
export default commentsSlice.reducer;