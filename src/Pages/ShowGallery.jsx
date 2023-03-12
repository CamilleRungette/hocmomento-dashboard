import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Alert from "../Components/Alert/Alert";

import { Link } from "react-router-dom";

import { IoIosAdd, IoIosArrowBack } from "react-icons/io";
import { VscClose } from "react-icons/vsc";
import { BsTrash } from "react-icons/bs";

import url from "../url";
import axios from "axios";

const ShowGallery = () => {
  const initialShow = {
    title: "",
    description: "",
    dates: [],
    gallery: [],
    links: [],
  };

  const showId = useParams().id;
  const alertRef = useRef();
  const [show, setShow] = useState(initialShow);
  const [pictures, setPictures] = useState([]);
  const [pictureNames, setPictureNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    type: "info",
    message: "",
  });

  const getShow = () => {
    axios
      .get(`${url}/shows/show/${showId}`)
      .then((res) => {
        setShow(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId]);

  const deletePicture = (photo, type) => {
    if (type === "old") {
      let btn = document.getElementById("save");
      if (btn.style.display === "" || btn.style.display === "none") {
        btn.style.display = "flex";
        btn.style.justifyContent = "center";
      }

      let galleryCopy = [...show.gallery];
      galleryCopy = galleryCopy.filter((item) => item !== photo);
      setShow({ ...show, gallery: galleryCopy });
    } else if (type === "new") {
      let picturesCopy = [...pictures];
      picturesCopy.splice(photo, 1);
      setPictures(picturesCopy);

      let pictureNamesCopy = [...pictureNames];
      pictureNamesCopy.splice(photo, 1);
      setPictureNames(pictureNamesCopy);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    alertRef.current.showAlert();
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

    let btn = document.getElementById("save");
    if (btn.style.display === "" || btn.style.display === "none") {
      btn.style.display = "flex";
      btn.style.justifyContent = "center";
    }
  };

  const savePictures = () => {
    setLoading(true);
    if (pictures.length) {
      let galleryCopy = [...show.gallery];
      let promises = pictures.map(async (picture) => {
        let result = await axios.post(process.env.REACT_APP_CLOUDINARY, picture);
        return result.data.secure_url;
      });
      Promise.all(promises).then((values) => {
        values.forEach((value) => galleryCopy.push(value));
        axios
          .patch(`${url}/shows/update-gallery/${showId}`, {
            type: "show",
            gallery: galleryCopy,
          })
          .then(() => {
            setLoading(false);
            getShow();
            setPictures([]);
            setPictureNames([]);
            showAlert("success", "La gallerie photo a bien été mise à jour");
            let btn = document.getElementById("save");
            btn.style.display = "none";
          })
          .catch((error) => {
            console.log(error);
            showAlert(
              "error",
              "Erreur lors de la mise à jour de la gallerie photo, veuillez réessayer plus tard"
            );
          });
      });
    } else {
      axios
        .patch(`${url}/shows/update-gallery/${showId}`, {
          type: "show",
          gallery: show.gallery,
        })
        .then(() => {
          setLoading(false);
          getShow();
          setPictures([]);
          setPictureNames([]);
          showAlert("success", "La gallerie photo a bien été mise à jour");
          let btn = document.getElementById("save");
          btn.style.display = "none";
        })
        .catch((error) => {
          console.log(error);
          showAlert(
            "error",
            "Erreur lors de la mise à jour de la gallerie photo, veuillez réessayer plus tard"
          );
        });
    }
  };

  return (
    <div className="inside-app">
      <div className="card card-main photo-gallery">
        <h2>{show.title} - Gallerie photo </h2>
        <div className="div-buttons">
          <div className="go-back-div">
            <Link to="/spectacles">
              <button className="btn-grey-outlined go-back">
                <IoIosArrowBack /> Retour
              </button>
            </Link>
          </div>

          <div className="upload-multiple-pictures">
            <input
              type="file"
              name="file"
              id="file"
              className="inputfile"
              onChange={fileSelectedHandler}
              multiple
            />
            <label htmlFor="file" className="label">
              <IoIosAdd className="plus-icon" />
              Ajouter des photos
            </label>
          </div>

          <div className="save-div loading-div">
            {!loading ? (
              <button id="save" className="btn-outlined save" onClick={savePictures}>
                Enregistrer
              </button>
            ) : (
              <button id="save" className="btn-grey loading-btn save" disabled>
                Enregistrer
              </button>
            )}
          </div>
        </div>
        <ul className="no-list-style new-photos-list">
          {pictureNames.map((name, i) => (
            <li key={`pictureName${i}`}>
              {name} <VscClose className="pointer" onClick={() => deletePicture(i, "new")} />
            </li>
          ))}
        </ul>

        <ul className="no-list-style photos-list">
          {show.gallery.map((photo, i) => (
            <li key={`picture${i}`}>
              <BsTrash className="delete-picture" onClick={() => deletePicture(photo, "old")} />
              <img src={photo} alt={show.title} />
            </li>
          ))}
        </ul>
      </div>
      <Alert ref={alertRef} type={alert.type} message={alert.message} />
    </div>
  );
};

export default ShowGallery;
