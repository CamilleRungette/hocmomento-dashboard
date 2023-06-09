import React, { useRef, useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { IoIosMore, IoIosAdd } from "react-icons/io";
import { BsTrash } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import BasicModal from "../Components/Modal/BasicModal";
import ConfirmModal from "../Components/Modal/ConfirmModal";
import CreateEvent from "../Components/Agenda/CreateEvent";
import EditEvent from "../Components/Agenda/EditEvent";
import AlertMessage from "../Components/Alert/Alert";
import url from "../url";

const Agenda = () => {
  const initDate = {
    startDate: null,
    endDate: null,
    place: "",
    address: "",
    city: "",
  };

  const initialEvent = {
    title: "",
    description: "",
    dates: [initDate],
    photo: "",
  };

  const modalRef = useRef();
  const alertRef = useRef();
  const confirmRef = useRef();
  const [thisEvent, setEvent] = useState({});
  const [modalContent, setModalContent] = useState(<CreateEvent />);
  const [eventsYear, setEventsYear] = useState([]);
  const [alert, setAlert] = useState({
    type: "info",
    message: "",
  });
  const [events, setEvents] = useState([]);

  const years = [
    2033, 2032, 2031, 2030, 2029, 2028, 2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018,
  ];
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

  const getEvents = () => {
    axios.get(`${url}/events/events`).then((res) => {
      setEvents(res.data);

      let array = [];
      res.data.forEach((event) => {
        event.dates.forEach((date) => {
          if (!array.includes(new Date(date.startDate).getFullYear())) {
            array.push(new Date(date.startDate).getFullYear());
          }
        });
      });
      setEventsYear(array);
    });
  };

  useEffect(() => {
    getEvents();
  }, []);

  const showModal = () => {
    modalRef.current.showModal();
  };

  const closeModal = () => {
    modalRef.current.closeModal();
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    alertRef.current.showAlert();
  };

  const showDialog = (event) => {
    setEvent(event);
    confirmRef.current.showModal();
  };

  const changeModalContent = (type, thisEvent) => {
    if (type === "edit") {
      setEvent(thisEvent);
      setModalContent(
        <EditEvent
          showAlert={showAlert}
          closeModal={closeModal}
          eventInfos={thisEvent}
          getEvents={getEvents}
        />
      );
    } else if (type === "create") {
      setEvent(initialEvent);
      setModalContent(
        <CreateEvent showAlert={showAlert} closeModal={closeModal} getEvents={getEvents} />
      );
    }
    showModal();
  };

  const deleteEvent = () => {
    axios
      .delete(`${url}/events/delete-event/${thisEvent._id}`)
      .then(() => {
        showAlert("success", "L'événement a bien été supprimé");
        getEvents();
      })
      .catch((error) => {
        showAlert(
          "error",
          "Erreur lors de la suppression de l'événement, veuillez rééssayer plus tard."
        );
        console.log(error);
      });
  };

  const isThisYear = (dates, year) => {
    for (const date of dates) {
      if (date.startDate.includes(year)) {
        return true;
      }
    }
    return false;
  };
  return (
    <div className="inside-app">
      <div className="card card-main agenda-main">
        <h3> Agenda</h3>

        <AlertMessage ref={alertRef} type={alert.type} message={alert.message} />

        <IoIosAdd className="add-event pointer" onClick={() => changeModalContent("create")} />

        {events.length ? (
          <div className="events">
            {years.map((year, i) =>
              eventsYear.includes(year) ? (
                <Accordion
                  key={`year${i}`}
                  className="accordion"
                  defaultExpanded={i === 10 ? true : false}
                >
                  <AccordionSummary
                    expandIcon={<IoIosMore className="icon" />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <h3>{year}</h3>
                  </AccordionSummary>
                  {events.map(
                    (event, i) =>
                      isThisYear(event.dates, year) && (
                        <AccordionDetails key={`event${i}`} className="event-details">
                          <div className="accordion-title">
                            <h2>{event.title}</h2>

                            <div className="event-actions">
                              <AiOutlineEdit
                                className="event-icon pointer"
                                onClick={() => changeModalContent("edit", event)}
                              />
                              <BsTrash
                                className="event-icon trash pointer"
                                onClick={() => showDialog(event)}
                              />
                            </div>
                          </div>

                          {event.dates.map((date, i) =>
                            date.startDate.includes(year) ? (
                              <div key={`date${i}`} className="event-date">
                                <p>
                                  {new Date(date.startDate).getDate() ===
                                  new Date(date.endDate).getDate() ? (
                                    <span>
                                      Le {new Date(date.startDate).getDate()}{" "}
                                      {months[new Date(date.startDate).getMonth()]}{" "}
                                    </span>
                                  ) : (
                                    <span>
                                      Du {new Date(date.startDate).getDate()}
                                      {new Date(date.startDate).getMonth() !==
                                      new Date(date.endDate).getMonth() ? (
                                        <span> {months[new Date(date.startDate).getMonth()]} </span>
                                      ) : (
                                        <> </>
                                      )}
                                      au {new Date(date.endDate).getDate()}{" "}
                                      {months[new Date(date.endDate).getMonth()]}
                                    </span>
                                  )}
                                  {new Date(date.startDate).getHours() ===
                                  new Date(date.endDate).getHours() ? (
                                    <span>
                                      {" "}
                                      à {new Date(date.startDate).getHours()}h{" "}
                                      {new Date(date.startDate).getMinutes() !== 0
                                        ? new Date(date.startDate).getMinutes()
                                        : ""}
                                    </span>
                                  ) : (
                                    <span>
                                      {" "}
                                      de {new Date(date.startDate).getHours()}h
                                      {new Date(date.startDate).getMinutes() !== 0
                                        ? new Date(date.startDate).getMinutes()
                                        : ""}{" "}
                                      à {new Date(date.endDate).getHours()}h
                                      {new Date(date.startDate).getMinutes() !== 0
                                        ? new Date(date.startDate).getMinutes()
                                        : ""}
                                    </span>
                                  )}
                                </p>

                                <p>{date.place} </p>

                                <p>
                                  {date.address ? <span>{date.address},</span> : <></>}{" "}
                                  {date.city ? date.city : <></>}
                                </p>
                              </div>
                            ) : (
                              <div key={`date${i}`}></div>
                            )
                          )}
                          <div className="event-desc">
                            <div className="description">
                              <p>{event.description} </p>
                            </div>
                            <div className="photo">
                              {event.photo ? (
                                <img alt={event.title} src={event.photo} />
                              ) : (
                                <p className="no-photo">Pas de photo</p>
                              )}
                            </div>
                          </div>
                        </AccordionDetails>
                      )
                  )}
                </Accordion>
              ) : (
                <div key={`year${i}`}></div>
              )
            )}
          </div>
        ) : (
          <div className="loading-div">
            <img src="/images/loading.gif" alt="events-loader" />
          </div>
        )}
      </div>
      <ConfirmModal
        ref={confirmRef}
        content={<div>Êtes-vous sûr de vouloir supprimer cet événement ?</div>}
        button={true}
        confirmParent={deleteEvent}
      />
      <BasicModal ref={modalRef} content={modalContent} />
    </div>
  );
};

export default Agenda;
