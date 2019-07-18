import React from "react";
import "./Spinner.css";
const spinner = props => (
  <div className="spinner">
    <div className="lds-ripple">
      <div />
      <div />
    </div>
  </div>
);

export default spinner;
