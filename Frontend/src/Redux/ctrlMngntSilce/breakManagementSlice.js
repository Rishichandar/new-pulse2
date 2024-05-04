import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLunchIn: false,
  isBreakIn: false,
};

export const breakManagementSlice = createSlice({
  name: "breakManagement",
  initialState,
  reducers: {
    toggleLunch: (state) => {
      state.isLunchIn = !state.isLunchIn;
    },
    toggleBreak: (state) => {
      state.isBreakIn = !state.isBreakIn;
    },
  },
});

export const { toggleLunch, toggleBreak } = breakManagementSlice.actions;

export default breakManagementSlice.reducer;
