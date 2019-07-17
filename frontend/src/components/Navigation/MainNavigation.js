import React from "react";
import { NavLink } from "react-router-dom";

import "./MainNavigation.css";
import AuthContext from "../../context/auth-context";

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>Easy Event</h1>
          </div>
          <div className="main-navigation__items">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Authenticate</NavLink>
                </li>
              )}

              <li>
                <NavLink to="/events">Event</NavLink>
              </li>
              {context.token && (
                <li>
                  <NavLink to="/booking">Booking</NavLink>
                </li>
              )}
              {/* 
                <li>
                  <button>dasdasd</button>
                  <button onClick={context.logout()}>Logout</button>
                </li> */}
              {context.token && (
                <li>
                  <button onClick={context.logout} className="buttonLogout">
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
