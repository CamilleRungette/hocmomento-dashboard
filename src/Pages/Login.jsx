import React, { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import AlertMessage from "../Components/Alert/Alert";
import axios from "axios";
import { connect } from "react-redux";
import loginActions from "../redux/actions/login.actions";
import url from "../url";

const Login = ({ logged, logUserComp }) => {
  const alertRef = useRef();

  useEffect(() => {
    console.log("from login");
  }, [logged]);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({
    type: "info",
    message: "",
  });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    alertRef.current.showAlert();
  };

  const handleState = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const connect = (e) => {
    e.preventDefault();

    if (!values.email) showAlert("warning", "Vous n'avez pas entré d'email");
    else if (!values.password) showAlert("warning", "Vous n'avez pas entré de mot de passe");
    else {
      axios
        .post(`${url}/admin/admin-login`, values)
        .then((res) => {
          console.log(res.data);
          if (res.data.success) {
            logUserComp();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <div className="login-main">
        <div className="login-card">
          <div className="center-content">
            <h3>Se connecter à l'espace Hoc Momento</h3>
          </div>

          <div className="connection">
            <div className="gif">
              <img src="/images/login.gif" alt="Log in Hoc Momento workspace" />
            </div>
            <form className="login-form" onSubmit={connect}>
              <TextField
                id="email"
                label="Email"
                value={values.email}
                onChange={handleState("email")}
                size="small"
                className="full-width input"
              />

              <TextField
                id="password"
                label="Mot de passe"
                value={values.password}
                onChange={handleState("password")}
                size="small"
                type="password"
                className="full-width input"
              />

              <div className="center-content">
                <button className="btn">Connexion</button>
              </div>
            </form>
          </div>
          <AlertMessage ref={alertRef} type={alert.type} message={alert.message} />
        </div>
      </div>
    </div>
  );
};

export default connect(
  (state) => ({
    logged: state.loginReducer,
  }),
  (dispatch) => ({
    logUserComp: () => dispatch(loginActions.logUser()),
  })
)(Login);
