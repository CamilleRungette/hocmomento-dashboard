import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { BiMinusCircle } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";

const EditShow = ({ showData }) => {
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

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(showData);

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

  const addItem = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let showCopy = { ...showData };

    showCopy.links.push(initLink);
    setShow({ ...show, links: showCopy.links });
  };

  const removeItem = (index) => {
    let showCopy = { ...showData };

    showCopy.links.splice(index, 1);
    setShow({ ...show, links: showCopy.links });
  };

  const saveShow = (e) => {
    e.preventDefault();

    console.log("save");
    setLoading(true);
  };

  return (
    <div className="edit-show-main">
      <h3>Modifier un spectacle</h3>

      <form className="show-form" onSubmit={saveShow}>
        <TextField
          id="title"
          label="Titre"
          value={show.title}
          onChange={handleState("title")}
          className="input-form full-width"
          size="small"
        />

        <div className="div-links">
          <h4>Liens</h4>
          {showData.links.map((link, i) => (
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

export default EditShow;