import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "../../redux/store";
import Dashboard from "../../pages/Dashboard";

test("displays message when no alarms are available", async () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </Provider>
  );

  // Assert that the "no alarms" message is displayed
  expect(await screen.findByText(/no alarms received/i)).toBeInTheDocument();
});
