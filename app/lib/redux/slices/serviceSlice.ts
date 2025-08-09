import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  accessToken?: string | null;
  refreshToken?: string | null;
}

const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

const setStoredToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

const removeStoredTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

const initialState: AuthState = {
  isAuthenticated: !!getStoredToken(),
  loading: false,
};

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const refresh = state.auth.refreshToken || getStoredToken();

      if (!refresh) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post("/api/auth/refresh", { refresh });

      const { access } = response.data;
      if (typeof window !== "undefined") {
        localStorage.setItem("access", access);
      }
      return access;
    } catch (error) {
      removeStoredTokens();
      return rejectWithValue("Failed to refresh token");
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      removeStoredTokens();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { setAuthenticated, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;