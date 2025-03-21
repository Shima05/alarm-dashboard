import { configureStore } from "@reduxjs/toolkit";
import alarmReducer from "./alarmsSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    alarms: alarmReducer,
    auth: authReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
