import React, { useEffect, useLayoutEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { RiCalendarEventLine, RiHandHeartLine } from "react-icons/ri";
import { AiOutlineMail, AiOutlineMenuFold } from "react-icons/ai";
import { FaTheaterMasks } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import sidebarActions from "../redux/actions/sidebar.actions";

const Sidebar = ({ sidebarOpen, hideSidebarComp, showSidebarComp }) => {
  const [size, setSize] = useState(0);
  const [showOpened, setShowOpened] = useState(false);
  const [actionOpened, setActionOpened] = useState(false);

  useEffect(() => {
    let sidebar = document.getElementById("sidebar");
    if (sidebarOpen) {
      sidebar.style.transform = "translate(0rem)";
    } else {
      sidebar.style.transform = "translate(-14rem)";
    }
  }, [sidebarOpen]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
      if (window.innerWidth > 1000 && !sidebarOpen) showSidebarComp();
      if (window.innerWidth < 1000 && sidebarOpen) hideSidebarComp();
    }

    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const hideSidebar = () => {
    hideSidebarComp();
  };

  const checkSidebar = () => {
    if (size < 1000 && sidebarOpen) hideSidebar();
  };

  const showList = (prop) => (event) => {
    if (prop === "shows") {
      setShowOpened(!showOpened);
      let list = document.getElementById("list-shows");
      let icon = document.getElementById("icon-shows");
      if (!showOpened) {
        list.style.display = "block";
        icon.style.transform = "rotate(180deg)";
      } else {
        list.style.display = "none";
        icon.style.transform = "rotate(0deg)";
      }
    } else {
      setActionOpened(!actionOpened);
      let list = document.getElementById("list-actions");
      let icon = document.getElementById("icon-actions");
      if (!actionOpened) {
        list.style.display = "block";
        icon.style.transform = "rotate(180deg)";
      } else {
        list.style.display = "none";
        icon.style.transform = "rotate(0deg)";
      }
    }
  };

  return (
    <div id="sidebar" className="sidebar-main">
      <div className="top-div">
        <div className="icon-menu-div">
          {size < 1000 && <AiOutlineMenuFold className="pointer" onClick={hideSidebar} />}
        </div>
        <div className="logo-div">
          <img src="/images/logo_blanc.png" alt="Logo Hoc Momento" />
        </div>
      </div>

      <ul className="sidebar-navigation no-list-style">
        <li onClick={checkSidebar}>
          <Link to="/dashboard" className="link">
            <MdDashboard className="sidebar-icon " /> Tableau de bord
          </Link>
        </li>
        <li className="pointer">
          <span onClick={showList("shows")} className="open-li-span">
            <FaTheaterMasks className="sidebar-icon" /> Spectacles
            <IoIosArrowDown id="icon-shows" className="show-list" />
          </span>
          <ul id="list-shows" className="no-list-style sublist">
            <li onClick={checkSidebar}>
              <Link to="/creation-spectacle" className="link">
                Créer un spectacle
              </Link>
            </li>
            <li onClick={checkSidebar}>
              <Link to="/spectacles" className="link">
                Voir les spectacles
              </Link>
            </li>
          </ul>
        </li>
        <li className="pointer">
          <span className="open-li-span" onClick={showList("actions")}>
            <FaTheaterMasks className="sidebar-icon" /> Actions culturelles
            <IoIosArrowDown id="icon-actions" className="show-list" />
          </span>
          <ul id="list-actions" className="no-list-style sublist">
            <li>
              <Link to="/creation-action" className="link">
                Créer une action culturelle
              </Link>
            </li>
            <li>
              <Link to="/actions" className="link">
                Voir les actions culturelles
              </Link>
            </li>
          </ul>
        </li>
        <li onClick={checkSidebar}>
          <Link to="/agenda" className="link">
            <RiCalendarEventLine className="sidebar-icon " /> Agenda
          </Link>
        </li>

        <li onClick={checkSidebar}>
          <Link to="/" className="link">
            <AiOutlineMail className="sidebar-icon " /> Messagerie
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default connect(
  (state) => ({
    sidebarOpen: state.sidebarReducer.open,
  }),
  (dispatch) => ({
    hideSidebarComp: () => dispatch(sidebarActions.hideSibar()),
    showSidebarComp: () => dispatch(sidebarActions.showSidebar()),
  })
)(Sidebar);
