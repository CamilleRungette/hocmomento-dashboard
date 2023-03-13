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
import dayjs from "dayjs";

const CreateShow = () => {
  const initLink = {
    name: "",
    link: "",
    type: "pdf",
  };

  const initialShow = {
    title: "",
    description: "",
    gallery: [],
    links: [initLink],
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
  const [show, setShow] = useState(initialShow);

  const handleState = (prop) => (e) => {
    setShow({ ...show, [prop]: e.target.value });
  };

  const handleItem = (prop) => (e) => {
    let linksState = [...show.links];

    if (!linksState[prop.i]) {
      linksState[prop.i] = initLink;
    }

    linksState[prop.i][prop.type] = e.target.value;

    setShow({ ...show, links: linksState });
  };

  const addItem = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    let showCopy = { ...show };

    setLinks([...links, Math.floor(Math.random() * 1000000)]);
    showCopy.links.push(initLink);

    setShow(showCopy);
  };

  const removeItem = (id, index, type) => {
    let showArray = { ...show };

    let linksArray = [...links];
    linksArray = linksArray.filter((link) => link !== id);
    setLinks(linksArray);

    showArray.links.splice(index, 1);
    setShow({ ...show, links: showArray.links });

    setShow(showArray);
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
    setShow({ ...show, description: html });
  };

  const saveShow = async (e) => {
    e.preventDefault();

    let finalShow = { ...show };
    finalShow.createdAt = dayjs();

    if (!finalShow.title) {
      showAlert("warning", 'Les champs "Titre" et "description" sont obligatoires');
    } else {
      setLoading(true);
      let promises = pictures.map(async (picture) => {
        let result = await axios.post(process.env.REACT_APP_CLOUDINARY, picture);
        return result.data.secure_url;
      });

      if (
        finalShow.links.length === 1 &&
        JSON.stringify(finalShow.links[0]) === JSON.stringify(initLink)
      )
        finalShow.links = [];
      if (pictures.length) {
        Promise.all(promises)
          .then((values) => {
            finalShow.gallery = values;
            axios
              .post(`${url}/shows/create-show`, finalShow)
              .then(() => {
                showAlert("success", "Le spectacle a bien été créé");
                setTimeout(
                  function () {
                    setLoading(false);
                    navigate("/spectacles");
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
          .post(`${url}/shows/create-show`, finalShow)
          .then(() => {
            showAlert("success", "Le spectacle a bien été créé");
            setTimeout(
              function () {
                setLoading(false);
                navigate("/spectacles");
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
        <h3>Créer un spectacle</h3>

        <form className="show-form" onSubmit={saveShow}>
          <TextField
            id="title"
            label="Titre"
            value={show.title}
            onChange={handleState("title")}
            className="input-form full-width"
            size="small"
          />

          <div className="input-form">
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
                    value={show.links[i].name}
                    onChange={handleItem({ type: "name", i, item: "link" })}
                  />
                </div>
                <div id="link">
                  <TextField
                    name="link"
                    label="Lien"
                    className="input-form full-width"
                    size="small"
                    value={show.links[i].link}
                    onChange={handleItem({ type: "link", i, item: "link" })}
                  />
                </div>
                <div id="type">
                  <FormControl fullWidth size="small" className="input-form full-width">
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                      id="demo-simple-select"
                      name="link"
                      value={show.links[i].type}
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

export default CreateShow;
