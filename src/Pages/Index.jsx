import React from "react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div>
      <h1>Index page</h1>
      <Link to={"/menu"}>
        <p>menu</p>
      </Link>
      <Link to={"/login"}>
        <p>login</p>
      </Link>
    </div>
  );
};

export default Index;
