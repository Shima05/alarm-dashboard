import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import { logout } from "./redux/authSlice";

const CypressBridge = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = () => {
      dispatch(logout());
    };
    window.addEventListener("redux-logout", handleLogout);

    if (window.Cypress) {
      window.store = store;
    }

    return () => {
      window.removeEventListener("redux-logout", handleLogout);
    };
  }, [dispatch]);

  return null;
};

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <CypressBridge />
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
