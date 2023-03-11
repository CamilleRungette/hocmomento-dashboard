import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import MainApp from "./MainApp";

const Index = ({ logged }) => {
  console.log(logged);
  useEffect(() => {
    console.log("hello");
  }, [logged]);

  return logged ? <MainApp /> : <Navigate replace to="/login" />;
};

export default connect((state) => ({
  logged: state.loginReducer.logged,
}))(Index);
