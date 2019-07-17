import React from "react";
import { NavLink } from "react-router-dom";

import "./MainNavigation.css";

const mainNavigation = props => (
  <header className="main-navigation">
    <div className="main-navigation__logo">
      <h1>Easy Event</h1>
    </div>
    <div className="main-navigation__items">
      <ul>
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
        <li>
          <NavLink to="/events">Event</NavLink>
        </li>
        <li>
          <NavLink to="/booking">Booking</NavLink>
        </li>
      </ul>
    </div>
  </header>
);

export default mainNavigation;
