import React, { useEffect } from "react";
import { connect } from "react-redux";
import MainApp from "./MainApp";
import { useNavigate } from "react-router-dom";

const Index = ({ logged }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!logged) navigate("/login");
    else navigate("/dashboard");
  }, [logged, navigate]);

  return <MainApp />;
};

export default connect((state) => ({
  logged: state.loginReducer.logged,
}))(Index);
