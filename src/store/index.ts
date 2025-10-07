import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import medicalReducer from './medicalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    medical: medicalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;