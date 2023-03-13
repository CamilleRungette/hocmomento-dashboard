import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { BiMinusCircle } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";
import SimpleEditor from "../Editor/Editor";
import axios from "axios";
import url from "../../url";

const EditAction = ({ actionDatas, showAlert, closeModal, getActions }) => {
  const initLink = {
    name: "",
    link: "",
    type: "pdf",
  };

  const [loading, setLoading] = useState(false);
  const [descriptionCopy, setDescriptionCopy] = useState(actionDatas.description);
  const [action, setAction] = useState(actionDatas);

  useEffect(() => {
    setDescriptionCopy(actionDatas.description);
    setAction(actionDatas);
  }, [actionDatas]);

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

  const addItem = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let showCopy = { ...action };

    showCopy.links.push(initLink);
    setAction({ ...action, links: showCopy.links });
  };

  const removeItem = (index) => {
    let showCopy = { ...action };

    showCopy.links.splice(index, 1);
    setAction({ ...action, links: showCopy.links });
  };

  const handleDescription = (html) => {
    setAction({ ...action, description: html });
  };

  const saveShow = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!action.place || !action.description) {
      showAlert("warning", 'Les champs "Lieu" et "description" sont obligatoires');
    } else {
      axios
        .patch(`${url}/actions/update-action/${action._id}`, action)
        .then(() => {
          showAlert("success", "Le spectacle a bien été modifié");
          getActions();
          closeModal();
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          showAlert(
            "error",
            "Erreur lors de la modification du spectacle, veuillez rééssayer plus tard."
          );
          setLoading(false);
        });
    }
  };

  return (
    <div className="edit-show-main">
      <h3>Modifier un spectacle</h3>

      <form className="show-form" onSubmit={saveShow}>
        <TextField
          id="place"
          label="Lieu"
          value={action.place}
          onChange={handleState("place")}
          className="input-form full-width"
          size="small"
        />

        <div className="input-form">
          <SimpleEditor handleDescription={handleDescription} text={descriptionCopy} />
        </div>

        <div className="div-links">
          <h4>Liens</h4>
          {action.links.map((link, i) => (
            <div key={`link${i}`} className="links">
              <div id="name">
                <TextField
                  name="name"
                  label="Nom"
                  className="input-form full-width"
                  size="small"
                  value={link.name}
                  onChange={handleItem({ type: "name", i, item: "link" })}
                />
              </div>
              <div id="link">
                <TextField
                  name="link"
                  label="Lien"
                  className="input-form full-width"
                  size="small"
                  value={link.link}
                  onChange={handleItem({ type: "link", i, item: "link" })}
                />
              </div>
              <div id="type">
                <FormControl fullWidth size="small" className="input-form full-width">
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    id="demo-simple-select"
                    name="link"
                    value={link.type}
                    onChange={handleItem({ type: "type", i, item: "link" })}
                  >
                    <MenuItem value={"pdf"}>Pdf</MenuItem>
                    <MenuItem value={"video"}>Video</MenuItem>
                    <MenuItem value={"url"}>Url</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <BiMinusCircle className="remove-icon pointer" onClick={() => removeItem(i)} />
            </div>
          ))}
          <button className="add-date pointer" onClick={(e) => addItem(e)}>
            <IoIosAdd /> Ajouter un lien
          </button>
        </div>
        <div className="btn-div">
          {!loading ? (
            <button className="btn">Enregistrer</button>
          ) : (
            <button className="btn-grey loading-btn" disabled>
              <div className="loading-div">
                <img src="/images/loading-btn.gif" alt="Loading ... " />
              </div>
              Enregistrer
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditAction;
