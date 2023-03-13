import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { IoIosAdd } from "react-icons/io";
import { BsTrash } from "react-icons/bs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import url from "../../url";
import axios from "axios";
import "dayjs/locale/fr";

const CreateEvent = ({ showAlert, closeModal }) => {
  const initDate = {
    startDate: "",
    endDate: "",
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

  const [event, setEvent] = useState(initialEvent);
  const [picture, setPicture] = useState();
  const [pictureName, setPictureName] = useState();
  const [dates, setDates] = useState([initDate]);

  const handleState = (prop) => (e) => {
    setEvent({ ...event, [prop]: e.target.value });
  };

  const handleDate = (prop) => (e) => {
    let datesState = [...dates];
    console.log(prop);
    // if (!datesState[prop.i]) {
    //   datesState[prop.i] = initDate;
    // }

    if (prop.type === "startDate" || prop.type === "endDate") {
      datesState[prop.i][prop.type] = e;
    } else {
      datesState[prop.i][prop.type] = e.target.value;
    }

    setDates(datesState);
  };

  // const addDate = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   setDates([...dates, Math.floor(Math.random() * 1000000)]);

  //   let eventCopy = { ...event };
  //   eventCopy.dates.push(initDate);
  //   setEvent(eventCopy);
  // };

  // const removeDate = (id, index) => {
  //   let datesArray = [...dates];
  //   datesArray = datesArray.filter((date) => date !== id);
  //   setDates(datesArray);

  //   let eventsArray = { ...event };
  //   eventsArray.dates.splice(index, 1);
  //   setEvent(eventsArray);
  // };

  const fileSelectedHandler = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
    formData.append("folder", "hoc-momento");
    setPicture(formData);

    setPictureName(e.target.files[0].name);
  };

  const deletePicture = () => {
    setPicture();
    setPictureName();
  };

  const saveInfos = (e) => {
    e.preventDefault();

    let newEvent = { ...event };
    newEvent.dates = dates;

    if (!newEvent.title || !newEvent.dates[0].startDate || !newEvent.dates[0].endDate) {
      showAlert("warning", "Le titre et au moins une date sont obligatoires");
    } else {
      if (picture) {
        axios
          .post(process.env.REACT_APP_CLOUDINARY, picture)
          .then((res) => {
            newEvent.photo = res.data.secure_url;
            axios
              .post(`${url}/events/create-event`, newEvent)
              .then(() => {
                showAlert("success", "Le nouvel événement a bien été créé");
                setPicture();
                setPictureName();
                setEvent(initialEvent);
                setDates([initDate]);
                closeModal();
              })
              .catch((error) => {
                showAlert(
                  "error",
                  "Erreur lors de la création de l'événement, veuillez réessayer plus tard"
                );
                console.log(error);
              });
          })
          .catch((error) => {
            showAlert(
              "error",
              "Erreur avec le chargement de la photo, veuillez réessayer plus tard"
            );
            console.log(error);
          });
      } else {
        axios
          .post(`${url}/events/create-event`, newEvent)
          .then(() => {
            showAlert("success", "Le nouvel événement a bien été créé");
            setPicture();
            setPictureName();
            setEvent(initialEvent);
            setDates([initDate]);
            closeModal();
          })
          .catch((error) => {
            showAlert(
              "error",
              "Erreur lors de la création de l'événement, veuillez réessayer plus tard"
            );
            console.log(error);
          });
      }
    }
  };

  return (
    <div className="event-components">
      <h3>Créer un événement </h3>

      <form className="event-form" onSubmit={saveInfos}>
        <div className="input-form full-width">
          <TextField
            id="title"
            label="Titre"
            value={event.title}
            onChange={handleState("title")}
            className="full-width"
            size="small"
          />
        </div>
        <div className="input-form">
          <TextField
            id="description"
            label="Description"
            multiline
            maxRows={10}
            minRows={5}
            value={event.description}
            onChange={handleState("description")}
            className="full-width"
          />
        </div>

        <h4>Dates</h4>
        {dates.map((date, i) => (
          <div key={date} className="dates">
            <div className="date-picker-div input-form">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="fr"
                className="date-picker"
              >
                <DemoContainer components={["MobileDateTimePicker"]}>
                  <MobileDateTimePicker
                    label="Début"
                    onChange={handleDate({ type: "startDate", i })}
                    value={date.startDate}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="fr"
                className="date-picker"
              >
                <DemoContainer components={["MobileDateTimePicker"]}>
                  <MobileDateTimePicker
                    defaultValue={dayjs()}
                    label="Fin"
                    onChange={handleDate({ type: "endDate", i })}
                    value={date.endDate}
                  />
                </DemoContainer>
              </LocalizationProvider>
              {/* <BiMinusCircle className="remove-icon pointer" onClick={() => removeDate(date, i)} /> */}
            </div>

            <div className="input-form adress-line">
              <TextField
                id="place"
                name="place"
                label="Lieu"
                className="line full-width"
                onChange={handleDate({ type: "place", i })}
                value={date.place}
                size="small"
              />
              <TextField
                id="city"
                name="city"
                label="Ville"
                className="line full-width"
                onChange={handleDate({ type: "city", i })}
                value={date.city}
                size="small"
              />
            </div>
            <div className="input-form">
              <TextField
                id="address"
                name="address"
                label="Adresse"
                className="input-form full-width"
                onChange={handleDate({ type: "address", i })}
                value={date.address}
                size="small"
              />
            </div>
          </div>
        ))}

        {/* <button className="add-date pointer" onClick={(e) => addDate(e)}>
          <IoIosAdd /> Ajouter
        </button> */}

        <h4>Télécharger une photo</h4>

        {!pictureName ? (
          <div className="upload-picture">
            <input
              onChange={fileSelectedHandler}
              type="file"
              name="file"
              id="file"
              className="inputfile"
            />
            <label htmlFor="file" className="label">
              <IoIosAdd className="plus-icon" />
              Ajouter
            </label>
          </div>
        ) : (
          <div>
            <p>
              {pictureName} <BsTrash className="delete-picture pointer" onClick={deletePicture} />
            </p>
          </div>
        )}

        <div className="btn-div">
          <button className="btn">Créer</button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
