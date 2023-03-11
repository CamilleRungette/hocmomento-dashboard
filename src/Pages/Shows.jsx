import React, { useRef, useState, useMemo } from "react";
import axios from "axios";
import { BsDownload } from "react-icons/bs";
import { Link } from "react-router-dom";

import Alert from "../Components/Alert/Alert";
import EditShow from "../Components/Shows/EditShow";
import BasicModal from "../Components/Modal/BasicModal";
import ConfirmModal from "../Components/Modal/ConfirmModal";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import url from "../url";

const Shows = () => {
  const initDate = {
    startDate: null,
    endDate: null,
    place: "",
    address: "",
    city: "",
  };

  const initLink = {
    name: "",
    link: "",
    type: "pdf",
  };

  const initialShow = {
    title: "",
    description: "",
    dates: [initDate],
    gallery: [],
    links: [initLink],
  };

  const modalRef = useRef();
  const alertRef = useRef();
  const confirmRef = useRef();
  const [show, setShow] = useState(initialShow);
  const [alert, setAlert] = useState({
    type: "info",
    message: "",
  });

  useMemo(() => {
    axios
      .get(`${url}/shows/shows`)
      .then((res) => {
        setShows(res.data);
      })
      .catch((e) => {
        showAlert("error", "Erreur lors du chargement des spectacles");
        console.log(e);
      });
  }, []);

  const showModal = (data) => {
    setShow(data);
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
    setShow(data);
    confirmRef.current.showModal();
  };

  const deleteShow = () => {
    axios
      .post(`${url}/dashboard/delete-show`, { id: show._id })
      .then((res) => {
        if (res.data === "success") {
          showAlert("success", "Le spectacle a bien été supprimé");
        } else {
          showAlert(
            "error",
            "Erreur lors de la suppression du spectacle, veuillez rééssayer plus tard."
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [shows, setShows] = useState([]);

  return (
    <div className="inside-app">
      {shows.length ? (
        shows.map((show) => (
          <Accordion key={show._id} className="card show-main">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <h2>{show.title} </h2>
            </AccordionSummary>
            <AccordionDetails>
              <div className="show-buttons-div">
                <button className="btn" onClick={() => showModal(show)}>
                  Modifier
                </button>
                <Link to={`/spectacle/${show._id}/gallerie`}>
                  <button className="btn-outlined">Voir la gallerie</button>
                </Link>
                <button className="btn-red-outlined" onClick={() => showDialog(show)}>
                  Supprimer
                </button>
              </div>
              <p
                className="show-description"
                dangerouslySetInnerHTML={{ __html: show.description }}
              />
              {show.dates.length ? (
                <ul className="no-list-style">
                  <h4> Dates </h4>
                  {show.dates.map((date, i) => (
                    <li key={`date${i}`}>
                      <p>{date}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <></>
              )}

              {show.links.length ? (
                <ul className="no-list-style links-list">
                  <h4>Liens</h4>
                  {show.links.map((link) =>
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
        content={<EditShow showAlert={showAlert} showData={show} closeModal={closeModal} />}
      />
      <Alert ref={alertRef} type={alert.type} message={alert.message} />
      <ConfirmModal
        ref={confirmRef}
        content={<div>Êtes-vous sûr de vouloir supprimer ce spectacle ?</div>}
        button={true}
        confirmParent={deleteShow}
      />
    </div>
  );
};

export default Shows;
