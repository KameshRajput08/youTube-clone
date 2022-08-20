import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  currentComments: [],
  isLoading: false,
  isError: false,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    addComment: (state, action) => {
      state.currentComments.unshift(action.payload);
    },
    deleteComment: (state, action) => {
      const deleteComment = async () => {
        await axios.delete(`/comment/${action.payload}`);
      };
      deleteComment();
      const index = state.currentComments.findIndex((c) => {
        return c._id === action.payload;
      });
      state.currentComments.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentComments = action.payload;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.currentComments = [];
      });
  },
});

export const fetchComments = createAsyncThunk(
  "video/comments",
  async (videoId, thunkAPI) => {
    try {
      const res = await axios.get(`/comment/${videoId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const { addComment, deleteComment } = commentSlice.actions;
export default commentSlice.reducer;
