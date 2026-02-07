// In your Redux slice file

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../src/utils/axiosClient";

// 🔹 Google Login
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ displayName, email, photoURL }, thunkAPI) => {
    try {
      const res = await axiosClient.post("/user/googleLogin", {
        displayName,
        email,
        photoURL,
      });
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Google login failed"
      );
    }
  }
);

// 🔹 Check Auth
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get("/user/check");
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue("Not authenticated");
    }
  }
);

// 🔹 Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await axiosClient.post("/user/logout");
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

// 🔹 Send OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/user/generateOTP", { email });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
  }
);

// 🔹 Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post("/user/verifyOtp", { email, otp });

      if (data?.showGoogleLogin) {
        return rejectWithValue({
          message: data.message,
          showGoogleLogin: true,
        });
      }

      return data; // contains user and token
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "OTP verification failed" }
      );
    }
  }
);

// 🔹 Get Difficulty Count
export const getDifficultyCount = createAsyncThunk(
  "auth/getDifficultyCount",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get("/user/getDifficultyCount");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch difficulty count"
      );
    }
  }
);

// 🔹 Get User Image
export const getUserImage = createAsyncThunk(
  "auth/getUserImage",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get("/user/getImage");
      return res.data.photoURL;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile image"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    otpStatus: null,
    photoURL: null,
    imageLoading: false,
    imageError: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.otpStatus = null;
      state.photoURL = null;
    },
    updatePhotoURL: (state, action) => {
      state.photoURL = action.payload;
      if (state.user) {
        state.user.photoURL = action.payload;
      }
    },
    clearImageError: (state) => {
      state.imageError = null;
    },
    updateDifficultyCount: (state, action) => {
      if (state.user) {
        state.user.difficultyCount = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder

      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.photoURL = action.payload.photoURL;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.photoURL = action.payload.photoURL;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.photoURL = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.otpStatus = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpStatus = action.payload;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.otpStatus = action.payload;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.photoURL = action.payload.user.photoURL;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.showGoogleLogin) {
          state.error = "User not found. Please sign up with Google to login.";
        } else {
          state.error = action.payload?.message || "OTP verification failed";
        }
      })

      // Get Difficulty Count
      .addCase(getDifficultyCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDifficultyCount.fulfilled, (state, action) => {
        if (state.user) {
          state.user.difficultyCount = action.payload;
        }
        state.loading = false;
      })
      .addCase(getDifficultyCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Image
      .addCase(getUserImage.pending, (state) => {
        state.imageLoading = true;
        state.imageError = null;
      })
      .addCase(getUserImage.fulfilled, (state, action) => {
        state.imageLoading = false;
        state.photoURL = action.payload;
        if (state.user) {
          state.user.photoURL = action.payload;
        }
      })
      .addCase(getUserImage.rejected, (state, action) => {
        state.imageLoading = false;
        state.imageError = action.payload;
      });
  },
});

export const {
  logout,
  updatePhotoURL,
  clearImageError,
  updateDifficultyCount,
} = authSlice.actions;

export default authSlice.reducer;
