import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Alarm {
  uuid: string;
  sensor: string;
  timestamp: number;
  type: string;
  visualizations: string[];
}

interface AlarmsState {
  alarms: Alarm[];
}

const initialState: AlarmsState = {
  alarms: [],
};

const alarmsSlice = createSlice({
  name: "alarms",
  initialState,
  reducers: {
    setAlarms: (state, action: PayloadAction<Alarm[]>) => {
      state.alarms = action.payload;
    },
  },
});

export const { setAlarms } = alarmsSlice.actions;
export default alarmsSlice.reducer;
