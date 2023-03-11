import React from "react";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import Avatar from "@mui/material/Avatar";
import sidebarActions from "../redux/actions/sidebar.actions";
import loginActions from "../redux/actions/login.actions";
import { connect } from "react-redux";

const Topbar = ({ logOutComp, showSidebarComp }) => {
  const showLogOut = () => {
    document.getElementById("logout").style.display = "block";
    document.getElementById("close-logout").style.display = "block";
  };

  const closeLogOut = () => {
    document.getElementById("logout").style.display = "none";
    document.getElementById("close-logout").style.display = "none";
  };

  const logOut = () => {
    logOutComp();
  };

  const showSidebar = () => {
    showSidebarComp();
  };

  return (
    <div className="topbar-main">
      <div className="logo-div">
        <div className="menu-logo">
          <AiOutlineMenuUnfold className="pointer" onClick={showSidebar} />
        </div>
        <div className="hoc-momento-logo">
          <img src="/images/logo_noir.png" alt="Logo Hoc Momento" />
        </div>
      </div>
      <div className="profile">
        <Avatar className="pointer" onClick={showLogOut}>
          H
        </Avatar>
        <div id="logout" className="logout pointer" onClick={logOut}>
          Se déconnecter
        </div>
        <div id="close-logout" className="close-logout" onClick={closeLogOut}></div>
      </div>
    </div>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({
    logOutComp: () => dispatch(loginActions.logOut()),
    showSidebarComp: () => dispatch(sidebarActions.showSidebar()),
  })
)(Topbar);
