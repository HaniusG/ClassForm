import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Slices (like auth, UI state) will go here later
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;