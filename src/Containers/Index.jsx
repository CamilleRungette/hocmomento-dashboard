import React, { useEffect } from "react";
import { connect } from "react-redux";
import MainApp from "./MainApp";
import { useLocation, useNavigate } from "react-router-dom";

const Index = ({ logged }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location);
    if (!logged) navigate("/login");
    else if (location.pathname === "/") navigate("/dashboard");
  }, [logged, navigate, location]);

  return <MainApp />;
};

export default connect((state) => ({
  logged: state.loginReducer.logged,
}))(Index);
