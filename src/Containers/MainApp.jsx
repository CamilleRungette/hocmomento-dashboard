import React from "react";
import loginActions from "../redux/actions/login.actions";
import { connect } from "react-redux";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import App from "../routes/App";

const MainApp = ({ saveEventsComp, saveShowsComp, logOutComp }) => {
  // useEffect(() => {
  //   axios
  //     .get(`${url}/events`)
  //     .then((res) => {
  //       saveEventsComp(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   axios
  //     .get(`${url}/shows`)
  //     .then((res) => {
  //       saveShowsComp(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <div className="main-app">
      <Topbar />
      <Sidebar />
      <App />
    </div>
  );
};

export default MainApp;
