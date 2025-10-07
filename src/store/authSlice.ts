import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  User,
  LoginCredentials,
  CreateAccountData,
  ApiResponse,
  AuthResponse
} from "../types";
import { apiClient } from "../services/api";
// import dummyUserImg from "../assets/dummy_user_img.jpg";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', {
      ...credentials,
    });
    return response.data.data;
  }
);

export const createAccount = createAsyncThunk(
  "auth/createAccount",
  async (accountData: CreateAccountData) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      accountData
    );  
    return response.data.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
          sessionStorage.setItem('authToken', action.payload?.token || "")
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createAccount.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Account creation failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
