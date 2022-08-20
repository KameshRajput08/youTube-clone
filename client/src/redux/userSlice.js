import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isLoading: false,
    isError: false,
  },
  reducers: {
    suscription: (state, action) => {
      if (!state.currentUser.suscribedChannels.includes(action.payload)) {
        state.currentUser.suscribedChannels.push(action.payload);
      } else {
        state.currentUser.suscribedChannels.splice(
          state.currentUser.suscribedChannels.findIndex(
            (id) => id === action.payload
          ),
          1
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isError = true;
        state.currentUser = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isError = true;
        state.currentUser = null;
        state.isLoading = false;
      })
      .addCase(googleAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.currentUser = null;
        state.isError = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.currentUser = null;
        state.isError = false;
      });
  },
});

export const googleAuth = createAsyncThunk(
  "auth/google",
  async (authDetails, thunkAPI) => {
    try {
      const response = await axios.post("/auth/google", authDetails);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (loginDetails, thunkAPI) => {
    try {
      const response = await axios.post("auth/login", loginDetails);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userDetails, thunkAPI) => {
    try {
      const res = await axios.post("/auth", userDetails);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/update",
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`/auth/find/${userId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const signOut = createAsyncThunk("auth/signOut", async (thunkAPI) => {
  try {
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const { suscription } = userSlice.actions;

export default userSlice.reducer;
