import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../Components/Alert/Alert";
import url from "../url";

const Dashboard = () => {
  const alertRef = useRef();
  const navigate = useNavigate();
  const innerWidth = window.innerWidth;
  const [alert, setAlert] = useState({
    type: "info",
    message: "",
  });
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    axios
      .get(`${url}/count`)
      .then((res) => {
        setCounts(res.data);
      })
      .catch((e) => {
        showAlert(
          "error",
          "Erreur lors de la connection à la base de données, veuillez rééssayer plus tard."
        );
      });
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    alertRef.current.showAlert();
  };

  const getTitle = (key) => {
    switch (key) {
      case "actions":
        return "Actions culturelles";
      case "shows":
        return "Spectacles";
      case "events":
        return "Agenda";
      case "messages":
        return "Messagerie";
      default:
        return "";
    }
  };

  const getSubText = (key) => {
    switch (key) {
      case "actions":
        return "Actions culturelle publiées";
      case "shows":
        return "Spectacles publiés";
      case "events":
        return "Évènements publiés";
      case "messages":
        return "Messages reçus";
      default:
        return "";
    }
  };

  const handleClick = (key) => {
    switch (key) {
      case "actions":
        return navigate("/actions");
      case "shows":
        return navigate("/spectacles");
      case "events":
        return navigate("/agenda");
      case "messages":
        return navigate("/messagerie");
      default:
        return "";
    }
  };

  return (
    <div className="inside-app ">
      <div className="dashboard-main">
        {Object.entries(counts).map(([key, value]) => (
          <div
            key={key}
            className="dashboard-card"
            style={{ minWidth: innerWidth / 2 - 300 }}
            onClick={() => handleClick(key)}
          >
            <div className="title-div">
              <p className="title">{getTitle(key)} </p>
            </div>
            <div className="separator"></div>
            <div className="value-div">
              <p className="value">{value}</p>
              <p className="subtext">{getSubText(key)} </p>
            </div>
          </div>
        ))}
        <AlertMessage ref={alertRef} type={alert.type} message={alert.message} />
      </div>
    </div>
  );
};

export default Dashboard;
