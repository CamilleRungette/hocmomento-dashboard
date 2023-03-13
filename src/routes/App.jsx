import React from "react";
import { Routes, Route } from "react-router-dom";
import ActionGallery from "../Pages/ActionGallery";
import Actions from "../Pages/Actions";
import Agenda from "../Pages/Agenda";
import CreateAction from "../Pages/CreateAction";
import CreateShow from "../Pages/CreateShow";
import Dashboard from "../Pages/Dashboard";
import Messages from "../Pages/Messages";
import ShowGallery from "../Pages/ShowGallery";
import Shows from "../Pages/Shows";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/actions" element={<Actions />} />
        <Route path="/spectacles" element={<Shows />} />
        <Route path="/creation-spectacle" element={<CreateShow />} />
        <Route path="/creation-action" element={<CreateAction />} />
        <Route path="/spectacle/:id/gallerie" element={<ShowGallery />} />
        <Route path="/action-culturelle/:id/gallerie" element={<ActionGallery />} />
        <Route path="/messagerie" element={<Messages />} />
      </Routes>
    </div>
  );
};

export default App;
