import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  currentVideo: null,
  isLoading: false,
  isError: false,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    likeVideo: (state, action) => {
      if (!state.currentVideo.likes.includes(action.payload)) {
        state.currentVideo.likes.push(action.payload);
        state.currentVideo.dislikes.splice(
          state.currentVideo.dislikes.findIndex((id) => id === action.payload)
        );
      }
    },
    dislikeVideo: (state, action) => {
      if (!state.currentVideo.dislikes.includes(action.payload)) {
        state.currentVideo.dislikes.push(action.payload);
        state.currentVideo.likes.splice(
          state.currentVideo.likes.findIndex((id) => id === action.payload)
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideo.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.currentVideo = null;
      });
  },
});

export const fetchVideo = createAsyncThunk(
  "video/current",
  async (videoId, thunkAPI) => {
    try {
      const response = await axios.get(`/video/find/${videoId}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (commentId, thunkAPI) => {
    try {
      const response = await axios.delete(`/comment/${commentId}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const { likeVideo, dislikeVideo } = videoSlice.actions;
export default videoSlice.reducer;
