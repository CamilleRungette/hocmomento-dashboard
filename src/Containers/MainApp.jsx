import React from "react";
import loginActions from "../redux/actions/login.actions";
import { connect } from "react-redux";

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
  const logOut = () => {
    logOutComp();
  };
  return (
    <div className="main-app">
      {/* <Topbar />
      <Sidebar />
      <App /> */}
      <h1> main app</h1>
      <button onClick={logOut}> log out</button>
    </div>
  );
};

export default connect(
  (state) => ({}),
  (dispatch) => ({
    logOutComp: () => dispatch(loginActions.logOut()),
  })
)(MainApp);
