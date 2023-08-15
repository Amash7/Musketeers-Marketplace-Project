import { useUserAuth } from "../context/UserAuthContext";
import React from "react";
import "./Navbar.css";

const AppNavbar = () => {
  const { logOut, user } = useUserAuth();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <h1>Marketplace</h1>
        </div>
        <nav className="navbar-nav">
          {user && user.photoURL && (
            <div className="d-flex align-items-center">
              <img
                src={user.photoURL}
                alt="User Profile"
                width={40}
                height={40}
                className="mr-2 rounded-circle"
              />
              <span>{user.displayName}</span>
              <button className="ml-3 logout-button" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default AppNavbar;
