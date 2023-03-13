import axios from "axios";
import { useEffect, useRef, useState } from "react";
import url from "../url";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Alert } from "@mui/material";

const Messages = () => {
  const alertRef = useRef();
  const [messages, setMessages] = useState([]);
  const [alert, setAlert] = useState({
    type: "info",
    message: "",
  });

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const getMessages = () => {
    axios
      .get(`${url}/messages/messages`)
      .then((res) => {
        setMessages(res.data);
      })
      .catch((e) => {
        showAlert("error", "Erreur lors du chargement des messages");
        console.log(e);
      });
  };

  useEffect(() => {
    getMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    alertRef.current.showAlert();
  };

  const formatDate = (messageDate) => {
    const date = `${new Date(messageDate).getDate()} ${
      months[new Date(messageDate).getMonth()]
    } ${new Date(messageDate).getFullYear()}`;

    return date;
  };

  const handleRead = (message) => {
    axios
      .patch(`${url}/messages/update-message/${message._id}`, { read: !message.read })
      .then(() => {
        getMessages();
      })
      .catch((e) => {
        showAlert(
          "error",
          "Erreur lors de la modification du message, veuillez rééssayer plus tard."
        );
      });
  };

  return (
    <div className="inside-app">
      <div className="message-main">
        <div className="title-div">
          <h2 className="title"> Messagerie</h2>
        </div>

        {messages.map((message, i) => (
          <Card key={i} className={message.read ? "message-card read" : "message-card"}>
            <CardContent className="content">
              <span className="message">{message.content}</span>
              <p className="email"> {message.email}</p>
              <p className="date">
                De {message.name} le {formatDate(message.date)}
              </p>
            </CardContent>

            {message.read ? (
              <Button size="small" className="button" onClick={() => handleRead(message)}>
                Marquer comme non lu
              </Button>
            ) : (
              <Button size="small" className="button" onClick={() => handleRead(message)}>
                Marquer comme lu
              </Button>
            )}
          </Card>
        ))}
      </div>
      <Alert ref={alertRef} type={alert.type} message={alert.message} />
    </div>
  );
};

export default Messages;
