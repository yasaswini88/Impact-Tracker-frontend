import { createSlice } from '@reduxjs/toolkit';

// Attempt to parse user data from localStorage
let storedUser = null;
try {
  const rawUser = localStorage.getItem('businessUser');
  if (rawUser) {
    storedUser = JSON.parse(rawUser);
  }
} catch (err) {
  console.error('Error parsing user from localStorage:', err);
}

// Initial state
const initialState = {
  user: storedUser,            // either null or an object with business info
  isAuthenticated: !!storedUser,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    // Begin login, set loading
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // If login API is successful
    loginSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload;          // store entire business object
      state.isAuthenticated = true;

      // Also persist to localStorage
      localStorage.setItem('businessUser', JSON.stringify(action.payload));
    },

    // If login fails
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.isAuthenticated = false;
    },

    logout: (state) => {
      // Clear localStorage
      localStorage.removeItem('businessUser');

      // Reset slice to initial
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Selectors for use in components
export const selectAuthUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.loading;

export default authSlice.reducer;
