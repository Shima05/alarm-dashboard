import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Login from "../../pages/Login";
import store from "../../redux/store";

test("renders the login button", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});
