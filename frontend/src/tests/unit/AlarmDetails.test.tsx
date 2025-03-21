import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import configureStore from "redux-mock-store";
import AlarmDetails from "../../pages/AlarmDetails";

const mockStore = configureStore([]);

test("displays 'Loading...' message initially", async () => {
  const store = mockStore({
    auth: { token: "mocked-token" },
    alarms: { alarms: [] }, // Add any required initial state here
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/alarms/123"]}>
        <Routes>
          <Route path="/alarms/:id" element={<AlarmDetails />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  expect(await screen.findByText("Loading...")).toBeInTheDocument();
});
