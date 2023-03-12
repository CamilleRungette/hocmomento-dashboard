import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "../Components/Alert/Alert";

import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { IoIosAdd } from "react-icons/io";
import { BiMinusCircle } from "react-icons/bi";
import { VscClose } from "react-icons/vsc";

import url from "../url";
import SimpleEditor from "../Components/Editor/Editor";

const CreateAction = () => {
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

  const initLinks = [Math.floor(Math.random() * 1000000)];

  const alertRef = useRef();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    type: "info",
    message: "",
  });
  const [links, setLinks] = useState(initLinks);
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [pictureNames, setPictureNames] = useState([]);
  const [action, setAction] = useState(initialAction);

  const handleState = (prop) => (e) => {
    setAction({ ...action, [prop]: e.target.value });
  };

  const handleItem = (prop) => (e) => {
    let linksState = [...action.links];

    if (!linksState[prop.i]) {
      linksState[prop.i] = initLink;
    }

    linksState[prop.i][prop.type] = e.target.value;

    setAction({ ...action, links: linksState });
  };

  const addItem = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    let actionCopy = { ...action };

    setLinks([...links, Math.floor(Math.random() * 1000000)]);
    actionCopy.links.push(initLink);

    setAction(actionCopy);
  };

  const removeItem = (id, index, type) => {
    let showArray = { ...action };

    let linksArray = [...links];
    linksArray = linksArray.filter((link) => link !== id);
    setLinks(linksArray);

    showArray.links.splice(index, 1);
    setAction({ ...action, links: showArray.links });

    setAction(showArray);
  };

  const fileSelectedHandler = (e) => {
    let formDatas = [...pictures];
    let picturesNamesArray = [...pictureNames];

    Object.values(e.target.files).forEach((value) => {
      const formData = new FormData();
      formData.append("file", value);
      formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
      formData.append("folder", "hoc-momento");

      formDatas.push(formData);
      picturesNamesArray.push(value.name);
    });

    setPictures(formDatas);
    setPictureNames(picturesNamesArray);
  };

  const deletePicture = (i) => {
    let picturesCopy = [...pictures];
    let pictureNamesCopy = [...pictureNames];

    picturesCopy.splice(i, 1);
    pictureNamesCopy.splice(i, 1);

    setPictures(picturesCopy);
    setPictureNames(pictureNamesCopy);
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    alertRef.current.showAlert();
  };

  const handleDescription = (html) => {
    setAction({ ...action, description: html });
  };

  const saveAction = async (e) => {
    e.preventDefault();

    let finalAction = { ...action };

    if (!finalAction.title) {
      showAlert("warning", 'Les champs "Titre" et "description" sont obligatoires');
    } else {
      setLoading(true);
      let promises = pictures.map(async (picture) => {
        let result = await axios.post(process.env.REACT_APP_CLOUDINARY, picture);
        return result.data.secure_url;
      });

      if (
        finalAction.links.length === 1 &&
        JSON.stringify(finalAction.links[0]) === JSON.stringify(initLink)
      )
        finalAction.links = [];
      if (pictures.length) {
        Promise.all(promises)
          .then((values) => {
            finalAction.gallery = values;
            axios
              .post(`${url}/actions/create-action`, finalAction)
              .then(() => {
                showAlert("success", "L'action culturelle a bien été créée");
                setTimeout(
                  function () {
                    setLoading(false);
                    navigate("/actions");
                  },
                  [2000]
                );
              })
              .catch((err) => {
                console.log(err);
                showAlert(
                  "error",
                  "Erreur lors de la création du spectacle, veuillez réessayer plus tard"
                );
              });
          })
          .catch((error) => {
            console.log(error);
            showAlert(
              "error",
              "Erreur lors du téléchargement des photos, veuillez réessayer plus tard"
            );
          });
      } else {
        axios
          .post(`${url}/actions/create-action`, finalAction)
          .then(() => {
            showAlert("success", "L'action culturelle a bien été créée");
            setTimeout(
              function () {
                setLoading(false);
                navigate("/actions");
              },
              [2000]
            );
          })
          .catch((err) => {
            console.log(err);
            showAlert(
              "error",
              "Erreur lors de la création du spectacle, veuillez réessayer plus tard"
            );
          });
      }
    }
  };

  return (
    <div className="inside-app">
      <div className="card card-main create-show-main">
        <h3>Créer une action culturelle</h3>

        <form className="show-form" onSubmit={saveAction}>
          <TextField
            id="place"
            label="Lieu"
            value={action.place}
            onChange={handleState("place")}
            className="input-form full-width"
            size="small"
          />
          <TextField
            id="city"
            label="Ville"
            value={action.city}
            onChange={handleState("city")}
            className="input-form full-width"
            size="small"
          />
          <TextField
            id="title"
            label="Titre"
            value={action.title}
            onChange={handleState("title")}
            className="input-form full-width"
            size="small"
          />

          <div className="input-form">
            <h4>Description</h4>
            <SimpleEditor handleDescription={handleDescription} text="" />
          </div>
          <div className="dates-and-picture">
            <div className="pictures-div">
              <h4>Télécharger des photos</h4>

              <div className="upload-multiple-pictures">
                <input
                  onChange={fileSelectedHandler}
                  type="file"
                  name="file"
                  id="file"
                  className="inputfile"
                  multiple
                />
                <label htmlFor="file" className="label">
                  <IoIosAdd className="plus-icon" />
                  Ajouter des photos
                </label>
              </div>
              <ul className="no-list-style picture-names-list">
                {pictureNames.map((name, i) => (
                  <li key={name}>
                    {name}{" "}
                    <VscClose className="delete-picture pointer" onClick={() => deletePicture(i)} />{" "}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="div-links">
            <h4>Liens</h4>
            {links.map((link, i) => (
              <div key={link} className="links">
                <div id="name">
                  <TextField
                    name="name"
                    label="Nom"
                    className="input-form full-width"
                    size="small"
                    value={action.links[i].name}
                    onChange={handleItem({ type: "name", i, item: "link" })}
                  />
                </div>
                <div id="link">
                  <TextField
                    name="link"
                    label="Lien"
                    className="input-form full-width"
                    size="small"
                    value={action.links[i].link}
                    onChange={handleItem({ type: "link", i, item: "link" })}
                  />
                </div>
                <div id="type">
                  <FormControl fullWidth size="small" className="input-form full-width">
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                      id="demo-simple-select"
                      name="link"
                      value={action.links[i].type}
                      onChange={handleItem({ type: "type", i, item: "link" })}
                    >
                      <MenuItem value={"pdf"}>Pdf</MenuItem>
                      <MenuItem value={"video"}>Video</MenuItem>
                      <MenuItem value={"url"}>Url</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <BiMinusCircle
                  className="remove-icon pointer"
                  onClick={() => removeItem(link, i, "link")}
                />
              </div>
            ))}
            <button className="add-date pointer" onClick={(e) => addItem(e, "link")}>
              <IoIosAdd /> Ajouter un lien
            </button>
          </div>
          <div className="btn-div">
            {!loading ? (
              <button className="btn"> Créer</button>
            ) : (
              <button className="btn-grey" disabled>
                <div className="loading-div">
                  <img src="/images/loading-btn.gif" alt="Loading ... " />{" "}
                </div>
                Créer
              </button>
            )}
          </div>
        </form>
        <Alert ref={alertRef} type={alert.type} message={alert.message} />
      </div>
    </div>
  );
};

export default CreateAction;
