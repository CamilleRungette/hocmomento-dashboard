import React from "react";
import { connect } from "react-redux";

const Menu = ({ logged }) => {
  return <h1>Menu page</h1>;
};

export default connect((state) => ({
  logged: state.loginReducer,
}))(Menu);
