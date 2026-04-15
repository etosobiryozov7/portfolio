import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h3 className="error-h3">ERROR !</h3>
      <h1 className="error-h1">404</h1>
      <h4 className="error-h4">PAGE NOT FOUND</h4>
      <Link to="/" >
        <button className="home-back">go Home</button>
      </Link>
    </div>
  );
};

export default NotFound;