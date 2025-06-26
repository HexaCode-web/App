import { createSlice } from "@reduxjs/toolkit";

// Starter state
const initialState = null;

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      return action.payload;
    },
    firstLogin: (state, action) => {
      return action.payload;
    },
    logout: () => {
      return null;
    },
  },
});

// Export actions to be used in components
export const { login, logout, firstLogin } = userSlice.actions;

// Export the reducer to be added to the store
export default userSlice.reducer;
