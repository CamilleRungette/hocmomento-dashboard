import React, { useRef, useState, useMemo } from "react";
import axios from "axios";
import { BsDownload } from "react-icons/bs";
import { Link } from "react-router-dom";

import Alert from "../Components/Alert/Alert";
import EditAction from "../Components/Actions/EditAction";
import BasicModal from "../Components/Modal/BasicModal";
import ConfirmModal from "../Components/Modal/ConfirmModal";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import url from "../url";

const Actions = () => {
  const initLink = {
    name: "",
    link: "",
    type: "pdf",
  };

  const initialAction = {
    city: "",
    description: "",
    gallery: [],
    links: [initLink],
    place: "",
    title: "",
  };

  const modalRef = useRef();
  const alertRef = useRef();
  const confirmRef = useRef();
  const [action, setAction] = useState(initialAction);
  const [actions, setActions] = useState([]);
  const [alert, setAlert] = useState({
    type: "info",
    message: "",
  });

  const getActions = () => {
    axios
      .get(`${url}/actions/actions`)
      .then((res) => {
        setActions(res.data);
      })
      .catch((e) => {
        showAlert("error", "Erreur lors du chargement des spectacles");
        console.log(e);
      });
  };

  useMemo(() => {
    getActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModal = (data) => {
    setAction(data);
    modalRef.current.showModal();
  };

  const closeModal = () => {
    modalRef.current.closeModal();
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    alertRef.current.showAlert();
  };

  const showDialog = (data) => {
    setAction(data);
    confirmRef.current.showModal();
  };

  const deleteAction = () => {
    axios
      .delete(`${url}/actions/delete-action/${action._id}`)
      .then(() => {
        showAlert("success", "Le spectacle a bien été supprimé");
        getActions();
      })
      .catch((error) => {
        console.log(error);
        showAlert(
          "error",
          "Erreur lors de la suppression du spectacle, veuillez rééssayer plus tard."
        );
      });
  };

  return (
    <div className="inside-app">
      {actions.length ? (
        actions.map((action) => (
          <Accordion key={action._id} className="card show-main">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <h2>
                {action.place}
                {action.title && ` - ${action.title}`}
              </h2>
            </AccordionSummary>
            <AccordionDetails>
              <div className="show-buttons-div">
                <button className="btn" onClick={() => showModal(action)}>
                  Modifier
                </button>
                <Link to={`/spectacle/${action._id}/gallerie`}>
                  <button className="btn-outlined">Voir la gallerie</button>
                </Link>
                <button className="btn-red-outlined" onClick={() => showDialog(action)}>
                  Supprimer
                </button>
              </div>
              <p>{action.city}</p>
              <p
                className="show-description"
                dangerouslySetInnerHTML={{ __html: action.description }}
              />

              {action.links.length ? (
                <ul className="no-list-style links-list">
                  <h4>Liens</h4>
                  {action.links.map((link) =>
                    link.type === "pdf" ? (
                      <li key={Math.floor(Math.random() * 1000000)}>
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="show-link"
                        >
                          {link.name}
                        </a>
                        <BsDownload className="icon" />
                      </li>
                    ) : (
                      <li key={Math.floor(Math.random() * 1000000)}>
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="show-link"
                        >
                          {link.name}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <></>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <div className="loading-div">
          <img src="/images/loading.gif" alt="events-loader" />
        </div>
      )}
      <BasicModal
        ref={modalRef}
        content={
          <EditAction
            actionDatas={action}
            showAlert={showAlert}
            closeModal={closeModal}
            getActions={getActions}
          />
        }
      />
      <Alert ref={alertRef} type={alert.type} message={alert.message} />
      <ConfirmModal
        ref={confirmRef}
        content={<div>Êtes-vous sûr de vouloir supprimer ce spectacle ?</div>}
        button={true}
        confirmParent={deleteAction}
      />
    </div>
  );
};

export default Actions;
