import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";
import * as alarmService from "../../services/alarmService";
import configureStore from "redux-mock-store";

const mockStore = configureStore();
const store = mockStore({
  auth: { token: "mocked-token" },
  alarms: {
    alarms: [
      {
        uuid: "123",
        sensor: "Sensor A",
        timestamp: Date.now(),
        type: "warning",
        visualizations: [],
      },
    ],
  },
});

jest.spyOn(alarmService, "getAlarms").mockResolvedValue([
  {
    uuid: "1",
    sensor: "Sensor A",
    timestamp: Date.now(),
    type: "warning",
    visualizations: [],
  },
]);

test("displays alarms after fetching from API", async () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText(/Sensor A/)).toBeInTheDocument();
  });
});
