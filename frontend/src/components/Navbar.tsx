import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { RootState } from "../redux/store";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  console.log("Current user:", user);

  const isDashboardOrCardDetails =
    location.pathname === "/dashboard" || location.pathname === "/card-details";

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          ⚡ Alarm Manager
        </Link>
      </div>
      <div className="nav-right">
        {isDashboardOrCardDetails ? (
          <>
            <button className="btn back-btn" onClick={() => navigate(-1)}>
              Back
            </button>
            <button className="btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            {user ? (
              <>
                <span className="nav-user">👤 {user}</span>
                <button className="btn logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn login-btn"
                  data-cy="login-link"
                >
                  Login
                </Link>

                <Link to="/signup" className="btn signup-btn">
                  Sign Up
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
